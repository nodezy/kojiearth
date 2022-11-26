// SPDX-License-Identifier: GPL-3.0-or-later

// koji.earth Staking Contract Version 1.0
// Stake your $KOJI for the Koji Comic NFT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./KojiFlux.sol";

interface IKojiNFT {
  function mintNFT(address recipient, uint256 minttier, uint256 id, bool superMinted, bool bnbMinted) external returns (uint256);
  function getIfMinted(address _recipient, uint256 _nftID) external view returns (bool);
  function getIfSuperMinted(address _recipient, uint256 _nftID) external view returns (bool);
  function getNFTwindow(uint256 _nftID) external view returns (uint256, uint256, uint256);
  function getNFTredeemable(uint256 _nftID) external view returns (bool); 
  function getNFTInfo(uint256 _nftID) external view returns(string[] memory, uint256[] memory, bool[] memory); 
  function getBNBtier1minted(address _recipient, uint _nftID) external view returns (bool);
  function getBNBtier2minted(address _recipient, uint _nftID) external view returns (bool);
  function getMintTotalsAfterWindow(uint _nftID, uint _tier) external view returns (uint);
}

// Interface for the Koji Oracle
interface IOracle {
    function getMinKOJITier1Amount(uint256 amount) external view returns (uint256); 
    function getMinKOJITier2Amount(uint256 amount) external view returns (uint256); 
    function getConversionRate() external view returns (uint256);
    function getKojiUSDPrice() external view returns (uint256, uint256, uint256);
    function getSuperMintKojiPrice(uint256 _amount) external view returns (uint256);
    function getSuperMintFluxPrice(uint256 _amount) external view returns (uint256);
    function gettier1USDprice() external view returns (uint,uint);
    function gettier2USDprice() external view returns (uint,uint);
}

// Interface for the rewards pool
interface IKojiRewards {
    function payPendingRewards(address _holder, uint256 _amount) external;
}

interface IMarketOrder {
    function marketBuy(address _token, address _recipient) external payable returns (uint);
}

// Allows another user(s) to change contract settings
contract Authorizable is Ownable {

    mapping(address => bool) public authorized;

    modifier onlyAuthorized() {
        require(authorized[_msgSender()] || owner() == address(_msgSender()), "E01");
        _;
    }

    function addAuthorized(address _toAdd) onlyOwner public {
        require(_toAdd != address(0), "E02");
        authorized[_toAdd] = true;
    }

    function removeAuthorized(address _toRemove) onlyOwner public {
        require(_toRemove != address(0), "E02");
        require(_toRemove != address(_msgSender()), "E03");
        authorized[_toRemove] = false;
    }

}

contract KojiStaking is Ownable, Authorizable, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    

    // Info of each user.
    struct UserInfo {
        uint256 amount; // How many tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
        uint256 usdEquiv; //USD equivalent of $Koji staked
        uint256 stakeTime; //block.timestamp of when user staked
        uint256 unstakeTime; //block.timestamp of when user unstaked
        uint256 supermintaccrualperiod; //amount of time to wait for supermint
        uint256 supermintstaketimer; //time at which supermint accrual starts
        uint tierAtStakeTime; //tier 1 or 2 when user staked
        bool blacklisted; //user is prevented from minting
        //
        // We do some fancy math here. Basically, any point in time, the amount of KOJIFLUX tokens
        // entitled to a user but is pending to be distributed is:
        //
        //   pending reward = (user.amount * pool.accKojiPerShare) - user.rewardDebt
        //
        // Whenever a user deposits or withdraws tokens to a pool. Here's what happens:
        //   1. The pool's `accKojiPerShare` (and `lastRewardBlock`) gets updated.
        //   2. User receives the pending reward sent to his/her address.
        //   3. User's `amount` gets updated.
        //   4. User's `rewardDebt` gets updated.
    }

    // Info of each pool.
    struct PoolInfo {
        IERC20 stakeToken; // Address of token contract.
        uint256 allocPoint; // How many allocation points assigned to this pool. KOJIFLUX tokens to distribute per block.
        uint256 lastRewardBlock; // Last block number that KOJIFLUX tokens distribution occurs.
        uint256 accKojiPerShare; // Accumulated KOJIFLUX tokens per share, times 1e12. See below.
        uint256 runningTotal; // Total accumulation of tokens (not including reflection, pertains to pool 1 ($Koji))
    }

    KojiFlux public immutable kojiflux; // The KOJIFLUX BEP20 Token.
    uint256 private kojiPerBlock; // KOJIFLUX tokens distributed per block. Use getKojiPerBlock() to get the updated reward.

    PoolInfo[] public poolInfo; // Info of each pool.
    mapping(uint256 => mapping(address => UserInfo)) public userInfo; // Info of each user that stakes LP tokens.
    address[] stakeholders;
    mapping (address => uint256) stakeholderIndexes;
    
    uint256 public totalAllocPoint; // Total allocation points. Must be the sum of all allocation points in all pools.
    uint256 public startBlock; // The block number when KOJIFLUX token mining starts.

    uint256 public blockRewardUpdateCycle = 1 days; // The cycle in which the kojiPerBlock gets updated.
    uint256 public blockRewardLastUpdateTime = block.timestamp; // The timestamp when the block kojiPerBlock was last updated.
    uint256 public blocksPerDay = 28800; // The estimated number of mined blocks per day, lowered so rewards are halved to start.
    uint256 public blockRewardPercentage = 10; // The percentage used for kojiPerBlock calculation.
    uint256 public poolReward = 1000000000000000000; // Starting basis for poolReward (default 1B).
    uint256 public kojiUsdPeg = 1000; // Default peg price of KOJI/USD to base conversion/bonus numbers on (default 1000).
    uint256 public tier1kojiPeg = 2000000000000000000; // tier1 stake peg @ 1000 Gwei to calc bonus (default 2B).
    uint256 public tier2kojiPeg = 250000000000000000; // tier1 stake peg @ 1000 Gwei to calc bonus (default 250M).
    uint256 public conversionRate = 1000; // Conversion rate of KOJIFLUX => $KOJI (default 100%).
    
    uint256 public upperLimiter = 201; // Percent numerator above minKojiTier1Stake so user can deposit enough for tier 1
    
    uint256 public minKojiTier1Stake = 1000000000000; // Min stake amount (default $1000 USD of $KOJI).
    uint256 public minKojiTier2Stake = 250000000000; // Min stake amount (default $250 USD of $KOJI).
    uint256 public superMintFluxPrice1 = 50000000000; // KOJIFLUX Cost to purchase a superMint ($50 FLUX default).
    uint256 public superMintFluxPrice2 = 12500000000; // KOJIFLUX Cost to purchase a superMint ($12.50 FLUX default).
    uint256 public superMintKojiPrice = 100000000000; // KOJIFLUX Cost to purchase a superMint ($100 of KOJI default, peggd to USD).
    uint256 public superMintIncrease = 25000000000; // KOJIFLUX price increase each time a user buys a supermint with KOJI
    uint256 private taxableAmount = 1000;
    uint256 public unstakePenaltyStartingTax = 30;
    uint256 public unstakePenaltyDefaultTax = 10;
    uint256 public unstakePenaltyDenominator = 1000;

    uint256 public penaltyPeriod = 86400;  // time in seconds of unstake penalty period (24 hours).
    uint256 public supermintAccrualFrame1 = 1814400; // time in seconds to accrue 1 supermint just by staking (default 21 days).
    uint256 public supermintAccrualFrame2 = 4233600; // time in seconds to accrue 1 supermint just by staking (default 49 days).

    bool public enableKojiSuperMintBuying = true; // Whether users can purchase superMints with $KOJI (default is false).
    bool public enableFluxSuperMintBuying = true; // Whether users can purchase superMints with $KOJI (default is false).
    bool public enableTaxlessWithdrawals = false; // Switch to use in case of farming contract migration.
    bool public convertRewardsEnabled = true; // Switch to enable/disable kojiflux -> koji oracle conversion.

    mapping(address => bool) public addedstakeTokens; // Used for preventing staked tokens from being added twice in add().
    mapping(address => uint256) private userBalance; // Balance of KOJIFLUX for each user that survives staking/unstaking/redeeming.
    mapping(address => uint256) private userRealized; // Balance of KOJIFLUX for each user that survives staking/unstaking/redeeming.
    mapping(address => bool) public superMint; // Whether the wallet has a mint booster allowing require bypass.
    mapping(address => uint) public superMintCounter; // Whether the wallet has a mint booster allowing require bypass.
    mapping(address => bool) public userStaked; // Denotes whether the user is currently staked or not, must be eligible for tiers 1/2 for true.
    
    address public NFTAddress; //NFT contract address
    address public KojiFluxAddress; //KOJIFLUX contract address
    address public DEAD = 0x000000000000000000000000000000000000dEaD;
    address public kojiaddress;
    address public marketorder;

    IOracle public oracle;
    IERC20 kojitoken;
    IKojiRewards public rewards;
    uint kojipurchased;

    event Unstake(address indexed user, uint256 indexed pid);
    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event KojiBuy(uint indexed bnbamount, uint indexed kojiamount);

    constructor(
        uint256 _startBlock,
        KojiFlux _kojiflux,
        address _oracle,
        address _rewards,
        address _token,
        address _marketorder
    ) {
        require(address(_kojiflux) != address(0), "E04");

        kojiflux = _kojiflux;
        KojiFluxAddress = address(_kojiflux);

        kojiaddress = _token;
        kojitoken = IERC20(_token); //$KOJI token
        
        startBlock = _startBlock;

        authorized[_msgSender()] = true;

        oracle = IOracle(_oracle); // Oracle
        rewards = IKojiRewards(_rewards); // Rewards contract
        marketorder = address(_marketorder);

    }

   // receive() external payable {}

    modifier updateKojiPerBlock() {
        (uint256 blockReward, bool update) = getKojiPerBlock();
        if (update) {
            kojiPerBlock = blockReward;
            blockRewardLastUpdateTime = block.timestamp;
        }
        _;
    }

    function getKojiPerBlock() public view returns (uint256, bool) {
        if (block.number < startBlock) {
            return (0, false);
        }

        if (block.timestamp >= getKojiPerBlockUpdateTime() || kojiPerBlock == 0) {
            return (poolReward.mul(blockRewardPercentage).div(100).div(blocksPerDay), true);
        }

        return (kojiPerBlock, false);
    }

    function getKojiPerBlockUpdateTime() public view returns (uint256) {
        // if blockRewardUpdateCycle = 1 day then roundedUpdateTime = today's UTC midnight
        uint256 roundedUpdateTime = blockRewardLastUpdateTime - (blockRewardLastUpdateTime % blockRewardUpdateCycle);
        // if blockRewardUpdateCycle = 1 day then calculateRewardTime = tomorrow's UTC midnight
        uint256 calculateRewardTime = roundedUpdateTime + blockRewardUpdateCycle;
        return calculateRewardTime;
    }

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    // Add a new token to the pool. Can only be called by the owner.
    // There are no functions in this contract for LP staking or adding secondary tokens to stake
    function add(
        uint256 _allocPoint,
        IERC20 _stakeToken,
        bool _withUpdate
    ) public onlyOwner {
        require(address(_stakeToken) != address(0), "E05");
        require(!addedstakeTokens[address(_stakeToken)], "E06");

        require(_allocPoint >= 1 && _allocPoint <= 100, "E07");

        if (_withUpdate) {
            massUpdatePools();
        }
        uint256 lastRewardBlock = block.number > startBlock ? block.number : startBlock;
        totalAllocPoint = totalAllocPoint.add(_allocPoint);
        poolInfo.push(PoolInfo({
            stakeToken : _stakeToken,
            allocPoint : _allocPoint,
            lastRewardBlock : lastRewardBlock,
            accKojiPerShare : 0,
            runningTotal : 0 
        }));

        addedstakeTokens[address(_stakeToken)] = true;
    }

    // Update the given pool's KOJIFLUX token allocation point. Can only be called by the owner.
    function set(
        uint256 _pid,
        uint256 _allocPoint,
        bool _withUpdate
    ) public onlyAuthorized {
        require(_allocPoint >= 1 && _allocPoint <= 100, "E07");

        if (_withUpdate) {
            massUpdatePools();
        }
        totalAllocPoint = totalAllocPoint.sub(poolInfo[_pid].allocPoint).add(_allocPoint);
        poolInfo[_pid].allocPoint = _allocPoint;
    }

    // Update the given pool's KOJIFLUX token allocation point when pool.
    function adjustPools(
        uint256 _pid,
        uint256 _allocPoint,
        bool _withUpdate
    ) internal {
        require(_allocPoint >= 1 && _allocPoint <= 100, "E07");

        if (_withUpdate) {
            updatePool(_pid);
        }
        totalAllocPoint = totalAllocPoint.sub(poolInfo[_pid].allocPoint).add(_allocPoint);
        poolInfo[_pid].allocPoint = _allocPoint;
    }

    // View function to see pending KOJIFLUX tokens on frontend.
    function pendingRewards(uint256 _pid, address _user) public view returns (uint256) { 
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        uint256 accKojiPerShare = pool.accKojiPerShare;
        (,uint256 bonusRate) = getConversionAmount(user.amount,_user);

        uint256 tokenSupply = kojiflux.balanceOf(address(this));
        if (block.number > pool.lastRewardBlock && tokenSupply != 0) {
            uint256 multiplier = block.number.sub(pool.lastRewardBlock);
            (uint256 blockReward, ) = getKojiPerBlock();
            uint256 kojiReward = multiplier.mul(blockReward).mul(pool.allocPoint).div(totalAllocPoint);
            accKojiPerShare = accKojiPerShare.add(kojiReward.mul(1e12).div(tokenSupply));
        }
        uint256 newamount = user.amount.mul(accKojiPerShare).div(1e12).sub(user.rewardDebt);
        
        return newamount.mul(bonusRate).div(100);
        
    }

    // Update reward variables for all pools. Be careful of gas spending!
    function massUpdatePools() public onlyAuthorized {
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            updatePool(pid);
        }
    }

    // Update reward variables of the given pool to be up-to-date when tokenSupply changes
    // For every deposit/withdraw pool recalculates accumulated token value
    function updatePool(uint256 _pid) public updateKojiPerBlock {
        PoolInfo storage pool = poolInfo[_pid];
        if (block.number <= pool.lastRewardBlock) {
            return;
        }

        //uint256 tokenSupply = pool.runningTotal; 
        uint256 tokenSupply = kojiflux.balanceOf(address(this));
        if (tokenSupply == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }

        uint256 multiplier = block.number.sub(pool.lastRewardBlock);
        uint256 kojiReward = multiplier.mul(kojiPerBlock).mul(pool.allocPoint).div(totalAllocPoint);

        // No minting is required, the contract should have KOJIFLUX token balance pre-allocated
        // Accumulated KOJIFLUX per share is stored multiplied by 10^12 to allow small 'fractional' values
        pool.accKojiPerShare = pool.accKojiPerShare.add(kojiReward.mul(1e12).div(tokenSupply));
        pool.lastRewardBlock = block.number;
    }

    function updatePoolReward(uint256 _amount) public onlyAuthorized {
        poolReward = _amount;
    }

    // Deposit tokens/$KOJI to KojiFarming for KOJIFLUX token allocation.
    function deposit(uint256 _pid, uint256 _amount) public nonReentrant {

        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_msgSender()];

        updatePool(_pid);

        (uint256 minstake1, uint256 minstake2) = getOracleMinMax();

        if (_amount > 0) {
          
            if(user.amount == 0) { // We only want the minimum to apply on first deposit, not subsequent ones
                require(_amount >= minstake2 && _amount <= minstake1.mul(upperLimiter).div(100)  , "E42");
                user.stakeTime = block.timestamp;
                user.unstakeTime = block.timestamp;
                user.supermintstaketimer = block.timestamp;

            } else { // If user has already deposited, secure rewards before reconfiguring rewardDebt
            
                require(user.amount.add(_amount) <= minstake1.mul(upperLimiter).div(100), "E41");
                userBalance[_msgSender()] = userBalance[_msgSender()].add(pendingRewards(_pid, _msgSender()));
                user.unstakeTime = block.timestamp;

                 if (userBalance[_msgSender()] > 0) {
            
                    (userBalance[_msgSender()],) = getConversionAmount(userBalance[_msgSender()], _msgSender());
                }
            }

            pool.runningTotal = pool.runningTotal.add(_amount);
            user.amount = user.amount.add(_amount);
            pool.stakeToken.safeTransferFrom(address(_msgSender()), address(this), _amount);
            
            user.usdEquiv = getUSDequivalent(user.amount);
            user.tierAtStakeTime = getTierequivalent(user.amount);
            user.supermintaccrualperiod = getOverStakeTimeframe(user.tierAtStakeTime,user.amount);
            user.blacklisted = false;
        
            if (user.tierAtStakeTime == 1 || user.tierAtStakeTime == 2) {
                addStakeholder(_msgSender());

                if(userBalance[_msgSender()] > 0) {
                    (,uint bonusrate) = getConversionAmount(userBalance[_msgSender()], _msgSender());
                    userBalance[_msgSender()] = userBalance[_msgSender()].mul(100).div(bonusrate);
                }
                

            }

            user.rewardDebt = user.amount.mul(pool.accKojiPerShare).div(1e12);
            emit Deposit(_msgSender(), _pid, _amount);

        } else {
            require(_amount > 0, "E45");
        }
    }

    // Withdraw tokens from KojiFarming
    function withdraw(uint256 _pid, uint256 _amount) public nonReentrant {

        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_msgSender()];
        uint256 userAmount = user.amount;
        require(_amount > 0, "E08");
        require(user.amount >= _amount, "E09");

        updatePool(_pid);
    
        uint256 netamount = _amount; //stack too deep
        uint bonusrate;

        userBalance[_msgSender()] = userBalance[_msgSender()].add(pendingRewards(_pid, _msgSender()));

        if (userBalance[_msgSender()] > 0) {
            
            (userBalance[_msgSender()],) = getConversionAmount(userBalance[_msgSender()], _msgSender());
             
        }

        if(!enableTaxlessWithdrawals) { // Switch for tax free / reflection free withdrawals

            netamount = getWithdrawResult(_msgSender(), _amount);
        }

        pool.runningTotal = pool.runningTotal.sub(_amount);
        user.amount = user.amount.sub(_amount);

        pool.stakeToken.safeTransfer(address(_msgSender()), netamount);
        emit Withdraw(_msgSender(), _pid, netamount);         

        if (userAmount == _amount) { // User is retrieving entire balance, set rewardDebt to zero
            user.rewardDebt = 0;
            user.unstakeTime = block.timestamp;
            user.usdEquiv = 0;
            user.tierAtStakeTime = 0;
            user.blacklisted = true;
            user.supermintstaketimer = block.timestamp;
            user.supermintaccrualperiod = 9999999999;
            removeStakeholder(_msgSender());
        } else {
            if (getTierequivalent(user.amount) == 1) {
                user.usdEquiv = getUSDequivalent(user.amount);
                user.unstakeTime = block.timestamp;
                user.tierAtStakeTime = 1;
                user.blacklisted = false;
                user.supermintaccrualperiod = getOverStakeTimeframe(user.tierAtStakeTime,user.amount);
                (,bonusrate) = getConversionAmount(userBalance[_msgSender()], _msgSender());
                userBalance[_msgSender()] = userBalance[_msgSender()].mul(100).div(bonusrate);
            } else {
                if (getTierequivalent(user.amount) == 2) {
                user.usdEquiv = getUSDequivalent(user.amount);
                user.unstakeTime = block.timestamp;
                user.tierAtStakeTime = 2;
                user.blacklisted = false;
                user.supermintaccrualperiod = getOverStakeTimeframe(user.tierAtStakeTime,user.amount);
                (,bonusrate) = getConversionAmount(userBalance[_msgSender()], _msgSender());
                userBalance[_msgSender()] = userBalance[_msgSender()].mul(100).div(bonusrate);
                } else {
                    user.usdEquiv = getUSDequivalent(user.amount);
                    user.unstakeTime = block.timestamp;
                    user.tierAtStakeTime = 0;
                    user.blacklisted = true;
                    user.supermintaccrualperiod = 9999999999;
                }
            }
            
            user.rewardDebt = user.amount.mul(pool.accKojiPerShare).div(1e12); 
        }                      
    }

    function setBlockRewardUpdateCycle(uint256 _blockRewardUpdateCycle) external onlyAuthorized {
        require(_blockRewardUpdateCycle > 0, "E10");
        blockRewardUpdateCycle = _blockRewardUpdateCycle;
    }

    // Just in case an adjustment is needed since mined blocks per day changes constantly depending on the network
    function setBlocksPerDay(uint256 _blocksPerDay) external onlyAuthorized {
        require(_blocksPerDay >= 1 && _blocksPerDay <= 28800, "E11");
        blocksPerDay = _blocksPerDay;
    }

    function setBlockRewardPercentage(uint256 _blockRewardPercentage) external onlyAuthorized {
        require(_blockRewardPercentage >= 1 && _blockRewardPercentage <= 100, "E12");
        blockRewardPercentage = _blockRewardPercentage;
    }

    // This will allow to rescue ETH sent to the contract
    /*function rescueETHFromContract() external onlyAuthorized {
        address payable _owner = payable(_msgSender());
        _owner.transfer(address(this).balance);
    }*/

    // Function to allow admin to claim *other* ERC20 tokens sent to this contract (by mistake)
    function transferERC20Tokens(address _tokenAddr, address _to, uint _amount) public onlyAuthorized {
        IERC20(_tokenAddr).transfer(_to, _amount);
    }

    // Returns total stake amount ($KOJI token) and address of that token respectively
    function getTotalStake(uint256 _pid, address _user) external view returns (uint256, IERC20) { 
         PoolInfo storage pool = poolInfo[_pid];
         UserInfo storage user = userInfo[_pid][_user];

        return (user.amount, pool.stakeToken);
    }

    // Gets the full ledger of deposits into each pool
    function getRunningDepositTotal(uint256 _pid) external view returns (uint256) { 
         PoolInfo storage pool = poolInfo[_pid];

        return (pool.runningTotal);
    }

    // Gets the total of all pending rewards from each pool
    function getTotalPendingRewards(address _user) public view returns (uint256) { 

        return pendingRewards(0, _user);
    }

    // Gets the total amount of rewards secured (not pending)
    function getAccruedRewards(address _user) external view returns (uint256) { 
        return userBalance[_user];
    }

    // Gets the total of pending + secured rewards
    function getTotalRewards(address _user) public view returns (uint256) { 
       
        return getTotalPendingRewards(_user).add(userBalance[_user]);
    }

    // Moves all pending rewards into the accrued array
    function redeemTotalRewards(address _user) public { 

        require(_msgSender() == _user || _msgSender() == address(this) || _msgSender() == address(rewards), "E01");

        PoolInfo storage pool = poolInfo[0];
        UserInfo storage user = userInfo[0][_user];

        updatePool(0);
                
        userBalance[_user] = userBalance[_user].add(pendingRewards(0, _user));

        user.rewardDebt = user.amount.mul(pool.accKojiPerShare).div(1e12); 

    }

    // Convert KojiFlux to $KOJI
    function convertAndWithdraw(uint _percentage) external nonReentrant {
    
        UserInfo storage user = userInfo[0][_msgSender()];

        require(user.amount > 0, "E13");

        redeemTotalRewards(_msgSender());
        
        require(userBalance[_msgSender()] > 0, "E14");

        uint256 fluxamount = userBalance[_msgSender()].mul(_percentage).div(100);
        (uint256 newamount,) = getConversionAmount(fluxamount, _msgSender());

        rewards.payPendingRewards(_msgSender(), newamount);

        userRealized[_msgSender()] = userRealized[_msgSender()].add(fluxamount);
        userBalance[_msgSender()] = userBalance[_msgSender()].sub(fluxamount);
        
    }

    // Set NFT contract address
     function setNFTAddress(address _address) external onlyAuthorized {
        NFTAddress = _address;
    }

    // Set KOJIFLUX contract address
     function setKojiFluxAddress(address _address) external onlyAuthorized {
        KojiFluxAddress = _address;
    }

    // Redeem the NFT
    function redeem(uint256 _nftID, uint256 _tier) external nonReentrant {

        require(_tier > 0 && _tier < 3, "E43");

        bool[] memory bools = new bool[](4);
        
        (,,bools) = IKojiNFT(NFTAddress).getNFTInfo(_nftID);

        require(bools[3], "E44");

        // Get user tier/info
        UserInfo storage user = userInfo[0][_msgSender()];

        bool minted = IKojiNFT(NFTAddress).getIfMinted(_msgSender(), _nftID);
        (uint256 timestart,,) = IKojiNFT(NFTAddress).getNFTwindow(_nftID);
        bool redeemable = IKojiNFT(NFTAddress).getNFTredeemable(_nftID);
        require(redeemable, "E15");
        require(!minted, "E16");
        require(user.tierAtStakeTime == _tier, "E17");
        require(user.stakeTime <= timestart, "E18");
        
        IKojiNFT(NFTAddress).mintNFT(_msgSender(), _tier, _nftID, false, false);
           
    }

    // Redeem the NFT via supermint
    function supermint(uint256 _nftID) external nonReentrant {

        bool[] memory bools = new bool[](4);
        
        (,,bools) = IKojiNFT(NFTAddress).getNFTInfo(_nftID);

        require(bools[3], "E44");

        if (superMint[_msgSender()]) {

            // Get user tier/info
            UserInfo storage user = userInfo[0][_msgSender()];

            (uint256 timestart,,) = IKojiNFT(NFTAddress).getNFTwindow(_nftID);
            bool superminted = IKojiNFT(NFTAddress).getIfSuperMinted(_msgSender(), _nftID);

            require(!superminted, "E16");
            require(block.timestamp >= timestart, "E18");
            require(user.tierAtStakeTime != 0, "E20");

            superMint[_msgSender()] = false;
            IKojiNFT(NFTAddress).mintNFT(_msgSender(), 1, _nftID, true, false);
            IKojiNFT(NFTAddress).mintNFT(_msgSender(), 2, _nftID, true, false);

        } else {
            require(superMint[_msgSender()], "E21");
        }
    }

    // Purchase the NFT via BNB  
    function purchasetier(uint256 _nftID, uint256 _tier) external payable nonReentrant {
        require(_tier > 0 && _tier < 3, "E43");

        bool[] memory bools = new bool[](4);
        
        (,,bools) = IKojiNFT(NFTAddress).getNFTInfo(_nftID);

        require(bools[3], "E44");

        (uint256 timestart,,) = IKojiNFT(NFTAddress).getNFTwindow(_nftID);
        require(block.timestamp >= timestart, "E18");
        uint price;
        uint increase;

        if(_tier == 1) {
            (price, increase) = oracle.gettier1USDprice();
            require(!IKojiNFT(NFTAddress).getBNBtier1minted(_msgSender(), _nftID),"E26");
        } else {
            (price, increase) = oracle.gettier2USDprice();
            require(!IKojiNFT(NFTAddress).getBNBtier2minted(_msgSender(), _nftID),"E26");
        }
        
        require(price > 0, "E25");
        
        uint mintsAfterWindow = IKojiNFT(NFTAddress).getMintTotalsAfterWindow(_nftID, _tier);

        if(mintsAfterWindow > 0) {price = price.add(mintsAfterWindow.mul(increase));}

        require(msg.value >= price, "E40");
        
        uint amountpurchased = IMarketOrder(marketorder).marketBuy{value : msg.value}(kojiaddress, DEAD);

        IKojiNFT(NFTAddress).mintNFT(_msgSender(), _tier, _nftID, false, true);

        emit KojiBuy(msg.value, amountpurchased);
    }

    function setKojiFluxBalance(address _address, uint256 _amount) public {
        require(authorized[_msgSender()] || _msgSender() == address(rewards), "E01");
        userBalance[_address] = _amount;
    }

    function reduceKojiFluxBalance(address _address, uint256 _amount) public onlyAuthorized {
        userBalance[_address] = userBalance[_address].sub(_amount);
    }

    function increaseKojiFluxBalance(address _address, uint256 _amount) public onlyAuthorized {
        userBalance[_address] = userBalance[_address].add(_amount);
    }

    function getKojiFluxBalance(address _address) public view returns (uint256) {
        return userBalance[_address];
    }

    // Set the conversion rate between KOJIFLUX and the $koji token
    function setConverstionRate(uint256 _rate) public onlyAuthorized {
        conversionRate = _rate;
    }

    // Get rate of KojiFlux/$Koji conversion
    function getConversionRate() external view returns (uint256) {
        return conversionRate;
    }

    function getOracleConversionRate() public view returns (uint256) {
        (,,uint256 kojiusd) = oracle.getKojiUSDPrice();
        if(kojiusd < kojiUsdPeg || !convertRewardsEnabled) {
            return conversionRate;
        } else {
            uint256 newrate = kojiusd.mul(100).div(kojiUsdPeg); //result in 100s (div by 1000 to get decimal)
            uint256 newconversionRate = conversionRate.sub(newrate); //1000 minus 125 = 875 (87.5%)
            return newconversionRate;
        }
    }

    // Get amount of Koji for KojiFlux
    function getConversionAmount(uint256 _amount, address _address) public view returns (uint256,uint256) {

        uint256 bonusRate = 100; 
        uint256 newconversionRate = getOracleConversionRate();

        uint256 newamount = _amount.mul(newconversionRate).div(1000); //should reduce if KOJI price increases

        UserInfo storage user0 = userInfo[0][_address]; //now add bonus in for smaller stakers based on peg tier1/tier2 amount
        if (user0.tierAtStakeTime == 1) {
            if(user0.amount > tier1kojiPeg) {
                bonusRate = 200;
            }
            if(user0.amount <= tier1kojiPeg) { // user is staking below peg amount, calc bonus
                bonusRate = tier1kojiPeg.mul(150).div(user0.amount); // 2B div 1.5B = 1.3x bonus rate
            }
        } else {
            if (user0.tierAtStakeTime == 2) {
                uint256 halftier1kojiPeg = tier1kojiPeg.div(2);
                if(user0.amount >= halftier1kojiPeg) { 
                    bonusRate = tier1kojiPeg.mul(100).div(user0.amount); // 2B div 1B = 2x bonus rate
                }
                if(user0.amount >= tier2kojiPeg && user0.amount < halftier1kojiPeg) { // user is staking above tier 2 amount but still tier 2, calc bonus based on tier1
                    bonusRate = halftier1kojiPeg.mul(100).div(user0.amount); // 1B div 500M = 2x bonus rate
                }
                if(user0.amount <= tier2kojiPeg) { // user is staking below peg amount, calc bonus
                    bonusRate = tier2kojiPeg.mul(100).div(user0.amount); // 250M div 125M = 2x bonus rate
                }
            } else {
                newamount = _amount.mul(conversionRate).div(1000); //keep rewards up for stakers less than tier 2 (tier 0)
            }
        }
        
        newamount = newamount.mul(bonusRate).div(100);
            
        return (newamount,bonusRate);
    }

    // Get dollar amount of Koji for KojiFlux
    function getConversionPrice(uint256 _amount) public view returns (uint256) {
        uint256 netamount = _amount.mul(getOracleConversionRate()).div(100);
        (,,uint256 kojiusd) = oracle.getKojiUSDPrice();
        uint256 netusdamount = kojiusd.mul(netamount);

        return netusdamount;
    }

    // Get pending dollar amount of Koji for KojiFlux
    function getPendingUSDRewards(address _holder) public view returns (uint256) { 

        return getConversionPrice(getTotalRewards(_holder)).div(10**9);
    }

    // Sets min/max staking amounts for Koji token
    function setKojiStakingMinMax(uint256 _min1, uint256 _min2) external onlyAuthorized {

        require(_min2 > 0, "E27");
        require(_min1 > _min2, "E28");
        
        minKojiTier1Stake = _min1;
        minKojiTier2Stake = _min2;
    }

    // Get the min and max staking amounts 
    function getOracleMinMax() public view returns (uint256, uint256) {
        
        return (oracle.getMinKOJITier1Amount(minKojiTier1Stake), oracle.getMinKOJITier2Amount(minKojiTier2Stake)); //tier1 min, tier2 min
    }

    function getOracleMaxStaking() public view returns (uint256, uint256) {
       
        return (oracle.getMinKOJITier1Amount(minKojiTier1Stake).mul(200).div(100), oracle.getMinKOJITier2Amount(minKojiTier2Stake).mul(400).div(100)); //tier 1 max, tier 2 max
    }


    // Gets Tier equivalent of input amount of KOJI tokens
    function getTierequivalent(uint256 _amount) public view returns (uint256) {

        uint256 totalvalue = getUSDequivalent(_amount);

        if (totalvalue >= minKojiTier1Stake.sub(1000000000)) {
            return 1;
        } else {
            if (totalvalue >= minKojiTier2Stake.sub(1000000000) && totalvalue < minKojiTier1Stake.sub(1000000000)) {
                return 2;
            } else {
                return 0;
            }
        }
    }

    // Gets multiplier for supermint accrual period reduction
    function getOverStakeTimeframe(uint _usertier, uint256 _amount) internal view returns (uint256) {

        uint256 multiplier = 100;

        (uint256 tier1min, uint256 tier2min) = getOracleMinMax();

        if (_usertier == 1) {
            if(_amount >= tier1min) { multiplier = _amount.mul(100).div(tier1min);}

            if (multiplier > 150) {multiplier = 150;}

            return supermintAccrualFrame1.mul(100).div(multiplier);

        } else {
            if(_amount >= tier2min) { multiplier = _amount.mul(100).div(tier2min);}

            if (multiplier > 200) {multiplier = 200;}

            return supermintAccrualFrame2.mul(100).div(multiplier);
        }
        
    }

    // Gets multiplier for flux supermint purchases
    function getSuperMintFluxPrice(uint _usertier, uint256 _useramount) public view returns (uint256) {

        uint256 multiplier = 100;
        uint256 fluxprice;

        (uint256 tier1min, uint256 tier2min) = getOracleMinMax();

        if (_usertier == 1) {
            if(_useramount >= tier1min) { multiplier = _useramount.mul(100).div(tier1min);}

            if (multiplier > 500) {multiplier = 500;}

            fluxprice = oracle.getSuperMintFluxPrice(superMintFluxPrice1);

            return fluxprice.mul(multiplier).div(100);

        } else {
            if(_useramount >= tier2min) { multiplier = _useramount.mul(100).div(tier2min);}

            if (multiplier > 2000) {multiplier = 2000;}

            fluxprice = oracle.getSuperMintFluxPrice(superMintFluxPrice2);

            return fluxprice.mul(multiplier).div(100);
        }
        
    }

    function getSuperMintKojiPrice() external view returns(uint256) {
        return oracle.getSuperMintKojiPrice(superMintKojiPrice).add((oracle.getSuperMintKojiPrice(superMintIncrease)).mul(superMintCounter[_msgSender()]));
    }

    // Gets USD equivalent of input amount of KOJI tokens
    function getUSDequivalent(uint256 _amount) public view returns (uint256) {
        (,,uint256 kojiusdvalue) = oracle.getKojiUSDPrice();

        return kojiusdvalue.mul(_amount).div(10**9);
    }

    // Function to buy superMint internally with KojiFlux
    function buySuperMintFlux() external nonReentrant {
        UserInfo storage user = userInfo[0][_msgSender()]; 

        require(!user.blacklisted, "E29");
        require(enableFluxSuperMintBuying, "E30");
        require(!superMint[_msgSender()], "E31");
        
        (,bool supermintunlocked) = getAccrualTime(_msgSender());

        require(supermintunlocked, "E32");

        redeemTotalRewards(_msgSender());

        uint256 fluxprice = getSuperMintFluxPrice(user.tierAtStakeTime,user.amount);

        require(userBalance[_msgSender()] >= fluxprice, "E33");

        userBalance[_msgSender()] = userBalance[_msgSender()].sub(fluxprice);
        superMint[_msgSender()] = true;

        user.supermintstaketimer = block.timestamp;
    }

    // Function to buy superMint with $KOJI
    function buySuperMintKoji() external nonReentrant {
        require(enableKojiSuperMintBuying, "E34");
        uint256 kojisupermintprice = oracle.getSuperMintKojiPrice(superMintKojiPrice);
        kojisupermintprice = kojisupermintprice.add((oracle.getSuperMintKojiPrice(superMintIncrease)).mul(superMintCounter[_msgSender()]));
        require(kojitoken.balanceOf(_msgSender()) >= kojisupermintprice, "E35"); 
        require(!superMint[_msgSender()], "E31");

        IERC20(kojitoken).transferFrom(_msgSender(), address(rewards), kojisupermintprice);
        superMint[_msgSender()] = true;
        superMintCounter[_msgSender()]++;
    }

    function changeOracle(address _oracle) external onlyAuthorized {
        oracle = IOracle(_oracle);
    }

    function changeRewards(address _rewards) external onlyAuthorized {
        rewards = IKojiRewards(_rewards);
    }

    function changeUpperLimiter(uint256 _upperlimit) external onlyAuthorized {
        require(_upperlimit > 100, "E36");
        upperLimiter = _upperlimit;
    }

    function addStakeholder(address stakeholder) internal {
        if (userStaked[stakeholder]) {
            return;
        } else {
            stakeholderIndexes[stakeholder] = stakeholders.length;
            stakeholders.push(stakeholder);
            userStaked[stakeholder] = true;
        }
        
    }

    function removeStakeholder(address stakeholder) internal {
         if (!userStaked[stakeholder]) {
            return;
        } else {
        stakeholders[stakeholderIndexes[stakeholder]] = stakeholders[stakeholders.length-1];
        stakeholderIndexes[stakeholders[stakeholders.length-1]] = stakeholderIndexes[stakeholder];
        stakeholders.pop();
        userStaked[stakeholder] = false;
        }
    }

    /*function giveAllsuperMint() external onlyAuthorized {

        uint256 length = stakeholders.length;

        for (uint256 x = 0; x < length; ++x) {

             superMint[stakeholders[x]] = true;
        }

    }*/

    function getUnstakePenalty(uint256 _staketime) public view returns (uint256) {

        uint256 totaldays = block.timestamp.sub(_staketime);
        
        totaldays = totaldays.div(penaltyPeriod);

        if (totaldays >= unstakePenaltyStartingTax) {

            return unstakePenaltyDefaultTax;

        } else {

            uint256 totalunstakefee  = unstakePenaltyStartingTax.sub(totaldays);

            if (totalunstakefee <= unstakePenaltyDefaultTax) {
                return unstakePenaltyDefaultTax;
            } else {
                return totalunstakefee;
            }

        }


    }

    function setSuperMintBuying(bool _fluxbuying, bool _kojibuying) external onlyAuthorized {
        enableFluxSuperMintBuying = _fluxbuying;
        enableKojiSuperMintBuying = _kojibuying;
    }

    function setSuperMintPrices(uint256 _fluxprice1, uint256 _fluxprice2, uint256 _kojiprice, uint256 _increase) external onlyAuthorized  {
        superMintFluxPrice1 = _fluxprice1;
        superMintFluxPrice2 = _fluxprice2;
        superMintKojiPrice = _kojiprice;
        superMintIncrease = _increase;
    }

    // Get the holder rewards of users staked $koji if they were to withdraw
    function getWithdrawResult(address _holder, uint256 _amount) public view returns (uint256) {

        PoolInfo storage pool = poolInfo[0];
        UserInfo storage user = userInfo[0][_holder];

        if (_amount == 0) { //pass 0 to use full user.amount, otherwise pass partial amount
            _amount = user.amount;
        } 

        uint256 netamount;

        uint256 tokenSupply = pool.stakeToken.balanceOf(address(this)); // Get total amount of KOJI tokens
        uint256 totalRewards = tokenSupply.sub(pool.runningTotal); // Get difference between contract address amount and ledger amount
        uint256 percentRewards = _amount.mul(100).div(pool.runningTotal); // Get % of share out of 100
        uint256 reflectAmount = percentRewards.mul(totalRewards).div(100); // Get % of reflect amount           
        uint256 taxfeenumerator = getUnstakePenalty(user.unstakeTime);
        uint256 taxfee = taxableAmount.sub(taxableAmount.mul(taxfeenumerator).div(unstakePenaltyDenominator));
        netamount = _amount.mul(taxfee).div(unstakePenaltyDenominator);
        netamount = netamount.add(reflectAmount);

        return netamount;

    }

    function getHolderRewards(address _address, uint256 _amount) external view returns (uint256) {
        PoolInfo storage pool = poolInfo[0];
        UserInfo storage user = userInfo[0][_address];

        if (_amount == 0) { //pass 0 to use full user.amount, otherwise pass partial amount
            _amount = user.amount;
        } 
        uint256 tokenSupply = pool.stakeToken.balanceOf(address(this)); // Get total amount of tokens
        uint256 totalRewards = tokenSupply.sub(pool.runningTotal); // Get difference between contract address amount and ledger amount
        
         if (totalRewards > 0) { // Include reflection
            uint256 percentRewards = _amount.mul(100).div(pool.runningTotal); // Get % of share out of 100
            uint256 reflectAmount = percentRewards.mul(totalRewards).div(100); // Get % of reflect amount

            return reflectAmount; // return reflection amount

         } else {

             return 0;

         }

    }

    function setTaxlessWithdrawals(bool _status) external onlyAuthorized {
        enableTaxlessWithdrawals = _status;
    }

    function setSuperMintStatus(address _holder, bool _status) external { //***remove or add onlyAuthorized for production
        superMint[_holder] = _status;
    }

    // remaining time until user can unlock a supermint purchased with FLUX
    function getAccrualTime(address _holder) public view returns (uint256,bool) {
        UserInfo storage user = userInfo[0][_holder]; 

        uint256 timeleft = user.supermintstaketimer.add(user.supermintaccrualperiod);

        if (timeleft > block.timestamp) {
            return (timeleft.sub(block.timestamp),false);
        } else {
            return (0,true);
        }
    
    }

    // Set FLUX -> KOJI oracle conversion enabled/disabled
    function setConvertRewards(bool _status) external onlyAuthorized {
        convertRewardsEnabled = _status;
    }

    function setTimePeriods(uint256 _penaltyPeriod, uint256 _tier1smperiod, uint256 _tier2smperiod) external onlyAuthorized {
        require(_penaltyPeriod > 0, "E37");
        require(_tier1smperiod > 0, "E38");
        require(_tier2smperiod > 0, "E39");
        penaltyPeriod = _penaltyPeriod;
        supermintAccrualFrame1 = _tier1smperiod;
        supermintAccrualFrame2 = _tier2smperiod;
    }

    function changePegAmounts(uint256 _kojiusd, uint256 _tier1peg, uint256 _tier2peg) external onlyAuthorized {
        kojiUsdPeg = _kojiusd;
        tier1kojiPeg = _tier1peg;
        tier2kojiPeg = _tier2peg;
    }

}
