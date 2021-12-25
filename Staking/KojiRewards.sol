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

contract KojiRewards is Ownable, ReentrancyGuard {

    using SafeMath for uint256;

    IBEP20 internal kojifluxInterface;
    IBEP20 internal tokencontractv2Interface;

    mapping (address => uint256) public holderRealized;
    mapping (address => uint256) public holderBonus;
    mapping (address => uint256) public holderSwapLast;
    mapping (address => bool) public blacklisted;
    
    bool public rewardsEnabled = true;

    address public stakingContract = 0x99919114A6e249A9D7862422211d37C41eA29589;
    address public kojiflux = 0x99919114A6e249A9D7862422211d37C41eA29589;
    address public tokencontractv2 = 0x7eb567F5c781EE8e47C7100DC5046955503fc26A;
    
    constructor() {
        kojifluxInterface = IBEP20(kojiflux);
        tokencontractv2Interface = IBEP20(tokencontractv2);
    }

    // This will allow to rescue ETH sent by mistake directly to the contract
    function rescueETHFromContract() external onlyOwner {
        address payable _owner = payable(_msgSender());
        _owner.transfer(address(this).balance);
    }

    // Function to allow admin to claim *other* ERC20 tokens sent to this contract (by mistake)
    function transferERC20Tokens(address _tokenAddr, address _to, uint _amount) public onlyOwner {
        IBEP20(_tokenAddr).transfer(_to, _amount);
    }

    function payPendingRewards(address _holder, uint256 _amount) external {
        require(msg.sender == address(stakingContract), "Rewards are not payable outside of the staking contract");

        safeTokenTransfer(_holder, _amount);

    }

    function setstakingContract(address _address) external onlyOwner {
        stakingContract = _address;
    }

    // Send KOJI v2 tokens 
    function safeTokenTransfer(address _to, uint256 _amount) internal {
        uint256 balance = tokencontractv2Interface.balanceOf(address(this));
        uint256 amount = _amount > balance ? balance : _amount;
        tokencontractv2Interface.transfer(_to, amount);
    }

}