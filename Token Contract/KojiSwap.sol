// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Context.sol";

interface KojiEarth {
    function GetPending(address _shareholder) external view returns (uint256);
    function GetClaimed(address _shareholder) external view returns (uint256);
    function GetShareholderExpired(address _holder) external view returns (uint256);
    function ViewHolderInfo(address _address) external view returns (uint256 amount, uint256 unpaid, uint256 realised, uint256 excluded, bool rewardeligible);
}   

interface KojiOracle {
    function getbnbequivalent(uint256 amount) external view returns (uint256);
}

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

contract KojiSwap is Ownable, ReentrancyGuard {

    using SafeMath for uint256;
    
    KojiEarth internal kojiearth;
    KojiOracle internal oracle;
    IBEP20 internal tokencontractv1Interface;
    IBEP20 internal tokencontractv2Interface;

    mapping (address => bool) PendingDivsPaid;
    mapping (address => bool) SwapComplete;
    mapping (address => uint256) public holderRealized;
    mapping (address => uint256) public holderBonus;
    mapping (address => bool) blacklisted;

    bool public rewardsEnabled = true;

    address public tokencontractv1 = 0xA2d1Ab6CD703ccCE3c5C7F35439746b49A017263;
    address public tokencontractv2 = 0xB02Ce3C585547cC663F2B3D04BeB75DfBf3B2D9D;
    
    constructor() {
        kojiearth = KojiEarth(tokencontractv1);
        oracle = KojiOracle(0x08A3B82e84D0e70ED0321EbB5EB676cd0eC35bAF);  
        tokencontractv1Interface = IBEP20(tokencontractv1);
        tokencontractv2Interface = IBEP20(tokencontractv2);

        tokencontractv2Interface.approve(address(this), type(uint256).max);
    }
    
    receive() external payable {}

    // This will allow owner to rescue BNB sent by mistake directly to the contract
    function rescueBNB() external onlyOwner {
        address payable _owner = payable(msg.sender);
        _owner.transfer(address(this).balance);
    }

    // Function to allow admin to claim *other* ERC20 tokens sent to this contract
    function transferBEP20Tokens(address _tokenAddr, address _to, uint _amount) external onlyOwner {
        IBEP20(_tokenAddr).transfer(_to, _amount);
    }

    function changeOracle(address _oracle) external onlyOwner {
        oracle = KojiOracle(_oracle);
    }

    function changeContracts(address _v1, address _v2) external onlyOwner {
        tokencontractv1 = _v1;
        tokencontractv2 = _v2;

        kojiearth = KojiEarth(_v1);
        tokencontractv1Interface = IBEP20(_v1);
        tokencontractv2Interface = IBEP20(_v2);
    }

    function hasPendingDividends(address holder) public view returns (bool) {
        uint256 tempdivs = kojiearth.GetPending(holder);
        tempdivs = tempdivs.add(kojiearth.GetClaimed(holder));
        if (tempdivs > 1) {
            return true;
        } else {
            return false;
        }
    }

    function getClaimedDividends(address holder) public view returns (uint256) {
        if (kojiearth.GetShareholderExpired(holder) != 9999999999 || PendingDivsPaid[_msgSender()]) {
            return 0;
        } else {
            return kojiearth.GetClaimed(holder);
        }
        
    }

    function getPendingDividends(address holder) public view returns (uint256) {
        if (kojiearth.GetShareholderExpired(holder) != 9999999999 || PendingDivsPaid[_msgSender()]) {
            return 0;
        } else {
        return kojiearth.GetPending(holder);
        }
    }

    function payDividends() external nonReentrant {
        if (kojiearth.GetShareholderExpired(_msgSender()) != 9999999999) {
            //mark address as completed
            PendingDivsPaid[_msgSender()] = true;
            return;
        } else {
            require(hasPendingDividends(_msgSender()), "User has no pending dividends");
            require(!PendingDivsPaid[_msgSender()], "User has already received outstanding dividends!");
            //get the total pending divs
            uint256 tempbnb = getPendingDividends(_msgSender());
            tempbnb = tempbnb.add(getClaimedDividends(_msgSender()));

            //get the equivalent KOJI amount from the oracle
            uint256 tempkoji = oracle.getbnbequivalent(tempbnb);

            //transfer BNB to sender
            (bool successShareholder, /* bytes memory data */) = payable(_msgSender()).call{value: tempbnb, gas: 30000}("");
            require(successShareholder, "Shareholder rejected BNB transfer");

            //record realized BNB
            holderRealized[_msgSender()] = tempbnb;

            //transfer bonus KOJI v2 to sender
            if (!blacklisted[_msgSender()] && rewardsEnabled) {
                tokencontractv2Interface.transfer(_msgSender(), tempkoji);
                holderBonus[_msgSender()] = tempkoji;
            }
        
            //mark address as completed
            PendingDivsPaid[_msgSender()] = true;
        }
    }

    function swapTokens() external nonReentrant {
        require(!hasPendingDividends(_msgSender()) || PendingDivsPaid[_msgSender()], "Cannot complete swap: user has unpaid dividends");
        //get v1 balance at this address
        uint256 balanceBefore = tokencontractv1Interface.balanceOf(address(this));
        uint256 balanceUser = tokencontractv1Interface.balanceOf(_msgSender());

        //get v1 tokens
        tokencontractv1Interface.transferFrom(address(_msgSender()), address(this), balanceUser);
        
        uint256 balanceNow = tokencontractv1Interface.balanceOf(address(this));
        uint256 newBalanceUser = tokencontractv1Interface.balanceOf(_msgSender());

        //validate receipt of old tokens

        require(newBalanceUser == 0, "User balance not zero");
        require(balanceBefore.add(balanceUser) == balanceNow, "User balance added to contract balance do not match");

        //send user  new tokens
        tokencontractv2Interface.transfer(_msgSender(), balanceUser);

        //mark user as completed
        SwapComplete[_msgSender()] = true;

    }

    function getRealized(address holder) external view returns (uint256) {
        (,,uint256 v1Realized,,) = kojiearth.ViewHolderInfo(holder);
        uint256 swapRealized = holderRealized[holder];

        return v1Realized.add(swapRealized);
    }

    function changeBlacklistStatus(address _holder, bool _status) external onlyOwner {
        blacklisted[_holder] = _status;
    }

    function setRewardsEnabled(bool _status) external onlyOwner {
        rewardsEnabled = _status;
    }

}
