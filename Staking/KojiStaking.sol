// SPDX-License-Identifier: GPL-3.0-or-later

// koji.earth Staking Contract Version 1.0
// Stake your $KOJI for the Koji Comic NFT

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


// Interface for the authorization and contract address registry
interface IAuth {
    function isAuthorized(address _address) external view returns (bool);
    function getKojiNFT() external view returns (address);
    function getKojiFlux() external view returns (address);
    function getKojiEarth() external view returns (address);
    function getMarketOrder() external view returns (address);
    function getKojiRewards() external view returns (address);
    function getKojiOracle() external view returns (address);
}

// Interface for BEP20 token standard operations
interface IBEP20 {
    function totalSupply() external view returns (uint256);
    function decimals() external view returns (uint8);
    function symbol() external view returns (string memory);
    function name() external view returns (string memory);
    function getOwner() external view returns (address);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address _owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function safeTransferFrom(address from, address to, uint256 value) external;
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

// Interface for the Koji NFT contract
interface IKojiNFT {
  function mintNFT(address recipient, uint256 minttier, uint256 id, uint _staketime, bool redeemed, bool superMinted, bool bnbMinted) external returns (uint256);
  function validatePrice(uint _id, uint _tier) external view returns (uint, uint);
}

// Interface for the Koji Oracle
interface IOracle {
    function getMinKOJITier1Amount(uint256 amount) external view returns (uint256); 
    function getMinKOJITier2Amount(uint256 amount) external view returns (uint256); 
    function getKojiUSDPrice() external view returns (uint256, uint256, uint256);
    function getSuperMintKojiPrice(uint256 _amount) external view returns (uint256);
    function getSuperMintFluxPrice(uint256 _amount) external view returns (uint256);
}

// Interface for the rewards pool contract
interface IKojiRewards {
    function payPendingRewards(address _holder, uint256 _amount) external;
}

// Interface for market order contract
interface IORDER {
    function marketBuy(address _token, address _recipient) external payable returns (uint);
}

contract KojiStaking is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Modifier to restrict function access to authorized addresses or contract owner
    modifier onlyAuthorized() {
        require(auth.isAuthorized(_msgSender()) || owner() == address(_msgSender()), "E58");
        _;
    }
    

    // Info of each user.
    struct UserInfo {
        uint256 amount; // How many tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
        uint256 usdEquiv; //USD equivalent of $Koji staked
        uint256 stakeTime; //block.timestamp of when user staked
        uint256 unstakeTime; //block.timestamp of when user unstaked
        uint256 supermintaccrualperiod; //amount of time to wait for supermint
        uint256 supermintstaketimer; //time at which supermint accrual starts
        uint8 tierAtStakeTime; //tier 1 or 2 when user staked (packed to save space)
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

    // Config structs split to avoid stack too deep errors
    struct BlockRewardConfig {
        uint256 updateCycle; // The cycle in which the kojiPerBlock gets updated.
        uint256 lastUpdateTime; // The timestamp when the block kojiPerBlock was last updated.
        uint256 blocksPerDay; // The estimated number of mined blocks per day, lowered so rewards are halved to start.
        uint256 rewardPercentage; // The percentage used for kojiPerBlock calculation.
        uint256 poolReward; // Starting basis for poolReward (default 1B).
        uint256 rewardDivisor; // Divisor to scale down rewards (default 1 = no reduction, 10 = 90% reduction, 100 = 99% reduction).
    }

    struct StakingLimitsConfig {
        uint256 minTier1Stake; // Min stake amount (default $1000 USD of $KOJI).
        uint256 minTier2Stake; // Min stake amount (default $250 USD of $KOJI).
        uint256 upperLimiter; // Percent numerator above minKojiTier1Stake so user can deposit enough for tier 1
    }

    struct PegConfig {
        uint256 kojiUsdPeg; // Default peg price of KOJI/USD to base conversion/bonus numbers on (default 1000).
        uint256 tier1kojiPeg; // tier1 stake peg @ 1000 Gwei to calc bonus (default 2B).
        uint256 tier2kojiPeg; // tier2 stake peg @ 1000 Gwei to calc bonus (default 250M).
    }

    struct SuperMintConfig {
        uint256 fluxPrice1; // KOJIFLUX Cost to purchase a superMint ($50 FLUX default).
        uint256 fluxPrice2; // KOJIFLUX Cost to purchase a superMint ($25 FLUX default).
        uint256 kojiPrice; // KOJI Cost to purchase a superMint ($100 of KOJI default, peggd to USD).
        uint256 increase; // KOJIFLUX price increase each time a user buys a supermint with KOJI
    }

    struct PenaltyConfig {
        uint256 taxableAmount; // Base amount for tax calculation (1000 = 100%).
        uint256 startingTax; // Starting unstake penalty tax percentage.
        uint256 defaultTax; // Default unstake penalty tax percentage after penalty period.
        uint256 denominator; // Denominator for penalty calculations (1000 = basis points).
        uint256 period; // time in seconds of unstake penalty period (24 hours).
    }

    struct AccrualConfig {
        uint256 frame1; // time in seconds to accrue 1 supermint just by staking (default 21 days).
        uint256 frame2; // time in seconds to accrue 1 supermint just by staking (default 49 days).
    }

    struct FeatureFlags {
        bool enableKojiSuperMintBuying; // Whether users can purchase superMints with $KOJI (default is false).
        bool enableFluxSuperMintBuying; // Whether users can purchase superMints with $FLUX (default is false).
        bool enableTaxlessWithdrawals; // Switch to use in case of farming contract migration.
        bool convertRewardsEnabled; // Switch to enable/disable kojiflux -> koji oracle conversion.
        bool withdrawRewardsEnabled; // Switch to allow kojiflux -> koji withdrawals
    }

    address public kojiflux; // The KOJIFLUX BEP20 Token.
    uint256 private kojiPerBlock; // KOJIFLUX tokens distributed per block. Use getKojiPerBlock() to get the updated reward.

    PoolInfo[] public poolInfo; // Info of each pool.
    mapping(uint256 => mapping(address => UserInfo)) public userInfo; // Info of each user that stakes LP tokens.
    mapping(address => bool) public userStaked; // Denotes whether the user is currently staked or not, must be eligible for tiers 1/2 for true.
    
    uint256 public totalAllocPoint; // Total allocation points. Must be the sum of all allocation points in all pools.
    uint256 public startBlock; // The block number when KOJIFLUX token mining starts.
    uint256 public conversionRate = 1000; // Conversion rate of KOJIFLUX => $KOJI (default 100%).

    BlockRewardConfig public blockRewardConfig;
    StakingLimitsConfig public stakingLimitsConfig;
    PegConfig public pegConfig;
    SuperMintConfig public superMintConfig;
    PenaltyConfig public penaltyConfig;
    AccrualConfig public accrualConfig;
    FeatureFlags public featureFlags;

    mapping(address => bool) public addedstakeTokens; // Used for preventing staked tokens from being added twice in add().
    mapping(address => uint256) private userBalance; // Balance of KOJIFLUX for each user that survives staking/unstaking/redeeming.
    mapping(address => uint256) private userRealized; // Balance of KOJIFLUX for each user that survives staking/unstaking/redeeming.
    mapping(address => bool) public superMint; // Whether the wallet has a mint booster allowing require bypass.
    mapping(address => uint) public superMintCounter; // Counter tracking how many times a user has purchased superMint with $KOJI.
    
    IAuth private auth; // Reference to the authorization and contract registry contract
       
    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event KojiBuy(uint indexed bnbamount, uint indexed kojiamount, address indexed toAddress);

    // Constructor initializes the staking contract with start block and auth contract address
    // Sets up all configuration structs with default values
    constructor(
        uint256 _startBlock,
        address _auth
    ) {
        startBlock = _startBlock;

        auth = IAuth(_auth);
        kojiflux = auth.getKojiFlux();

        // Initialize config structs
        blockRewardConfig = BlockRewardConfig({
            updateCycle: 1 days,
            lastUpdateTime: block.timestamp,
            blocksPerDay: 28800,
            rewardPercentage: 10,
            poolReward: 1000000000000000000,
            rewardDivisor: 1
        });

        stakingLimitsConfig = StakingLimitsConfig({
            minTier1Stake: 1000000000000,
            minTier2Stake: 250000000000,
            upperLimiter: 201
        });

        pegConfig = PegConfig({
            kojiUsdPeg: 1000,
            tier1kojiPeg: 2000000000000000000,
            tier2kojiPeg: 250000000000000000
        });

        superMintConfig = SuperMintConfig({
            fluxPrice1: 50000000000,
            fluxPrice2: 25000000000,
            kojiPrice: 100000000000,
            increase: 25000000000
        });

        penaltyConfig = PenaltyConfig({
            taxableAmount: 1000,
            startingTax: 30,
            defaultTax: 10,
            denominator: 1000,
            period: 86400
        });

        accrualConfig = AccrualConfig({
            frame1: 1814400,
            frame2: 4233600
        });

        featureFlags = FeatureFlags({
            enableKojiSuperMintBuying: false,
            enableFluxSuperMintBuying: false,
            enableTaxlessWithdrawals: false,
            convertRewardsEnabled: true,
            withdrawRewardsEnabled: true
        });
    }

    // Modifier to update the KOJIFLUX tokens per block reward rate before function execution
    modifier updateKojiPerBlock() {
        (uint256 blockReward, bool update) = getKojiPerBlock();
        if (update) {
            kojiPerBlock = blockReward;
            blockRewardConfig.lastUpdateTime = block.timestamp;
        }
        _;
    }

    // Get the current KOJIFLUX tokens distributed per block and whether an update is needed
    function getKojiPerBlock() public view returns (uint256, bool) {
        if (block.number < startBlock) {
            return (0, false);
        }

        if (block.timestamp >= getKojiPerBlockUpdateTime() || kojiPerBlock == 0) {
            return (blockRewardConfig.poolReward * blockRewardConfig.rewardPercentage / 100 / blockRewardConfig.blocksPerDay, true);
        }

        return (kojiPerBlock, false);
    }

    // Get the timestamp when the KOJIFLUX per block reward rate should next be updated
    function getKojiPerBlockUpdateTime() public view returns (uint256) {
        // if blockRewardUpdateCycle = 1 day then roundedUpdateTime = today's UTC midnight
        uint256 roundedUpdateTime = blockRewardConfig.lastUpdateTime - (blockRewardConfig.lastUpdateTime % blockRewardConfig.updateCycle);
        // if blockRewardUpdateCycle = 1 day then calculateRewardTime = tomorrow's UTC midnight
        uint256 calculateRewardTime = roundedUpdateTime + blockRewardConfig.updateCycle;
        return calculateRewardTime;
    }

    // Get the total number of staking pools
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
        totalAllocPoint = totalAllocPoint + _allocPoint;
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
        totalAllocPoint = totalAllocPoint - poolInfo[_pid].allocPoint + _allocPoint;
        poolInfo[_pid].allocPoint = _allocPoint;
    }

    // View function to see pending KOJIFLUX tokens on frontend
    // Returns the pending reward amount for a user in a specific pool, including bonus rate calculations
    function pendingRewards(uint256 _pid, address _user) public view returns (uint256) { 
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        uint256 accKojiPerShare = pool.accKojiPerShare;
        (,uint256 bonusRate) = getConversionAmount(user.amount,_user);

        uint256 tokenSupply = IBEP20(kojiflux).balanceOf(address(this));
        if (block.number > pool.lastRewardBlock && tokenSupply != 0) {
            uint256 multiplier = block.number - pool.lastRewardBlock;
            (uint256 blockReward, ) = getKojiPerBlock();
            uint256 kojiReward = multiplier * blockReward * pool.allocPoint / totalAllocPoint;
            accKojiPerShare = accKojiPerShare + (kojiReward * 1e12 / tokenSupply / blockRewardConfig.rewardDivisor);
        }
        uint256 newamount = user.amount * accKojiPerShare / 1e12 - user.rewardDebt;
        
        return newamount * bonusRate / 100;
        
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
        uint256 tokenSupply = IBEP20(kojiflux).balanceOf(address(this));
        if (tokenSupply == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }

        uint256 multiplier = block.number - pool.lastRewardBlock;
        uint256 kojiReward = multiplier * kojiPerBlock * pool.allocPoint / totalAllocPoint;

        // No minting is required, the contract should have KOJIFLUX token balance pre-allocated
        // Accumulated KOJIFLUX per share is stored multiplied by 10^12 to allow small 'fractional' values
        // Apply reward divisor to scale down rewards if needed
        pool.accKojiPerShare = pool.accKojiPerShare + (kojiReward * 1e12 / tokenSupply / blockRewardConfig.rewardDivisor);
        pool.lastRewardBlock = block.number;
    }

    // Update the base pool reward amount used for calculating KOJIFLUX per block
    function updatePoolReward(uint256 _amount) public onlyAuthorized {
        blockRewardConfig.poolReward = _amount;
    }

    // Deposit tokens/$KOJI to KojiFarming for KOJIFLUX token allocation.
    function deposit(uint256 _pid, uint256 _amount) public nonReentrant {

        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_msgSender()];

        updatePool(_pid);

        (uint256 minstake1, uint256 minstake2) = getOracleMinMax();

          
            if(user.amount == 0) { // We only want the minimum to apply on first deposit, not subsequent ones
                require(_amount >= minstake2 && _amount <= minstake1 * stakingLimitsConfig.upperLimiter / 100  , "E42");
                user.stakeTime = block.timestamp;
                user.unstakeTime = block.timestamp;
                user.supermintstaketimer = block.timestamp;

            } else { // If user has already deposited, secure rewards before reconfiguring rewardDebt
            
                require(user.amount + _amount <= minstake1 * stakingLimitsConfig.upperLimiter / 100, "E41");
                userBalance[_msgSender()] = userBalance[_msgSender()] + pendingRewards(_pid, _msgSender());
                user.unstakeTime = block.timestamp;

                 if (userBalance[_msgSender()] > 0) {
            
                    (userBalance[_msgSender()],) = getConversionAmount(userBalance[_msgSender()], _msgSender());
                }
            }

            pool.runningTotal = pool.runningTotal + _amount;
            user.amount = user.amount + _amount;
            
            user.usdEquiv = getUSDequivalent(user.amount);
            user.tierAtStakeTime = uint8(getTierequivalent(user.amount));
            user.supermintaccrualperiod = getOverStakeTimeframe(user.tierAtStakeTime,user.amount);
        
            if (user.tierAtStakeTime == 1 || user.tierAtStakeTime == 2) {

                userStaked[_msgSender()] = true;

                if(userBalance[_msgSender()] > 0) {
                    (,uint bonusrate) = getConversionAmount(userBalance[_msgSender()], _msgSender());
                    userBalance[_msgSender()] = userBalance[_msgSender()] * 100 / bonusrate;
                }
            } else {
                userStaked[_msgSender()] = false;
            }

            user.rewardDebt = user.amount * pool.accKojiPerShare / 1e12;

            if (_amount > 0) {
                pool.stakeToken.safeTransferFrom(address(_msgSender()), address(this), _amount);
                emit Deposit(_msgSender(), _pid, _amount);
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

        userBalance[_msgSender()] = userBalance[_msgSender()] + pendingRewards(_pid, _msgSender());

        if (userBalance[_msgSender()] > 0) {
            
            (userBalance[_msgSender()],) = getConversionAmount(userBalance[_msgSender()], _msgSender());
             
        }

        if(!featureFlags.enableTaxlessWithdrawals) { // Switch for tax free / reflection free withdrawals

            netamount = getWithdrawResult(_msgSender(), _amount);
        }

        pool.runningTotal = pool.runningTotal - _amount;
        user.amount = user.amount - _amount;

        pool.stakeToken.safeTransfer(address(_msgSender()), netamount);
        emit Withdraw(_msgSender(), _pid, netamount);         

        if (userAmount == _amount) { // User is retrieving entire balance, set rewardDebt to zero
            user.rewardDebt = 0;
            user.unstakeTime = block.timestamp;
            user.usdEquiv = 0;
            user.tierAtStakeTime = 0;
            user.supermintstaketimer = block.timestamp;
            user.supermintaccrualperiod = 9999999999;
            userStaked[_msgSender()] = false;
        } else {
            if (getTierequivalent(user.amount) == 1) {
                user.usdEquiv = getUSDequivalent(user.amount);
                user.unstakeTime = block.timestamp;
                user.tierAtStakeTime = uint8(1);
                user.supermintaccrualperiod = getOverStakeTimeframe(user.tierAtStakeTime,user.amount);
                (,bonusrate) = getConversionAmount(userBalance[_msgSender()], _msgSender());
                userBalance[_msgSender()] = userBalance[_msgSender()] * 100 / bonusrate;
                userStaked[_msgSender()] = true;
            } else {
                if (getTierequivalent(user.amount) == 2) {
                user.usdEquiv = getUSDequivalent(user.amount);
                user.unstakeTime = block.timestamp;
                user.tierAtStakeTime = uint8(2);
                user.supermintaccrualperiod = getOverStakeTimeframe(user.tierAtStakeTime,user.amount);
                (,bonusrate) = getConversionAmount(userBalance[_msgSender()], _msgSender());
                userBalance[_msgSender()] = userBalance[_msgSender()] * 100 / bonusrate;
                userStaked[_msgSender()] = true;
                } else {
                    user.usdEquiv = getUSDequivalent(user.amount);
                    user.unstakeTime = block.timestamp;
                    user.tierAtStakeTime = uint8(0);
                    user.supermintaccrualperiod = 9999999999;
                    userStaked[_msgSender()] = false;
                }
            }
            
            user.rewardDebt = user.amount * pool.accKojiPerShare / 1e12; 
        }                      
    }

    // Config setters for BlockRewardConfig
    function setBlockRewardConfig(
        uint256 _updateCycle,
        uint256 _blocksPerDay,
        uint256 _rewardPercentage,
        uint256 _poolReward,
        uint256 _rewardDivisor
    ) external onlyAuthorized {
        require(_updateCycle > 0, "E10");
        require(_blocksPerDay >= 1 && _blocksPerDay <= 28800, "E11");
        require(_rewardPercentage >= 1 && _rewardPercentage <= 100, "E12");
        require(_rewardDivisor >= 1, "E65");
        blockRewardConfig.updateCycle = _updateCycle;
        blockRewardConfig.blocksPerDay = _blocksPerDay;
        blockRewardConfig.rewardPercentage = _rewardPercentage;
        blockRewardConfig.poolReward = _poolReward;
        blockRewardConfig.rewardDivisor = _rewardDivisor;
    }

    // Function to allow admin to claim *other* ERC20 tokens sent to this contract (by mistake)
    function transferERC20Tokens(address _tokenAddr, address _to, uint _amount) public onlyAuthorized {
        IERC20(_tokenAddr).transfer(_to, _amount);
    }

    // Returns total stake amount ($KOJI token) and address of that token for a user in a specific pool
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

    // Gets the total of all pending rewards from pool 0 for a user
    function getTotalPendingRewards(address _user) public view returns (uint256) { 

        return pendingRewards(0, _user);
    }

    // Gets the total amount of rewards secured (not pending) in KOJIFLUX tokens
    function getAccruedRewards(address _user) external view returns (uint256) {
        return userBalance[_user];
    }

    // Gets the total of pending + secured rewards in KOJIFLUX tokens
    function getTotalRewards(address _user) public view returns (uint256) {
       
        return getTotalPendingRewards(_user) + userBalance[_user];
    }

    // Internal function to move all pending rewards into the accrued balance for a user
    function redeemTotalRewards(address _user) internal { 

        PoolInfo storage pool = poolInfo[0];
        UserInfo storage user = userInfo[0][_user];

        updatePool(0);
                
        userBalance[_user] = userBalance[_user] + pendingRewards(0, _user);

        user.rewardDebt = user.amount * pool.accKojiPerShare / 1e12; 

    }

    // External function for rewards contract to call to redeem total rewards for a user
    function redeemTotalRewardsExt(address _user) external {
        require(_msgSender() == address(auth.getKojiRewards()), "E59");

        redeemTotalRewards(_user);
    }
    

    // Convert a percentage of accrued KOJIFLUX rewards to $KOJI and withdraw via rewards contract
    function convertAndWithdraw(uint _percentage) external nonReentrant {

        require(featureFlags.withdrawRewardsEnabled, "E57");

        redeemTotalRewards(_msgSender());
        
        require(userBalance[_msgSender()] > 0, "E14");

        uint256 fluxamount = userBalance[_msgSender()] * _percentage / 100;
        (uint256 newamount,) = getConversionAmount(fluxamount, _msgSender());

        IKojiRewards(auth.getKojiRewards()).payPendingRewards(_msgSender(), newamount);

        userRealized[_msgSender()] = userRealized[_msgSender()] + fluxamount;
        userBalance[_msgSender()] = userBalance[_msgSender()] - fluxamount;
        
    }

    // Redeem an NFT by staking - tier 1 stakers can mint tier 1 or 2, tier 2 stakers can only mint tier 2
    function redeem(uint256 _nftID, uint256 _tier) external nonReentrant {
        require(_tier > 0 && _tier < 3, "E43");
        UserInfo storage user = userInfo[0][_msgSender()];

        // Tier 1 stakers can mint either tier, Tier 2 can only mint Tier 2
        if (_tier == 1) {
            require(user.tierAtStakeTime == 1, "E17");  // Only tier 1 stakers can mint tier 1
        } else {
            require(user.tierAtStakeTime == 1 || user.tierAtStakeTime == 2, "E17");  // Only tier 1 or 2 stakers can mint tier 2
        }
        
        IKojiNFT(auth.getKojiNFT()).mintNFT(_msgSender(), _tier, _nftID, user.stakeTime, true, false, false);
    }

    

    // Purchase an NFT tier directly with BNB - BNB is converted to $KOJI via market order
    function purchasetier(uint256 _nftID, uint256 _tier) external payable nonReentrant {
        require(_tier > 0 && _tier < 3, "E43");

        require(msg.value > 0, "E25");

        (uint price,) = IKojiNFT(auth.getKojiNFT()).validatePrice(_nftID, _tier);

        require(msg.value >= price, "E40");

        uint amountpurchased;
        
        IKojiNFT(auth.getKojiNFT()).mintNFT(_msgSender(), _tier, _nftID, 0, false, false, true);

        amountpurchased = IORDER(auth.getMarketOrder()).marketBuy{value : msg.value}(auth.getKojiEarth(), auth.getKojiRewards());

        emit KojiBuy(msg.value, amountpurchased, auth.getKojiRewards());

    }

    // Set the KOJIFLUX balance for a user (authorized addresses or rewards contract only)
    function setKojiFluxBalance(address _address, uint256 _amount) public {
        require(auth.isAuthorized(_msgSender()) || _msgSender() == address(auth.getKojiRewards()), "E01");
        userBalance[_address] = _amount;
    }

    // Reduce a user's KOJIFLUX balance by a specified amount
    function reduceKojiFluxBalance(address _address, uint256 _amount) public onlyAuthorized {
        userBalance[_address] = userBalance[_address] - _amount;
    }

    // Increase a user's KOJIFLUX balance by a specified amount
    function increaseKojiFluxBalance(address _address, uint256 _amount) public onlyAuthorized {
        userBalance[_address] = userBalance[_address] + _amount;
    }

    // Get the accrued KOJIFLUX balance for a user
    function getKojiFluxBalance(address _address) public view returns (uint256) {
        return userBalance[_address];
    }

    // Set the base conversion rate between KOJIFLUX and the $KOJI token (1000 = 100%)
    function setConverstionRate(uint256 _rate) public onlyAuthorized {
        conversionRate = _rate;
    }

    // Get the base conversion rate of KOJIFLUX to $KOJI (1000 = 100%)
    function getConversionRate() external view returns (uint256) {
        return conversionRate;
    }

    // Get the oracle-adjusted conversion rate between KOJIFLUX and $KOJI based on current KOJI price
    // Returns base rate if KOJI price is below peg or conversion is disabled
    function getOracleConversionRate() public view returns (uint256) {
        (,,uint256 kojiusd) = IOracle(auth.getKojiOracle()).getKojiUSDPrice();
        if(kojiusd < pegConfig.kojiUsdPeg || !featureFlags.convertRewardsEnabled) {
            return conversionRate;
        } else {
            uint256 newrate = kojiusd * 100 / pegConfig.kojiUsdPeg; //result in 100s (div by 1000 to get decimal)
            uint256 newconversionRate = conversionRate - newrate; //1000 minus 125 = 875 (87.5%)
            return newconversionRate;
        }
    }

    // Get the amount of $KOJI tokens equivalent to a given amount of KOJIFLUX, including tier-based bonus rates
    // Returns the converted amount and the bonus rate percentage applied
    function getConversionAmount(uint256 _amount, address _address) public view returns (uint256,uint256) {

        uint256 bonusRate = 100; 
        uint256 newconversionRate = getOracleConversionRate();

        uint256 newamount = _amount * newconversionRate / 1000; //should reduce if KOJI price increases

        UserInfo storage user0 = userInfo[0][_address]; //now add bonus in for smaller stakers based on peg tier1/tier2 amount
        if (user0.tierAtStakeTime == 1) {
            if(user0.amount > pegConfig.tier1kojiPeg) {
                bonusRate = 200;
            }
            if(user0.amount <= pegConfig.tier1kojiPeg) { // user is staking below peg amount, calc bonus
                bonusRate = pegConfig.tier1kojiPeg * 150 / user0.amount; // 2B div 1.5B = 1.3x bonus rate
            }
        } else {
            if (user0.tierAtStakeTime == 2) {
                uint256 halftier1kojiPeg = pegConfig.tier1kojiPeg / 2;
                if(user0.amount >= halftier1kojiPeg) { 
                    bonusRate = pegConfig.tier1kojiPeg * 100 / user0.amount; // 2B div 1B = 2x bonus rate
                }
                if(user0.amount >= pegConfig.tier2kojiPeg && user0.amount < halftier1kojiPeg) { // user is staking above tier 2 amount but still tier 2, calc bonus based on tier1
                    bonusRate = halftier1kojiPeg * 100 / user0.amount; // 1B div 500M = 2x bonus rate
                }
                if(user0.amount <= pegConfig.tier2kojiPeg) { // user is staking below peg amount, calc bonus
                    bonusRate = pegConfig.tier2kojiPeg * 100 / user0.amount; // 250M div 125M = 2x bonus rate
                }
            } else {
                newamount = _amount * conversionRate / 1000; //keep rewards up for stakers less than tier 2 (tier 0)
            }
        }
        
        newamount = newamount * bonusRate / 100;
            
        return (newamount,bonusRate);
    }

    // Get the USD dollar value equivalent of a given amount of KOJIFLUX tokens
    function getConversionPrice(uint256 _amount) public view returns (uint256) {
        uint256 netamount = _amount * getOracleConversionRate() / 100;
        (,,uint256 kojiusd) = IOracle(auth.getKojiOracle()).getKojiUSDPrice();
        uint256 netusdamount = kojiusd * netamount;

        return netusdamount;
    }

    // Get the pending USD dollar value of all rewards (pending + accrued) for a holder
    function getPendingUSDRewards(address _holder) public view returns (uint256) { 

        return getConversionPrice(getTotalRewards(_holder)) / 10**9;
    }


    // Get the minimum staking amounts for tier 1 and tier 2 from the oracle (in $KOJI tokens)
    function getOracleMinMax() public view returns (uint256, uint256) {

        IOracle oracle = IOracle(auth.getKojiOracle());
        
        return (oracle.getMinKOJITier1Amount(stakingLimitsConfig.minTier1Stake), oracle.getMinKOJITier2Amount(stakingLimitsConfig.minTier2Stake)); //tier1 min, tier2 min
    }

    // Get the maximum staking amounts for tier 1 and tier 2 from the oracle (in $KOJI tokens)
    function getOracleMaxStaking() public view returns (uint256, uint256) {

        IOracle oracle = IOracle(auth.getKojiOracle());
       
        return (oracle.getMinKOJITier1Amount(stakingLimitsConfig.minTier1Stake) * 200 / 100, oracle.getMinKOJITier2Amount(stakingLimitsConfig.minTier2Stake) * 400 / 100); //tier 1 max, tier 2 max
    }


    // Gets the tier equivalent (0, 1, or 2) of an input amount of KOJI tokens based on USD value thresholds
    function getTierequivalent(uint256 _amount) public view returns (uint256) {

        uint256 totalvalue = getUSDequivalent(_amount);

        if (totalvalue >= stakingLimitsConfig.minTier1Stake - 1000000000) {
            return 1;
        } else {
            if (totalvalue >= stakingLimitsConfig.minTier2Stake - 1000000000 && totalvalue < stakingLimitsConfig.minTier1Stake - 1000000000) {
                return 2;
            } else {
                return 0;
            }
        }
    }

    // Gets the reduced supermint accrual period based on user tier and staking amount (over-staking reduces wait time)
    function getOverStakeTimeframe(uint _usertier, uint256 _amount) internal view returns (uint256) {

        uint256 multiplier = 100;

        (uint256 tier1min, uint256 tier2min) = getOracleMinMax();

        if (_usertier == 1) {
            if(_amount >= tier1min) { multiplier = _amount * 100 / tier1min;}

            if (multiplier > 150) {multiplier = 150;}

            return accrualConfig.frame1 * 100 / multiplier;

        } else {
            if(_amount >= tier2min) { multiplier = _amount * 100 / tier2min;}

            if (multiplier > 200) {multiplier = 200;}

            return accrualConfig.frame2 * 100 / multiplier;
        }
        
    }

    // Gets the KOJIFLUX price for purchasing a superMint based on user tier and staking amount (over-staking reduces price)
    function getSuperMintFluxPrice(uint _usertier, uint256 _useramount) public view returns (uint256) {

        uint256 multiplier = 100;
        uint256 fluxprice;

        (uint256 tier1min, uint256 tier2min) = getOracleMinMax();

        if (_usertier == 1) {
            if(_useramount >= tier1min) { multiplier = _useramount * 100 / tier1min;}

            if (multiplier > 500) {multiplier = 500;}

            fluxprice = IOracle(auth.getKojiOracle()).getSuperMintFluxPrice(superMintConfig.fluxPrice1);

            return fluxprice * multiplier / 100;

        } else {
            if(_useramount >= tier2min) { multiplier = _useramount * 100 / tier2min;}

            if (multiplier > 2000) {multiplier = 2000;}

            fluxprice = IOracle(auth.getKojiOracle()).getSuperMintFluxPrice(superMintConfig.fluxPrice2);

            return fluxprice * multiplier / 100;
        }
        
    }

    // Gets the $KOJI price for purchasing a superMint, including incremental price increases per purchase
    function getSuperMintKojiPrice(address _holder) external view returns(uint256) {
        IOracle oracle = IOracle(auth.getKojiOracle());
        return oracle.getSuperMintKojiPrice(superMintConfig.kojiPrice) + (oracle.getSuperMintKojiPrice(superMintConfig.increase) * superMintCounter[_holder]);
    }

    // Gets the USD dollar equivalent value of an input amount of KOJI tokens using oracle price
    function getUSDequivalent(uint256 _amount) public view returns (uint256) {
        (,,uint256 kojiusdvalue) = IOracle(auth.getKojiOracle()).getKojiUSDPrice();

        return kojiusdvalue * _amount / 10**9;
    }

    // Function to purchase a superMint using accrued KOJIFLUX rewards (requires accrual period to be completed)
    function buySuperMintFlux() external nonReentrant {
        UserInfo storage user = userInfo[0][_msgSender()]; 

        require(userStaked[_msgSender()], "E29");
        require(featureFlags.enableFluxSuperMintBuying, "E30");
        require(!superMint[_msgSender()], "E31");
        
        (,bool supermintunlocked) = getAccrualTime(_msgSender());

        require(supermintunlocked, "E32");

        redeemTotalRewards(_msgSender());

        uint256 fluxprice = getSuperMintFluxPrice(user.tierAtStakeTime,user.amount);

        require(userBalance[_msgSender()] >= fluxprice, "E33");

        userBalance[_msgSender()] = userBalance[_msgSender()] - fluxprice;
        superMint[_msgSender()] = true;

        user.supermintstaketimer = block.timestamp; 
    }

    // Function to purchase a superMint using $KOJI tokens (price increases with each purchase)
    function buySuperMintKoji() external nonReentrant {
        
        require(userStaked[_msgSender()], "E29");
        require(featureFlags.enableKojiSuperMintBuying, "E34");

        IOracle oracle = IOracle(auth.getKojiOracle());
        
        uint256 price = oracle.getSuperMintKojiPrice(superMintConfig.kojiPrice);
        price = price + (oracle.getSuperMintKojiPrice(superMintConfig.increase) * superMintCounter[_msgSender()]);
        require(IERC20(auth.getKojiEarth()).balanceOf(_msgSender()) >= price, "E35"); 
        require(!superMint[_msgSender()], "E31");

        IERC20(auth.getKojiEarth()).transferFrom(_msgSender(), address(auth.getKojiRewards()), price);
        superMint[_msgSender()] = true;
        superMintCounter[_msgSender()]++;
    }

    // Redeem both tier 1 and tier 2 NFTs using a superMint (bypasses tier requirements)
    function supermint(uint256 _nftID) external nonReentrant {

        if (superMint[_msgSender()]) {

            superMint[_msgSender()] = false;
            IKojiNFT(auth.getKojiNFT()).mintNFT(_msgSender(), 1, _nftID, 0, false, true, false);
            IKojiNFT(auth.getKojiNFT()).mintNFT(_msgSender(), 2, _nftID, 0, false, true, false);

        } else {
            require(superMint[_msgSender()], "E21");
        }
    }




    // Get the unstake penalty tax percentage based on how long tokens have been staked
    // Penalty decreases over time from startingTax to defaultTax
    function getUnstakePenalty(uint256 _staketime) public view returns (uint256) {

        uint256 totaldays = block.timestamp - _staketime;
        
        totaldays = totaldays / penaltyConfig.period;

        if (totaldays >= penaltyConfig.startingTax) {

            return penaltyConfig.defaultTax;

        } else {

            uint256 totalunstakefee  = penaltyConfig.startingTax - totaldays;

            if (totalunstakefee <= penaltyConfig.defaultTax) {
                return penaltyConfig.defaultTax;
            } else {
                return totalunstakefee;
            }

        }


    }


    // Get the net amount a user would receive if they withdraw a specified amount (includes reflection rewards minus penalty tax)
    // Pass 0 for _amount to calculate for full user balance
    function getWithdrawResult(address _holder, uint256 _amount) public view returns (uint256) {

        PoolInfo storage pool = poolInfo[0];
        UserInfo storage user = userInfo[0][_holder];

        if (_amount == 0) { //pass 0 to use full user.amount, otherwise pass partial amount
            _amount = user.amount;
        } 

        uint256 netamount;

        uint256 tokenSupply = pool.stakeToken.balanceOf(address(this)); // Get total amount of KOJI tokens
        uint256 totalRewards = tokenSupply - pool.runningTotal; // Get difference between contract address amount and ledger amount
        uint256 percentRewards = _amount * 100 / pool.runningTotal; // Get % of share out of 100
        uint256 reflectAmount = percentRewards * totalRewards / 100; // Get % of reflect amount           
        uint256 taxfeenumerator = getUnstakePenalty(user.unstakeTime);
        uint256 taxfee = penaltyConfig.taxableAmount - (penaltyConfig.taxableAmount * taxfeenumerator / penaltyConfig.denominator);
        netamount = _amount * taxfee / penaltyConfig.denominator;
        netamount = netamount + reflectAmount;

        return netamount;

    }

    // Get the reflection rewards amount a holder would receive for a specified withdrawal amount
    // Pass 0 for _amount to calculate for full user balance
    function getHolderRewards(address _address, uint256 _amount) external view returns (uint256) {
        PoolInfo storage pool = poolInfo[0];
        UserInfo storage user = userInfo[0][_address];

        if (_amount == 0) { //pass 0 to use full user.amount, otherwise pass partial amount
            _amount = user.amount;
        } 
        uint256 tokenSupply = pool.stakeToken.balanceOf(address(this)); // Get total amount of tokens
        uint256 totalRewards = tokenSupply - pool.runningTotal; // Get difference between contract address amount and ledger amount
        
         if (totalRewards > 0) { // Include reflection
            uint256 percentRewards = _amount * 100 / pool.runningTotal; // Get % of share out of 100
            uint256 reflectAmount = percentRewards * totalRewards / 100; // Get % of reflect amount

            return reflectAmount; // return reflection amount

         } else {

             return 0;

         }

    }


    // Set the superMint status for a holder (authorized addresses only)
    function setSuperMintStatus(address _holder, bool _status) external onlyAuthorized { 
        superMint[_holder] = _status;
    }

    // Get the remaining time until a user can unlock a supermint purchased with FLUX and whether it's unlocked
    // Returns (timeLeft, isUnlocked)
    function getAccrualTime(address _holder) public view returns (uint256,bool) {
        UserInfo storage user = userInfo[0][_holder]; 

        uint256 timeleft = user.supermintstaketimer + user.supermintaccrualperiod;

        if (timeleft > block.timestamp) {
            return (timeleft - block.timestamp,false);
        } else {
            return (0,true);
        }
    
    }

    // External setters for all config structs (comprehensive setters)

    // Set the staking limits configuration (minimum tier amounts and upper limiter percentage)
    function setStakingLimitsConfig(
        uint256 _minTier1Stake,
        uint256 _minTier2Stake,
        uint256 _upperLimiter
    ) external onlyAuthorized {
        require(_minTier2Stake > 0, "E27");
        require(_minTier1Stake > _minTier2Stake, "E28");
        require(_upperLimiter > 100, "E36");
        stakingLimitsConfig.minTier1Stake = _minTier1Stake;
        stakingLimitsConfig.minTier2Stake = _minTier2Stake;
        stakingLimitsConfig.upperLimiter = _upperLimiter;
    }

    // Set the peg configuration (USD peg price and tier pegs for bonus calculations)
    function setPegConfig(
        uint256 _kojiusd,
        uint256 _tier1peg,
        uint256 _tier2peg
    ) external onlyAuthorized {
        pegConfig.kojiUsdPeg = _kojiusd;
        pegConfig.tier1kojiPeg = _tier1peg;
        pegConfig.tier2kojiPeg = _tier2peg;
    }

    // Set the superMint configuration (FLUX prices for tier 1/2, KOJI price, and price increase per purchase)
    function setSuperMintConfig(
        uint256 _fluxprice1,
        uint256 _fluxprice2,
        uint256 _kojiprice,
        uint256 _increase
    ) external onlyAuthorized {
        superMintConfig.fluxPrice1 = _fluxprice1;
        superMintConfig.fluxPrice2 = _fluxprice2;
        superMintConfig.kojiPrice = _kojiprice;
        superMintConfig.increase = _increase;
    }

    // Set the penalty configuration (tax amounts, denominator, and penalty period duration)
    function setPenaltyConfig(
        uint256 _taxableAmount,
        uint256 _startingTax,
        uint256 _defaultTax,
        uint256 _denominator,
        uint256 _period
    ) external onlyAuthorized {
        require(_period > 0, "E37");
        penaltyConfig.taxableAmount = _taxableAmount;
        penaltyConfig.startingTax = _startingTax;
        penaltyConfig.defaultTax = _defaultTax;
        penaltyConfig.denominator = _denominator;
        penaltyConfig.period = _period;
    }

    // Set the accrual configuration (time frames for tier 1 and tier 2 superMint accrual)
    function setAccrualConfig(
        uint256 _frame1,
        uint256 _frame2
    ) external onlyAuthorized {
        require(_frame1 > 0, "E38");
        require(_frame2 > 0, "E39");
        accrualConfig.frame1 = _frame1;
        accrualConfig.frame2 = _frame2;
    }

    // Set the feature flags (enable/disable various contract features)
    function setFeatureFlags(
        bool _enableKojiSuperMintBuying,
        bool _enableFluxSuperMintBuying,
        bool _enableTaxlessWithdrawals,
        bool _convertRewardsEnabled,
        bool _withdrawRewardsEnabled
    ) external onlyAuthorized {
        featureFlags.enableKojiSuperMintBuying = _enableKojiSuperMintBuying;
        featureFlags.enableFluxSuperMintBuying = _enableFluxSuperMintBuying;
        featureFlags.enableTaxlessWithdrawals = _enableTaxlessWithdrawals;
        featureFlags.convertRewardsEnabled = _convertRewardsEnabled;
        featureFlags.withdrawRewardsEnabled = _withdrawRewardsEnabled;
    }

}
