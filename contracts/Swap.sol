// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@uniswap/v2-periphery/contracts/interfaces/IWETH.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";


contract Swap {
    IERC20 BlazeToken;
    IUniswapV2Router02 Router = IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);

    address WethContract = 0xc778417E063141139Fce010982780140Aa0cD5Ab;

    // Mapping addresses to amount of wei stored in contract.
    mapping(address => uint256) public weiStored;

    constructor(address _blazeToken) {
        require(
            _blazeToken != address(0),
            "Swap: Null addres cannot be ERC20 token!"
        );
        BlazeToken = IERC20(_blazeToken);
    }

    receive() external payable {}

    function addLiquidityToPool(uint256 _tokenAmount) external payable {
        // Creates the pool and adds liquidity when called for the first time.
        require(
            BlazeToken.allowance(msg.sender, address(this)) >= _tokenAmount,
            "Swap: Insufficient BlazeToken allowance!"
        );
        require(
            msg.value >= 1 ether,
            "Swap: Minimum ether value is 1."
        );

        // Transfer BlazeTokens to itself.
        BlazeToken.transferFrom(msg.sender, address(this), _tokenAmount);

        // Give Router approval for BlazeTokens on its own behalf.
        BlazeToken.approve(address(Router), _tokenAmount);

        // Add liquidity to the pool.
        Router.addLiquidityETH{value: msg.value}(
            address(BlazeToken),
            _tokenAmount,
            _tokenAmount,
            msg.value,
            msg.sender,
            block.timestamp + 600
        );
    }


    function swapBLZ(uint256 _tokenAmount) external {
        // Swaps the given amount of BlazeTokens for ether and
        // stores the ether in this contract itself.
        require(
            BlazeToken.allowance(msg.sender, address(this)) >= _tokenAmount,
            "Swap: Insufficient BlazeToken allowance!"
        );

        // Transfer BlazeTokens to itself.
        BlazeToken.transferFrom(msg.sender, address(this), _tokenAmount);

        // Give Router approval for BlazeTokens on its own behalf.
        BlazeToken.approve(address(Router), _tokenAmount);

        // Create a memory address for swap function input argument.
        address[] memory path = new address[](2);
        path[0] = address(BlazeToken);
        path[1] = WethContract;

        // Swaps the BlazeTokens for ether.
        (uint256[] memory amounts) = Router.swapExactTokensForETH(
            _tokenAmount,
            1,
            path,
            address(this),
            block.timestamp + 6000
        );

        // Increases the amount of wei stored in contract for the msg.sender.
        weiStored[msg.sender] += amounts[1];
    }

    function withdrawETH(uint256 _weiAmount) external {
        // Alows users to claim their stored ether in contract.
        require(
            weiStored[msg.sender] >= _weiAmount,
            "Swap: Insufficient balance!"
        );

        weiStored[msg.sender] -= _weiAmount;

        payable(msg.sender).transfer(_weiAmount);
    }
}
