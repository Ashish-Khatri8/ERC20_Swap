const { ethers } = require("hardhat");

async function main() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the BlazeToken contract.
    const BlazeToken = await ethers.getContractFactory("BlazeToken");
    const blazeToken = await BlazeToken.deploy(
        "BlazeK",
        "BLZ"
    );
    await blazeToken.deployed();
    console.log("BlazeToken deployed at: ", blazeToken.address);

    // Deploy the Swap contract.
    const Swap = await ethers.getContractFactory("Swap");
    const swap = await Swap.deploy(blazeToken.address);
    await swap.deployed();
    console.log("Swap contract deployed at: ", swap.address);
    

    // Mint BlazeTokens to owner, add1, addr2.
    await blazeToken.mint(owner.address, ethers.utils.parseUnits("10", 7));
    await blazeToken.mint(addr1.address, ethers.utils.parseUnits("10", 7));
    await blazeToken.mint(addr2.address, ethers.utils.parseUnits("10", 7));
    console.log("BlazeTokens minted to all addresses.");

    // Give Swap token allowance for BlazeTokens from owner, add1, add2.
    await blazeToken.connect(owner).approve(swap.address, ethers.utils.parseUnits("10", 25));
    await blazeToken.connect(addr1).approve(swap.address, ethers.utils.parseUnits("10", 25));
    await blazeToken.connect(addr2).approve(swap.address, ethers.utils.parseUnits("10", 25));
    console.log("Allowance for BlazeTokens given to Swap contract by all addresses.");

    // Call the addLiquidityToPool() fnc to create the pair.
    await swap.connect(owner).addLiquidityToPool(ethers.utils.parseUnits("10", 25), {value: ethers.utils.parseEther("10.0")});
    console.log("Pool created successfully and liquidity added!");
    
    // Swap BlazeTokens for eth from add1 and addr2.
    await swap.connect(addr1).swapBLZ(ethers.utils.parseUnits("10", 22));
    await swap.connect(addr2).swapBLZ(ethers.utils.parseUnits("10", 21));
    await swap.connect(addr1).swapBLZ(ethers.utils.parseUnits("50", 20));
    await swap.connect(addr2).swapBLZ(ethers.utils.parseUnits("90", 21));
    console.log("BlazeTokens swapped for Eth successfully!");

    // Withdraw all stored tokens for addr1.
    await swap.connect(addr1).withdrawETH(await swap.weiStored(addr1.address));
    console.log("Swapped eth withdrawn successfully from the contract!");
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error);
        process.exit(1);
    });
