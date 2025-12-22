// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IDEXRouter {
    function factory() external pure returns (address);
    function WETH() external pure returns (address);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);

    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;

    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable;

    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
}

interface IWETH {
    function deposit() external payable;
    function transfer(address to, uint value) external returns (bool);
    function approve(address spender, uint value) external returns (bool);
    function balanceOf(address owner) external view returns (uint);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

interface IAuth {
    function isAuthorized(address _address) external view returns (bool);
    function getKojiStaking() external view returns (address);
    function DEAD() external view returns (address);
}

contract MarketOrder is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    modifier onlyAuthorized() {
        require(auth.getKojiStaking() == address(_msgSender()) || owner() == address(_msgSender()), "Staking not Authorized to MarketOrder");
        _;
    }

    IDEXRouter public router;
    address public WETH;
    uint24 marketBuyGas = 450000;  
    IAuth public auth;

    event MarketBuyExecuted(address indexed token, address indexed recipient, uint256 ethAmount, uint256 tokensPurchased);
    event MarketBuyGasUpdated(uint24 newGas);
    event ERC20TokensRescued(address indexed token, address indexed to, uint256 amount);

     constructor(address _router, address _auth) {
        require(_auth != address(0), "Auth address cannot be zero");
        auth = IAuth(_auth);

        router = _router != address(0)
            ? IDEXRouter(_router)
            : IDEXRouter(0xD99D1c33F9fC3444f8101754aBC46c52416550D1); //0xD99D1c33F9fC3444f8101754aBC46c52416550D1 pcs test router
        WETH = router.WETH();
        require(WETH != address(0), "WETH address cannot be zero");
    }

    receive() external payable {}

    function marketBuy(address _token, address _recipient) external payable onlyAuthorized nonReentrant returns (uint) {
        require(msg.value > 0, "ETH amount must be greater than zero");
        require(_token != address(0), "Token address cannot be zero");
        require(_recipient != address(0), "Recipient address cannot be zero");
        require(_token != WETH, "Cannot buy WETH");

        IERC20 token = IERC20(_token); //token to buy

        uint balanceBefore = token.balanceOf(_recipient); //get prior balance of recipient

        address[] memory path = new address[](2);
        path[0] = WETH;
        path[1] = _token;

        // Execute swap - amountOutMin is 0 to allow maximum slippage (caller should validate expected output)
        // Gas limit is set via call option to prevent out-of-gas errors during complex swaps
        router.swapExactETHForTokensSupportingFeeOnTransferTokens{value: msg.value, gas: marketBuyGas}(
            0, // amountOutMin - set to 0, caller should validate expected output
            path,
            address(_recipient),
            block.timestamp
        );

        uint balanceNow = token.balanceOf(_recipient);
        uint amountpurchased = balanceNow - balanceBefore;

        emit MarketBuyExecuted(_token, _recipient, msg.value, amountpurchased);

        return amountpurchased;
    }

     function changeMarketBuyGas(uint24 _gas) external onlyAuthorized {
        require(_gas > 0, "Gas limit must be greater than zero");
        marketBuyGas = _gas;
        emit MarketBuyGasUpdated(_gas);
    }

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
        IERC20(_tokenAddr).safeTransfer(_to, _amount);
        emit ERC20TokensRescued(_tokenAddr, _to, _amount);
    }

}
