# ERC20 Swap

## Contract: BlazeToken.sol

- Contract deployed on [rinkeby test network](https://rinkeby.etherscan.io/address/0x4D84F2aBB59eeC1f31f0eaf7806C8e33044F46F5) at:

```script
0x4D84F2aBB59eeC1f31f0eaf7806C8e33044F46F5
```

This contract deploys an ERC20 token with the following details.

- Name: "BlazeK"
- Symbol: "BLZ"
- Decimals: 18

- This token will be used to create a ERC20 <-> Weth liquidity pair using Uniswap V2 router.

- There is no initial supply, but the contract owner can call the mint() function to mint tokens to an address.
It takes the address and the amount of tokens to mint as arguments (must be passed without token decimals).

## Contract: Swap.sol

- Contract deployed on [rinkeby test network](https://rinkeby.etherscan.io/address/0x9Cd3215504A6721e9C2124a5c33e28176E2f9D6f) at:

```script
0x9Cd3215504A6721e9C2124a5c33e28176E2f9D6f
```

- This contract uses the Uniswap V2 router to create a new ERC20<->Weth pair and add the initial liquidity to it.

- Users can interact with the swapBLZ() function to swap their ERC20 tokens with eth, which gets stored in this contract itself.
- It takes the amount of ERC20 tokens to swap as argument.
- This contract must be given an allowance of provided amount of tokens as well in order to swap them.

- Users can interact with the withdrawETH() function to withdraw the amount of eth stored for them in this contract.
- This function takes the amount of wei to withdraw as argument.

### Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case.

```shell
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```
