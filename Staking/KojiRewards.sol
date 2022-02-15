// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Context.sol";

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

interface IKojiStaking {
    function redeemTotalRewards(address _user) external;
    function setKojiFluxBalance(address _address, uint256 _amount) external;
    function getKojiFluxBalance(address _address) external view returns (uint256);
}

contract KojiRewards is Ownable, ReentrancyGuard {

    using SafeMath for uint256;

    IBEP20 internal kojifluxInterface;
    IBEP20 internal tokencontractv2Interface;
    IBEP20 internal rewardtoken;

    IKojiStaking public staking;

    mapping (address => uint256) public holderRealized;
    mapping (address => uint256) public holderRewardLast;
    mapping (address => bool) public blacklisted;
    
    bool public rewardsEnabled = true;
    bool public enableRewardWithdraw = false; // Whether KOJIF is withdrawable from this contract (default false).
    bool public enableFluxWithdraw = false; // Whether FLUX is withdrawable from this contract (default false).

    address private stakingContract; 
    address public kojiflux = 0x047c256d8A082d6FdB9dfA81963E0Ec854575294;
    address public tokencontractv2 = 0x30256814b1380Ea3b49C5AEA5C7Fa46eCecb8Bc0;
    address public KojiFluxAddress = 0x047c256d8A082d6FdB9dfA81963E0Ec854575294; //KOJIFLUX contract address

    event Withdraw(address indexed user, uint256 amount);
    
    constructor() {
        kojifluxInterface = IBEP20(kojiflux);
        tokencontractv2Interface = IBEP20(tokencontractv2);
        rewardtoken = IBEP20(KojiFluxAddress); //KOJIFLUX
    }

    // This will allow to rescue ETH sent to the contract
    function rescueETHFromContract() external onlyOwner {
        address payable _owner = payable(_msgSender());
        _owner.transfer(address(this).balance);
    }

    // Function to allow admin to claim *other* ERC20 tokens sent to this contract
    function transferERC20Tokens(address _tokenAddr, address _to, uint _amount) public onlyOwner {
        IBEP20(_tokenAddr).transfer(_to, _amount);
    }

    function payPendingRewards(address _holder, uint256 _amount) external {
        require(_msgSender() == address(stakingContract), "Rewards are not payable outside of the staking contract");
        require(enableRewardWithdraw, "KOJI withdrawals are not enabled");

        holderRealized[_holder] = holderRealized[_holder].add(_amount);
        holderRewardLast[_holder] = block.timestamp;
        safeTokenTransfer(_holder, _amount);

    }

    function setstakingContract(address _address) external onlyOwner {
        stakingContract = _address;
        staking = IKojiStaking(stakingContract);
    }

    // Send KOJI v2 tokens 
    function safeTokenTransfer(address _to, uint256 _amount) internal {
        uint256 balance = tokencontractv2Interface.balanceOf(address(this));
        uint256 amount = _amount > balance ? balance : _amount;
        tokencontractv2Interface.transfer(_to, amount);
    }

     // Safe KOJIFLUX token transfer function
    function safeFluxTransfer(address _to, uint256 _amount) internal {
        uint256 balance = rewardtoken.balanceOf(address(this));
        uint256 amount = _amount > balance ? balance : _amount;
        rewardtoken.transfer(_to, amount);
    }

    // Whether to allow the KOJI token to actually be withdrawn, of just leave it virtual (default)
    function enableRewardWithdrawals(bool _status) external onlyOwner {
        enableRewardWithdraw = _status;
    }

    // Whether to allow the KOJI token to actually be withdrawn, of just leave it virtual (default)
    function enableFluxWithdrawals(bool _status) external onlyOwner {
        enableFluxWithdraw = _status;
    }

    // View state of reward withdrawals (true/false)
    function rewardWithdrawalStatus() external view returns (bool) {
        return enableRewardWithdraw;
    }

    // Withdraw KOJIFLUX
    function withdrawRewardsOnly() public nonReentrant {

        require(enableFluxWithdraw, "KOJIFLUX withdrawals are not enabled");

        staking.redeemTotalRewards(_msgSender());

        uint256 pending = staking.getKojiFluxBalance(_msgSender());
        if (pending > 0) {
            require(rewardtoken.balanceOf(address(this)) > pending, "KOJIFLUX token balance of this contract is insufficient");
            staking.setKojiFluxBalance(_msgSender(),0);
            safeFluxTransfer(_msgSender(), pending);
        }
        
        emit Withdraw(_msgSender(), pending);
    }

}
