// SPDX-License-Identifier: MIT

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

// Interface for minting NFTs
interface IKojiNFT {
  function mintNFT(address recipient, uint256 minttier, uint256 id) external returns (uint256);
  function getIfMinted(address _recipient, uint256 _nftID) external view returns (bool);
  function getIfMintedTier(address _recipient, uint256 _nftID, uint256 minttier) external view returns (bool);
  function getNFTwindow(uint256 _nftID) external view returns (uint256, uint256);
}

// Interface for the Koji Oracle
interface IOracle {
    function getMinKOJITier1Amount(uint256 amount) external view returns (uint256); 
    function getMinKOJITier2Amount(uint256 amount) external view returns (uint256); 
    function getConversionRate() external view returns (uint256);
    function getRewardConverted(uint256 amount) external view returns (uint256);
    function getKojiUSDPrice() external view returns (uint256, uint256, uint256);
}

// Interface for the rewards pool
interface IKojiRewards {
    function payPendingRewards(address _holder, uint256 _amount) external;
}

// Allows another user(s) to change contract settings
contract Authorizable is Ownable {

    mapping(address => bool) public authorized;

    modifier onlyAuthorized() {
        require(authorized[_msgSender()] || owner() == address(_msgSender()), "Sender is not authorized");
        _;
    }

    function addAuthorized(address _toAdd) onlyOwner public {
        require(_toAdd != address(0), "Address is the zero address");
        authorized[_toAdd] = true;
    }

    function removeAuthorized(address _toRemove) onlyOwner public {
        require(_toRemove != address(0), "Address is the zero address");
        require(_toRemove != address(_msgSender()), "Sender cannot remove themself");
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
    uint256 public conversionRate = 100; // Conversion rate of KOJIFLUX => $KOJI (default 100%).
    uint256 public bonusRate = 120; // Rate of bonus for late stakers.
    uint256 public stakeBonusStart; // Start time of bonus for stakers.
    uint256 public stakeBonusEnd = 259200; // End time of bonus for stakers (default 1 month).

    uint256 public upperLimiter = 101; // Percent numerator above minKojiTier1Stake so user can deposit enough for tier 1
    bool public enableRewardWithdraw = false; // Whether KOJIFLUX is withdrawable from this contract (default false).
    bool public boostersEnabled = true; // Whether we can use boosters or not.
    uint256 public minKojiTier1Stake = 1500000000000; // Min stake amount (default $1500 USD of $KOJI).
    uint256 public minKojiTier2Stake = 500000000000; // Min stake amount (default $500 USD of $KOJI).
    uint256 public promoAmount = 200000000000; // Amount of KOJIFLUX to give to new stakers (default 200 KOJIFLUX).
    uint256 public superMintFluxPrice = 10000000000000000; // KOJIFLUX Cost to purchase a superMint (10M default).
    uint256 public superMintKojiPrice = 100000000000000000; // KOJIFLUX Cost to purchase a superMint (100M default).
    uint256 internal taxableAmount = 100;
    uint256 public unstakePenaltyStartingTax = 30;
    uint256 public unstakePenaltyDefaultTax = 10;
    uint256 public unstakePenaltyDenominator = 1000;

    bool public promoActive = false; // Whether the promotional amount of KOJIFLUX is given out to new stakers (default is True).
    bool public enableKojiSuperMintBuying = false; // Whether users can purchase superMints with $KOJI (default is false).
    bool public enableFluxSuperMintBuying = false; // Whether users can purchase superMints with $KOJI (default is false).
    bool public enableTaxlessWithdrawals = false; // Switch to use in case of farming contract migration.
    bool public stakeBonusEnabled = false; // Switch to enable/disable kojiflux -> koji bonus during conversion.

    mapping(address => bool) public addedstakeTokens; // Used for preventing staked tokens from being added twice in add().
    mapping(address => uint256) private userBalance; // Balance of KOJIFLUX for each user that survives staking/unstaking/redeeming.
    mapping(address => uint256) private userRealized; // Balance of KOJIFLUX for each user that survives staking/unstaking/redeeming.
    mapping(address => bool) private promoWallet; // Whether the wallet has received promotional KOJIFLUX.
    mapping(address => bool) private superMint; // Whether the wallet has a mint booster allowing require bypass.
    mapping(address => bool) public userStaked; // Denotes whether the user is currently staked or not, must be eligible for tiers 1/2 for true.
    
    address public NFTAddress; //NFT contract address
    address public KojiFluxAddress; //KOJIFLUX contract address

    IOracle public oracle;
    IKojiRewards public rewards;

    IERC20 kojitoken = IERC20(0x30256814b1380Ea3b49C5AEA5C7Fa46eCecb8Bc0); //$KOJI token

    event Unstake(address indexed user, uint256 indexed pid);
    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event WithdrawRewardsOnly(address indexed user, uint256 amount);

    constructor(
        KojiFlux _kojiflux,
        uint256 _startBlock
    ) {
        require(address(_kojiflux) != address(0), "KOJIFLUX address is invalid");
        // require(_startBlock >= block.number, "startBlock is before current block");

        kojiflux = _kojiflux;
        KojiFluxAddress = address(_kojiflux);
        startBlock = _startBlock;

        oracle = IOracle(0x66F2495e1f139c22Dd839250858bB8936a7845Bc); // Oracle
        rewards = IKojiRewards(0xDE554cA0E3B9861d120A7415C0dE6Ac32AFb4cE4); // Rewards contract

    }

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
        require(address(_stakeToken) != address(0), "token is invalid");
        require(!addedstakeTokens[address(_stakeToken)], "token is already added");

        require(_allocPoint >= 1 && _allocPoint <= 100, "_allocPoint is outside of range 1-100");

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
        require(_allocPoint >= 1 && _allocPoint <= 100, "_allocPoint is outside of range 1-100");

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
        require(_allocPoint >= 1 && _allocPoint <= 100, "_allocPoint is outside of range 1-100");

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
        uint256 tokenSupply = pool.stakeToken.balanceOf(address(this));
        if (block.number > pool.lastRewardBlock && tokenSupply != 0) {
            uint256 multiplier = block.number.sub(pool.lastRewardBlock);
            (uint256 blockReward, ) = getKojiPerBlock();
            uint256 kojiReward = multiplier.mul(blockReward).mul(pool.allocPoint).div(totalAllocPoint);
            accKojiPerShare = accKojiPerShare.add(kojiReward.mul(1e12).div(tokenSupply));
        }
        return user.amount.mul(accKojiPerShare).div(1e12).sub(user.rewardDebt);
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

        uint256 tokenSupply = pool.runningTotal; 
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

            if(user.amount > 0) { // If user has already deposited, secure rewards before reconfiguring rewardDebt
                require(user.amount.add(_amount) <= minstake1.mul(upperLimiter).div(100), "This amount combined with your current stake exceeds the maxmimum allowed stake");
                uint256 tempRewards = pendingRewards(_pid, _msgSender());
                userBalance[_msgSender()] = userBalance[_msgSender()].add(tempRewards);
                user.unstakeTime = block.timestamp;
            }
            
            if(user.amount == 0) { // We only want the minimum to apply on first deposit, not subsequent ones
                require(_amount >= minstake2 && _amount <= minstake1.mul(101).div(100)  , "Please input the correct amount of KOJI tokens to stake");
                user.stakeTime = block.timestamp;
                user.unstakeTime = block.timestamp;
            }

            pool.runningTotal = pool.runningTotal.add(_amount);
            user.amount = user.amount.add(_amount);
            pool.stakeToken.safeTransferFrom(address(_msgSender()), address(this), _amount);
            
            user.usdEquiv = getUSDequivalent(user.amount);
            user.tierAtStakeTime = getTierequivalent(user.amount);
            user.blacklisted = false;
        
            if (user.tierAtStakeTime >= 2) {
                addStakeholder(_msgSender());
            }

            if (!promoWallet[_msgSender()] && promoActive) {
                userBalance[_msgSender()] = promoAmount; //give 200 promo KOJIFLUX
                promoWallet[_msgSender()] = true;
            }
            
            user.rewardDebt = user.amount.mul(pool.accKojiPerShare).div(1e12);
            emit Deposit(_msgSender(), _pid, _amount);

        }
    }

    // Withdraw tokens from KojiFarming
    function withdraw(uint256 _pid, uint256 _amount) public nonReentrant {

        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_msgSender()];
        uint256 userAmount = user.amount;
        require(_amount > 0, "Withdrawal amount must be greater than zero");
        require(user.amount >= _amount, "Withdraw amount is greater than user amount");
        

        updatePool(_pid);

        if (_amount > 0) {
 
            uint256 tokenSupply = pool.stakeToken.balanceOf(address(this)); // Get total amount of KOJI tokens
            uint256 totalRewards = tokenSupply.sub(pool.runningTotal); // Get difference between contract address amount and ledger amount
            if (totalRewards == 0) { // No rewards, just return 100% to the user

                uint256 tempRewards = pendingRewards(_pid, _msgSender());
                userBalance[_msgSender()] = userBalance[_msgSender()].add(tempRewards);

                pool.runningTotal = pool.runningTotal.sub(_amount);
                pool.stakeToken.safeTransfer(address(_msgSender()), _amount);
                user.amount = user.amount.sub(_amount);
                emit Withdraw(_msgSender(), _pid, _amount);
                
            } 
            uint256 netamount = _amount; //stack too deep
            if (totalRewards > 0) { //include reflection

                uint256 tempRewards = pendingRewards(_pid, _msgSender());
                userBalance[_msgSender()] = userBalance[_msgSender()].add(tempRewards);

                uint256 percentRewards = netamount.mul(100).div(pool.runningTotal); // Get % of share out of 100
                uint256 reflectAmount = percentRewards.mul(totalRewards).div(100); // Get % of reflect amount

                pool.runningTotal = pool.runningTotal.sub(netamount);
                user.amount = user.amount.sub(netamount);
                
                if(enableTaxlessWithdrawals) { // Switch for tax free / reflection free withdrawals
                     netamount = netamount;
                } else {
                     uint256 taxfeenumerator = getUnstakePenalty(user.unstakeTime);
                     uint256 taxfee = taxableAmount.sub(taxableAmount.mul(taxfeenumerator).div(unstakePenaltyDenominator));
                     netamount = netamount.mul(taxfee).div(100).add(reflectAmount);
                }
                pool.stakeToken.safeTransfer(address(_msgSender()), netamount);
                emit Withdraw(_msgSender(), _pid, netamount);
            }               

            if (userAmount == netamount) { // User is retrieving entire balance, set rewardDebt to zero
                user.rewardDebt = 0;
                user.unstakeTime = block.timestamp;
                user.tierAtStakeTime = 0;
                user.blacklisted = true;
                removeStakeholder(_msgSender());
            } else {
                if (getTierequivalent(user.amount) == 1) {
                    user.unstakeTime = block.timestamp;
                    user.tierAtStakeTime = 1;
                    user.blacklisted = false;
                } else {
                    if (getTierequivalent(user.amount) == 2) {
                    user.unstakeTime = block.timestamp;
                    user.tierAtStakeTime = 2;
                    user.blacklisted = false;
                    } else {
                        user.unstakeTime = block.timestamp;
                        user.tierAtStakeTime = 0;
                        user.blacklisted = true;
                        removeStakeholder(_msgSender());
                    }
                }
                
                user.rewardDebt = user.amount.mul(pool.accKojiPerShare).div(1e12); 
            }

        }
        
                        
    }

    // Safe KOJIFLUX token transfer function, just in case if
    // rounding error causes pool to not have enough KOJIFLUX tokens
    function safeTokenTransfer(address _to, uint256 _amount) internal {
        uint256 balance = kojiflux.balanceOf(address(this));
        uint256 amount = _amount > balance ? balance : _amount;
        kojiflux.transfer(_to, amount);
    }

    function setBlockRewardUpdateCycle(uint256 _blockRewardUpdateCycle) external onlyAuthorized {
        require(_blockRewardUpdateCycle > 0, "Value is zero");
        blockRewardUpdateCycle = _blockRewardUpdateCycle;
    }

    // Just in case an adjustment is needed since mined blocks per day changes constantly depending on the network
    function setBlocksPerDay(uint256 _blocksPerDay) external onlyAuthorized {
        require(_blocksPerDay >= 1 && _blocksPerDay <= 28800, "Value is outside of range 1-14000");
        blocksPerDay = _blocksPerDay;
    }

    function setBlockRewardPercentage(uint256 _blockRewardPercentage) external onlyAuthorized {
        require(_blockRewardPercentage >= 1 && _blockRewardPercentage <= 100, "Value is outside of range 1-100");
        blockRewardPercentage = _blockRewardPercentage;
    }

    // This will allow to rescue ETH sent to the contract
    function rescueETHFromContract() external onlyAuthorized {
        address payable _owner = payable(_msgSender());
        _owner.transfer(address(this).balance);
    }

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
    function getTotalRewards(address _user) external view returns (uint256) { 
        uint256 value1 = getTotalPendingRewards(_user);
        uint256 value2 = userBalance[_user];

        return value1.add(value2);
    }

    // Moves all pending rewards into the accrued array
    function redeemTotalRewards(address _user) internal { 

        uint256 pool0 = 0;

        PoolInfo storage pool = poolInfo[pool0];
        UserInfo storage user = userInfo[pool0][_user];

        updatePool(pool0);
        
        uint256 value0 = pendingRewards(pool0, _user);
        
        userBalance[_user] = userBalance[_user].add(value0);

        user.rewardDebt = user.amount.mul(pool.accKojiPerShare).div(1e12); 

    }

    // Whether to allow the KojiFlux token to actually be withdrawn, of just leave it virtual (default)
    function enableRewardWithdrawals(bool _status) public onlyAuthorized {
        enableRewardWithdraw = _status;
    }

    // View state of reward withdrawals (true/false)
    function rewardWithdrawalStatus() external view returns (bool) {
        return enableRewardWithdraw;
    }

    // Withdraw KOJIFLUX
    function withdrawRewardsOnly() public nonReentrant {

        require(enableRewardWithdraw, "KOJIFLUX withdrawals are not enabled");

        IERC20 rewardtoken = IERC20(KojiFluxAddress); //KOJIFLUX

        redeemTotalRewards(_msgSender());

        uint256 pending = userBalance[_msgSender()];
        if (pending > 0) {
            require(rewardtoken.balanceOf(address(this)) > pending, "KOJIFLUX token balance of this contract is insufficient");
            userBalance[_msgSender()] = 0;
            safeTokenTransfer(_msgSender(), pending);
        }
        
        emit WithdrawRewardsOnly(_msgSender(), pending);
    }

    // Convert KojiFlux to $KOJI
    function convertAndWithdraw() external nonReentrant {
        redeemTotalRewards(_msgSender());

        require(userBalance[_msgSender()] > 0, "User does not have any pending rewards");

        uint256 useramount = getConversionAmount(userBalance[_msgSender()], _msgSender());
        rewards.payPendingRewards(_msgSender(), useramount);

        userRealized[_msgSender()] = userRealized[_msgSender()].add(userBalance[_msgSender()]);
        userBalance[_msgSender()] = 0;
        
    }

    // Set NFT contract address
     function setNFTAddress(address _address) external onlyAuthorized {
        NFTAddress = _address;
    }

    // Set KOJIFLUX contract address
     function setKojiFluxAddress(address _address) external onlyAuthorized {
        KojiFluxAddress = _address;
    }

    // Redeem the NFT (tier 1)
    function redeemtier1(uint256 _nftID) external nonReentrant {

        // Get user tier/info
        UserInfo storage user = userInfo[0][_msgSender()];

        bool minted = IKojiNFT(NFTAddress).getIfMinted(_msgSender(), _nftID);
        (uint256 timestart, uint256 timeend) = IKojiNFT(NFTAddress).getNFTwindow(_nftID);

        require(!minted, "You have already minted one tier of this NFT");
        require(user.tierAtStakeTime == 1, "Your stake value is not sufficient to mint this tier");
        require(block.timestamp >= timestart, "The minting window for this NFT hasn't opened");
        require(user.stakeTime <= timeend, "You did not stake prior to the end of the mint window for this NFT. You will need to purchase a superMint");

        IKojiNFT(NFTAddress).mintNFT(_msgSender(), 1, _nftID);
           
    }

    // Redeem the NFT via supermint (tier 1)
    function superminttier1(uint256 _nftID) external nonReentrant {
        // Get user tier/info
        UserInfo storage user = userInfo[0][_msgSender()];

        require(user.usdEquiv >= minKojiTier2Stake.mul(95).div(100), "You still need the minimum stake requirment to use superMint");

        if (superMint[_msgSender()]) {
            superMint[_msgSender()] = false;
            IKojiNFT(NFTAddress).mintNFT(_msgSender(), 1, _nftID);
        } 
    }

    // Redeem the NFT (tier 2)
    function redeemtier2(uint256 _nftID) external nonReentrant {

        // Get user tier/info
        UserInfo storage user = userInfo[0][_msgSender()];

        bool minted = IKojiNFT(NFTAddress).getIfMinted(_msgSender(), _nftID);
        (uint256 timestart, uint256 timeend) = IKojiNFT(NFTAddress).getNFTwindow(_nftID);

        require(!minted, "You have already minted one tier of this NFT");
        require(user.usdEquiv >= minKojiTier2Stake.mul(95).div(100), "Your stake is not sufficient to mint this tier");
        require(block.timestamp >= timestart, "The minting window for this NFT hasn't opened");
        require(block.timestamp <= timeend, "The minting window for this NFT has closed");
        
        IKojiNFT(NFTAddress).mintNFT(_msgSender(), 2, _nftID);
           
    }

    // Redeem the NFT via supermint (tier 2)
    function superminttier2(uint256 _nftID) external nonReentrant {
        // Get user tier/info
        UserInfo storage user = userInfo[0][_msgSender()];

        require(user.usdEquiv >= minKojiTier2Stake.mul(95).div(100), "You still need the minimum stake requirment to use superMint");

        if (superMint[_msgSender()]) {
            superMint[_msgSender()] = false;
            IKojiNFT(NFTAddress).mintNFT(_msgSender(), 2, _nftID);
        } 
    }

    // We can give the artists/influencers a KojiFlux balance so they can redeem their own NFTs
    function setKojiFluxBalance(address _address, uint256 _amount) public onlyAuthorized {
        userBalance[_address] = _amount;
    }

    function reduceKojiFluxBalance(address _address, uint256 _amount) public onlyAuthorized {
        userBalance[_address] = userBalance[_address].sub(_amount);
    }

    function increaseKojiFluxBalance(address _address, uint256 _amount) public onlyAuthorized {
        userBalance[_address] = userBalance[_address].add(_amount);
    }

    // Set the conversion rate between KOJIFLUX and the $koji token
    function setConverstionRate(uint256 _rate) public onlyAuthorized {
        conversionRate = _rate;
    }

    // Get rate of KojiFlux/$Koji conversion
    function getConversionRate() external view returns (uint256) {
        return conversionRate;
    }

    // Get amount of Koji for KojiFlux
    function getConversionAmount(uint256 _amount, address _address) public view returns (uint256) {

        uint256 newamount = _amount.mul(conversionRate).div(100);

        if (stakeBonusEnabled) {

            UserInfo storage user0 = userInfo[0][_address];

            if (user0.stakeTime >= stakeBonusStart && user0.stakeTime <= stakeBonusEnd) {

                newamount = newamount.mul(bonusRate).div(100);
            }


        }


        return newamount;
    }

    // Get dollar amount of Koji for KojiFlux
    function getConversionPrice(uint256 _amount) public view returns (uint256) {
        uint256 netamount = _amount.mul(conversionRate).div(100);
        (,,uint256 kojiusd) = oracle.getKojiUSDPrice();
        uint256 netusdamount = kojiusd.mul(netamount);

        return netusdamount;
    }

    // Get pending dollar amount of Koji for KojiFlux
    function getPendingUSDRewards(address _holder) public view returns (uint256) { 

        uint256 pendingamount = pendingRewards(0, _holder);

        uint256 pendingusdamount = getConversionPrice(pendingamount);

        return pendingusdamount.div(10**9);
    }


    // Get the holder rewards of users staked $koji if they were to withdraw
    function getHolderRewards(address _address) external view returns (uint256) {
        PoolInfo storage pool = poolInfo[0];
        UserInfo storage user = userInfo[0][_address];

        uint256 _amount = user.amount;
        uint256 tokenSupply = pool.stakeToken.balanceOf(address(this)); // Get total amount of tokens
        uint256 totalRewards = tokenSupply.sub(pool.runningTotal); // Get difference between contract address amount and ledger amount
        
         if (totalRewards > 0) { // Include reflection
            uint256 percentRewards = _amount.mul(100).div(pool.runningTotal); // Get % of share out of 100
            uint256 reflectAmount = percentRewards.mul(totalRewards).div(100); // Get % of reflect amount

            return _amount.add(reflectAmount); // Add pool rewards to users original staked amount

         } else {

             return 0;

         }

    }

    // Sets min/max staking amounts for Koji token
    function setKojiStakingMinMax(uint256 _min1, uint256 _min2) external onlyAuthorized {

        require(_min2 > 0, "The minimum amount cannot be zero");
        require(_min1 > _min2, "The min staking amount for tier 1 must be higher than tier 2");
        
        minKojiTier1Stake = _min1;
        minKojiTier2Stake = _min2;
    }

    // Lets user move their pending rewards to accrued/escrow balance
    function moveRewardsToEscrow(address _address) external {

        require(_address == _msgSender() || authorized[_msgSender()], "Sender is not wallet owner or authorized");

        UserInfo storage user0 = userInfo[0][_msgSender()];
        uint256 userAmount = user0.amount;

        UserInfo storage user1 = userInfo[1][_msgSender()];
        userAmount = userAmount.add(user1.amount);

        if (userAmount == 0) {
            return;
        } else {
            redeemTotalRewards(_msgSender());
        }       
    }

    // Sets true/false for the KOJIFLUX promo for new stakers
    function setPromoStatus(bool _status) external onlyAuthorized {
        promoActive = _status;
    }

    // Get the min and max staking amounts 
    function getOracleMinMax() public view returns (uint256, uint256) {
        uint256 tier1min = oracle.getMinKOJITier1Amount(minKojiTier1Stake);
        uint256 tier2min = oracle.getMinKOJITier2Amount(minKojiTier2Stake);

        return (tier1min, tier2min);
    }


    // Gets Tier equivalent of input amount of KOJI tokens
    function getTierequivalent(uint256 _amount) public view returns (uint256) {

        uint256 totalvalue = getUSDequivalent(_amount);

        if (totalvalue >= minKojiTier1Stake) {
            return 1;
        } else {
            if (totalvalue >= minKojiTier2Stake && totalvalue <= minKojiTier1Stake) {
                return 2;
            } else {
                return 0;
            }
        }
    }

    // Gets USD equivalent of input amount of KOJI tokens
    function getUSDequivalent(uint256 _amount) public view returns (uint256) {
        (,,uint256 kojiusdvalue) = oracle.getKojiUSDPrice();
        uint256 totalvalue = kojiusdvalue.mul(_amount);

        return totalvalue.div(10**9);
    }

    // Function to buy superMint internally with KojiFlux
    function buySuperMint() external nonReentrant {
        require(enableFluxSuperMintBuying, "superMint cannot be purchased with KOJI at this time");
        require(!superMint[_msgSender()], "This user already has an unused superMint");
        require(userBalance[_msgSender()] >= superMintFluxPrice, "Insufficient KojiFlux to purchase superMint");

        userBalance[_msgSender()] = userBalance[_msgSender()].sub(superMintFluxPrice);
        superMint[_msgSender()] = true;
    }

    // Function to buy superMint with $KOJI
    function buySuperMintKoji() external nonReentrant {
        require(enableKojiSuperMintBuying, "superMint cannot be purchased with KOJI at this time");
        require(kojitoken.balanceOf(_msgSender()) >= superMintKojiPrice, "You do not have the required tokens for purchase"); 
        require(!superMint[_msgSender()], "This user already has an unused superMint");

        IERC20(kojitoken).transferFrom(_msgSender(), address(rewards), superMintKojiPrice);
        superMint[_msgSender()] = true;
    }

    function changeOracle(address _oracle) external onlyAuthorized {
        oracle = IOracle(_oracle);
    }

    function changeRewards(address _rewards) external onlyAuthorized {
        rewards = IKojiRewards(_rewards);
    }

    function changeUpperLimiter(uint256 _upperlimit) external onlyAuthorized {
        require(_upperlimit > 100, "Upper limiter needs to be greater than 100");
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
        stakeholders[stakeholderIndexes[stakeholder]] = stakeholders[stakeholders.length-1];
        stakeholderIndexes[stakeholders[stakeholders.length-1]] = stakeholderIndexes[stakeholder];
        stakeholders.pop();
        userStaked[stakeholder] = false;
    }

    function giveAllsuperMint() external onlyAuthorized {

        uint256 length = stakeholders.length;

        for (uint256 x = 0; x < length; ++x) {

             superMint[stakeholders[x]] = true;
        }

    }

    function getUnstakePenalty(uint256 _staketime) public view returns (uint256) {

        uint256 totaldays = _staketime.sub(block.timestamp).div(86400);

        uint256 totalunstakefee  = unstakePenaltyStartingTax.sub(totaldays);

        if (totalunstakefee < unstakePenaltyDefaultTax) {
            return unstakePenaltyDefaultTax;
        } else {
            return totalunstakefee;
        }


    }

    function setStakeBonusParams(uint256 _stakeBonusStart, uint256 _stakeBonusEnd, uint256 _bonusRate, bool _stakeBonusEnabled) external onlyAuthorized {

        stakeBonusStart = _stakeBonusStart;
        stakeBonusEnd = _stakeBonusEnd;
        bonusRate = _bonusRate;
        stakeBonusEnabled = _stakeBonusEnabled;

    }

    function setSuperMintBuying(bool _fluxbuying, bool _kojibuying) external onlyAuthorized {
        enableFluxSuperMintBuying = _fluxbuying;
        enableKojiSuperMintBuying = _kojibuying;
    }

    function getSuperMintPrices() external view returns (uint256 fluxprice, uint256 kojiprice) {
        return (superMintFluxPrice,superMintKojiPrice);
    }
}
