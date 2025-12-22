// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

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

interface IAuth {
    function isAuthorized(address _address) external view returns (bool);
    function getKojiFlux() external view returns (address);
    function getKojiStaking() external view returns (address);
    function getKojiEarth() external view returns (address);
}

interface IKojiStaking {
    function redeemTotalRewardsExt(address _user) external;
    function setKojiFluxBalance(address _address, uint256 _amount) external;
    function getKojiFluxBalance(address _address) external view returns (uint256);
}

contract KojiRewards is Ownable, ReentrancyGuard {

    modifier onlyAuthorized() {
        require(auth.isAuthorized(_msgSender()) || owner() == address(_msgSender()), "User not Authorized to Rewards Contract");
        _;
    }

    IBEP20 internal tokencontractv2Interface;
    IBEP20 internal rewardtoken;

    mapping (address => uint256) public holderRealized;
    mapping (address => uint256) public holderRewardLast;
    mapping (address => bool) public blacklisted;
    
    bool public rewardsEnabled = true;
    bool public enableKojiWithdraw = false; // Whether KOJI is withdrawable from this contract (default false).
    bool public enableFluxWithdraw = false; // Whether FLUX is withdrawable from this contract (default false).

    IAuth private auth;

    event Withdraw(address indexed user, uint256 amount);
    event KojiWithdrawalsEnabled(bool enabled);
    event FluxWithdrawalsEnabled(bool enabled);
    event RewardsEnabled(bool enabled);
    event BlacklistUpdated(address indexed account, bool blacklisted);
    event ERC20TokensRescued(address indexed token, address indexed to, uint256 amount);
    
    constructor(address _auth) {
        require(_auth != address(0), "Auth address cannot be zero");
        auth = IAuth(_auth);
        address fluxAddress = auth.getKojiFlux();
        require(fluxAddress != address(0), "KojiFlux address cannot be zero");
        rewardtoken = IBEP20(fluxAddress); //KOJIFLUX
    }

    receive() external payable {}

    // This will allow to rescue ETH sent to the contract
    function rescueETHFromContract() external onlyAuthorized {
        address payable _owner = payable(_msgSender());
        (bool success, ) = _owner.call{value: address(this).balance}("");
        require(success, "ETH transfer failed");
    }

    // Function to allow admin to claim *other* ERC20 tokens sent to this contract (by mistake)
    function transferERC20Tokens(address _tokenAddr, address _to, uint _amount) public onlyAuthorized {
        require(_tokenAddr != address(0), "Token address cannot be zero");
        require(_to != address(0), "Recipient address cannot be zero");
                
        // Interactions: External token transfer
        bool success = IBEP20(_tokenAddr).transfer(_to, _amount);
        require(success, "Token transfer failed");
        
        emit ERC20TokensRescued(_tokenAddr, _to, _amount);
    }

    function payPendingRewards(address _holder, uint256 _amount) external {
        require(_msgSender() == address(auth.getKojiStaking()), "Rewards are not payable outside of the staking contract");
        require(enableKojiWithdraw, "KOJI withdrawals are not enabled");
        require(_holder != address(0), "Holder address cannot be zero");
        require(!blacklisted[_holder], "Holder is blacklisted");
        require(rewardsEnabled, "Rewards are currently disabled");

        // Interactions: External token transfer (get actual amount transferred)
        uint256 actualAmount = safeTokenTransfer(_holder, _amount);
        
        // Effects: Update state with actual amount transferred
        if (actualAmount > 0) {
            holderRealized[_holder] = holderRealized[_holder] + actualAmount;
            holderRewardLast[_holder] = block.timestamp;
        }
    }

    // Send KOJI v2 tokens 
    // Returns the actual amount transferred
    function safeTokenTransfer(address _to, uint256 _amount) internal returns (uint256) {
        tokencontractv2Interface = IBEP20(auth.getKojiEarth());
        uint256 balance = tokencontractv2Interface.balanceOf(address(this));
        uint256 amount = _amount > balance ? balance : _amount;
        if (amount > 0) {
            bool success = tokencontractv2Interface.transfer(_to, amount);
            require(success, "KOJI token transfer failed");
        }
        return amount;
    }

     // Safe KOJIFLUX token transfer function
     // Returns the actual amount transferred
    function safeFluxTransfer(address _to, uint256 _amount) internal returns (uint256) {
        uint256 balance = rewardtoken.balanceOf(address(this));
        uint256 amount = _amount > balance ? balance : _amount;
        if (amount > 0) {
            bool success = rewardtoken.transfer(_to, amount);
            require(success, "FLUX token transfer failed");
        }
        return amount;
    }

    // Whether to allow the KOJI token to actually be withdrawn, or just leave it virtual (default)
    function enableKojiWithdrawals(bool _status) external onlyAuthorized {
        enableKojiWithdraw = _status;
        emit KojiWithdrawalsEnabled(_status);
    }

    // Whether to allow the FLUX token to actually be withdrawn, or just leave it virtual (default)
    function enableFluxWithdrawals(bool _status) external onlyAuthorized {
        enableFluxWithdraw = _status;
        emit FluxWithdrawalsEnabled(_status);
    }

    // Enable or disable rewards distribution
    function setRewardsEnabled(bool _status) external onlyAuthorized {
        rewardsEnabled = _status;
        emit RewardsEnabled(_status);
    }

    // Blacklist or unblacklist an address
    function setBlacklist(address _account, bool _status) external onlyAuthorized {
        require(_account != address(0), "Account address cannot be zero");
        blacklisted[_account] = _status;
        emit BlacklistUpdated(_account, _status);
    }

    // View state of reward withdrawals (true/false)
    function rewardWithdrawalStatus() external view returns (bool,bool) {
        return (enableKojiWithdraw,enableFluxWithdraw);
    }

    // Withdraw KOJIFLUX
    function withdrawFluxOnly() public nonReentrant {
        require(enableFluxWithdraw, "FLUX withdrawals are not enabled");
        require(!blacklisted[_msgSender()], "Account is blacklisted");
        require(rewardsEnabled, "Rewards are currently disabled");

        IKojiStaking staking = IKojiStaking(auth.getKojiStaking()); 

        // Interaction: Update pending rewards in staking contract
        staking.redeemTotalRewardsExt(_msgSender());

        // Read: Get pending balance
        uint256 pending = staking.getKojiFluxBalance(_msgSender());
        
        if (pending > 0) {
            require(rewardtoken.balanceOf(address(this)) >= pending, "FLUX token balance of this contract is insufficient");
            
            // Interactions: External token transfer (must succeed before updating state)
            uint256 actualAmount = safeFluxTransfer(_msgSender(), pending);
            
            // Effects: Update state in staking contract only after successful transfer
            // Only set to 0 if full amount was transferred, otherwise reduce by actual amount
            if (actualAmount == pending) {
                staking.setKojiFluxBalance(_msgSender(), 0);
            } else {
                uint256 remaining = pending - actualAmount;
                staking.setKojiFluxBalance(_msgSender(), remaining);
            }
            
            emit Withdraw(_msgSender(), actualAmount);
        }
    }

}
