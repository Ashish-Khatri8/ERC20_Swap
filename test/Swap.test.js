const { inputToConfig } = require("@ethereum-waffle/compiler");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Swap", () => {
    let owner;
    let addr1;
    let addr2;

    let BlazeToken;
    let blazeToken;

    let Swap;
    let swap;

    beforeEach(async () => {
        // Get the addresses.
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploy the BlazeToken contract.
        BlazeToken = await ethers.getContractFactory("BlazeToken");
        blazeToken = await BlazeToken.deploy("BlazeK", "BLZ");
        await blazeToken.deployed();

        // Deploy the Swap contract.
        Swap = await ethers.getContractFactory("Swap");
        swap = await Swap.deploy(blazeToken.address);
        await swap.deployed();

        // Mint BlazeTokens to owner, add1, addr2.
        await blazeToken.mint(owner.address, ethers.utils.parseUnits("10", 7));
        await blazeToken.mint(addr1.address, ethers.utils.parseUnits("10", 7));
        await blazeToken.mint(addr2.address, ethers.utils.parseUnits("10", 7));

        // Give Swap token allowance for BlazeTokens from owner, add1, add2.
        await blazeToken.connect(owner).approve(swap.address, ethers.utils.parseUnits("10", 7));
        await blazeToken.connect(addr1).approve(swap.address, ethers.utils.parseUnits("10", 7));
        await blazeToken.connect(addr2).approve(swap.address, ethers.utils.parseUnits("10", 7));

        // Call addLiquidityToPool function to create the pool and add the initial liquidity.
        await swap.connect(owner).addLiquidityToPool(ethers.utils.parseUnits("10", 7), {value: ethers.utils.parseEther("10.0")});
    });

    it("Swapped eth for user's BlazeTokens gets stored in the contract.", async () => {
        const weiStoredBefore = await swap.weiStored(addr1.address);
        await swap.connect(addr1).swapBLZ(ethers.utils.parseUnits("10", 5));
        const weiStoredAfter = await swap.weiStored(addr1.address);
        expect(weiStoredAfter).to.be.not.equal(weiStoredBefore);
    });

    it("Users can claim their swapped eth from contract.", async () => {
        // Swap BlazeTokens for ether.
        await swap.connect(addr1).swapBLZ(ethers.utils.parseUnits("10", 5));
        // Get ether stored in contract after swap.
        const weiStoredBefore = await swap.weiStored(addr1.address);

        // Claim the stored ether.
        await swap.connect(addr1).withdrawETH(await swap.weiStored(addr1.address));
        // Check the eth stored in contract after claiming all eth.
        const weiStoredAfter = await swap.weiStored(addr1.address);
        
        expect(weiStoredBefore).to.be.not.equal(0);
        expect(weiStoredAfter).to.be.equal(0);
    });



});
