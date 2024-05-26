/** @type import('hardhat/config').HardhatUserConfig */
require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");

const { ALCHEMY_API_URL, PRIVATE_KEY } = process.env;
module.exports = {
    solidity: "0.8.19",
    paths: {
        // now this is where the contract abi will be
        artifacts: './src/artifacts'

    },
    networks: {

        hardhat: {

        },
        sepolia: {
            url: ALCHEMY_API_URL,
            accounts: [`0x${PRIVATE_KEY}`]
        }



    }
};