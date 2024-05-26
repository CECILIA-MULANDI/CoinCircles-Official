const hre = require("hardhat");

async function main() {
    try {
        // Get the ContractFactory of your SimpleContract
        const SimpleContract = await hre.ethers.getContractFactory("CoinCircles");

        // Deploy the contract
        const contract = await SimpleContract.deploy();

        // Wait for the deployment transaction to be mined
        // await contract.deployed();
        const address = await contract.getAddress()
        console.log(`Coincircles deployed at: ${address}`);


    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

main();