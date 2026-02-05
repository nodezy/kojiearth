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

    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);

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

interface IKojiEarth {
    function approveMax(address spender) external returns (bool);
}

interface IAuth {
    function isAuthorized(address _address) external view returns (bool);
    function getKojiStaking() external view returns (address);
    function getKojiEarth() external view returns (address);
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
    uint256 public defaultSlippageTolerance = 500; // 5% default slippage (500 basis points = 5%)
    IAuth public auth;

    event MarketBuyExecuted(address indexed token, address indexed recipient, uint256 ethAmount, uint256 tokensPurchased);
    event MarketSellExecuted(address indexed token, address indexed recipient, uint256 ethAmount, uint256 tokensPurchased);
    event MarketBuyGasUpdated(uint24 newGas);
    event RouterUpdated(address indexed oldRouter, address indexed newRouter);
    event SlippageToleranceUpdated(uint256 newTolerance);
    event TokenApprovalSet(address indexed token, address indexed spender, uint256 amount);
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
        return marketBuyWithSlippage(_token, _recipient, 0);
    }

    function marketBuyWithSlippage(address _token, address _recipient, uint256 _amountOutMin) internal returns (uint) {
        require(msg.value > 0, "ETH amount must be greater than zero");
        require(_token != address(0), "Token address cannot be zero");
        require(_recipient != address(0), "Recipient address cannot be zero");
        require(_token != WETH, "Cannot buy WETH");

        IERC20 token = IERC20(_token); //token to buy

        uint balanceBefore = token.balanceOf(_recipient); //get prior balance of recipient

        address[] memory path = new address[](2);
        path[0] = WETH;
        path[1] = _token;

        // Calculate minimum output if not provided
        uint256 amountOutMin = _amountOutMin;
        if (amountOutMin == 0) {
            try router.getAmountsOut(msg.value, path) returns (uint[] memory amounts) {
                // Apply default slippage tolerance to expected output
                // Note: getAmountsOut doesn't account for fee-on-transfer, so we apply additional buffer
                uint256 expectedOut = amounts[amounts.length - 1];
                amountOutMin = expectedOut * (10000 - defaultSlippageTolerance) / 10000;
            } catch {
                // If getAmountsOut fails, set to 0 (no protection) - maintains backward compatibility
                amountOutMin = 0;
            }
        }

        // Execute swap with slippage protection
        // Gas limit is set via call option to prevent out-of-gas errors during complex swaps
        router.swapExactETHForTokensSupportingFeeOnTransferTokens{value: msg.value, gas: marketBuyGas}(
            amountOutMin,
            path,
            address(_recipient),
            block.timestamp
        );

        uint balanceNow = token.balanceOf(_recipient);
        uint amountpurchased = balanceNow - balanceBefore;

        // Verify we got at least the minimum (if protection was applied)
        if (amountOutMin > 0) {
            require(amountpurchased >= amountOutMin, "Slippage tolerance exceeded");
        }

        emit MarketBuyExecuted(_token, _recipient, msg.value, amountpurchased);

        return amountpurchased;
    }

    function marketSell(address _token, address _recipient, uint _amount) external onlyAuthorized nonReentrant returns (uint) {
        return marketSellWithSlippage(_token, _recipient, _amount);
    }

    function marketSellWithSlippage(address _token, address _recipient, uint _amount) internal returns (uint) {
        require(_amount > 0, "Token amount must be greater than zero");
        require(_token != address(0), "Token address cannot be zero");
        require(_recipient != address(0), "Recipient address cannot be zero");
        require(_token != WETH, "Cannot sell WETH");

        IERC20 token = IERC20(_token); //token to sell

        uint balanceBefore = address(_recipient).balance; //get prior balance of recipient

        address[] memory path = new address[](2);
        path[0] = _token;
        path[1] = WETH;

        // Transfer tokens from caller to this contract
        token.safeTransferFrom(_msgSender(), address(this), _amount);
        
        // Get actual balance received (important for fee-on-transfer tokens)
        uint256 actualAmount = token.balanceOf(address(this));
        require(actualAmount > 0, "No tokens received after transfer");
        
        // Approve router to spend the actual amount received
        token.safeApprove(address(router), actualAmount);

        // Calculate minimum output if not provided
        
        (,uint amountOutMin,bool success) = getExpectedSellOutput(_token, actualAmount); 
        if (!success) {
            revert("Slippage not calculated");
        }

        // Execute swap with slippage protection using actual amount received
        // Gas limit is set via call option to prevent out-of-gas errors during complex swaps
        router.swapExactTokensForETHSupportingFeeOnTransferTokens{gas: marketBuyGas}(
            actualAmount,
            amountOutMin,
            path,
            address(_recipient),
            block.timestamp
        );

        uint balanceNow = address(_recipient).balance;
        uint amountReceived = balanceNow - balanceBefore;

        emit MarketSellExecuted(_token, _recipient, amountReceived, _amount);

        return amountReceived;
    }

     function changeMarketBuyGas(uint24 _gas) external onlyAuthorized {
        require(_gas > 0, "Gas limit must be greater than zero");
        marketBuyGas = _gas;
        emit MarketBuyGasUpdated(_gas);
    }

    function changeRouter(address _newRouter) external onlyAuthorized {
        require(_newRouter != address(0), "Router address cannot be zero");
        address oldRouter = address(router);
        router = IDEXRouter(_newRouter);
        WETH = router.WETH();
        require(WETH != address(0), "WETH address cannot be zero");
        emit RouterUpdated(oldRouter, _newRouter);
    }

    function changeSlippageTolerance(uint256 _slippageTolerance) external onlyAuthorized {
        require(_slippageTolerance <= 1000, "Slippage tolerance cannot exceed 10% (1000 basis points)");
        defaultSlippageTolerance = _slippageTolerance;
        emit SlippageToleranceUpdated(_slippageTolerance);
    }

    function getKojiEarthAddress() external view returns (address) {
        return auth.getKojiEarth();
    }

    // Getter function to test router.getAmountsOut() and calculate expected output with slippage
    function getExpectedOutput(uint256 _amountIn, address[] calldata _path) external view returns (
        uint[] memory amounts,
        uint256 expectedOut,
        uint256 minOutWithSlippage,
        bool success
    ) {
        try router.getAmountsOut(_amountIn, _path) returns (uint[] memory routerAmounts) {
            amounts = routerAmounts;
            expectedOut = routerAmounts[routerAmounts.length - 1];
            minOutWithSlippage = expectedOut * (10000 - defaultSlippageTolerance) / 10000;
            success = true;
        } catch {
            amounts = new uint[](0);
            expectedOut = 0;
            minOutWithSlippage = 0;
            success = false;
        }
    }

    // Convenience function to get expected output for buying tokens with ETH
    function getExpectedBuyOutput(address _token, uint256 _ethAmount) external view returns (
        uint256 expectedTokens,
        uint256 minTokensWithSlippage,
        bool success
    ) {
        require(_token != address(0), "Token address cannot be zero");
        require(_token != WETH, "Cannot buy WETH");
        require(_ethAmount > 0, "ETH amount must be greater than zero");
        require(WETH != address(0), "WETH address not set");

        address[] memory path = new address[](2);
        path[0] = WETH;
        path[1] = _token;

        // Check if amounts array would be valid length
        try router.getAmountsOut(_ethAmount, path) returns (uint[] memory amounts) {
            if (amounts.length < 2) {
                // Invalid response from router
                expectedTokens = 0;
                minTokensWithSlippage = 0;
                success = false;
            } else {
                expectedTokens = amounts[amounts.length - 1];
                if (expectedTokens == 0) {
                    // Router returned 0 output - likely no liquidity or pair doesn't exist
                    expectedTokens = 0;
                    minTokensWithSlippage = 0;
                    success = false;
                } else {
                    minTokensWithSlippage = expectedTokens * (10000 - defaultSlippageTolerance) / 10000;
                    success = true;
                }
            }
        } catch {
            // Router call failed - pool doesn't exist, invalid path, or other error
            expectedTokens = 0;
            minTokensWithSlippage = 0;
            success = false;
        }
    }

    // Diagnostic function to check router and path configuration for buying
    function checkBuyPath(address _token) external view returns (
        address wethAddress,
        address tokenAddress,
        address routerAddress,
        bool wethValid,
        bool tokenValid,
        bool routerValid
    ) {
        wethAddress = WETH;
        tokenAddress = _token;
        routerAddress = address(router);
        wethValid = WETH != address(0);
        tokenValid = _token != address(0) && _token != WETH;
        routerValid = address(router) != address(0);
    }

    // Convenience function to get expected output for selling tokens for ETH
    // NOTE: This function does NOT account for fee-on-transfer tokens.
    // For fee-on-transfer tokens, the actual amount received will be less than _tokenAmount.
    // The actual swap in marketSellWithSlippage uses the balance after transfer (actualAmount).
    function getExpectedSellOutput(address _token, uint256 _tokenAmount) public view returns (
        uint256 expectedETH,
        uint256 minETHWithSlippage,
        bool success
    ) {
        require(_token != address(0), "Token address cannot be zero");
        require(_token != WETH, "Cannot sell WETH");
        require(_tokenAmount > 0, "Token amount must be greater than zero");

        address[] memory path = new address[](2);
        path[0] = _token;
        path[1] = WETH;

        try router.getAmountsOut(_tokenAmount, path) returns (uint[] memory amounts) {
            expectedETH = amounts[amounts.length - 1];
            // Apply default slippage tolerance to calculate minimum acceptable output
            minETHWithSlippage = expectedETH * (10000 - defaultSlippageTolerance) / 10000;
            success = true;
        } catch {
            expectedETH = 0;
            minETHWithSlippage = 0;
            success = false;
        }
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
