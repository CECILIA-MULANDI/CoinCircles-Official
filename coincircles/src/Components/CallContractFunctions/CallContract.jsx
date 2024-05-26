// CallContractFunctions/CallContract.js

import Web3 from 'web3';
import ContractAbi from "../../artifacts/contracts/Lock.sol/CoinCircles.json";
import { ContractAddress } from "../Constants/Constants";

let web3;

if (window.ethereum) {
    web3 = new Web3(window.ethereum);
} else {
    console.error('Please install MetaMask');
}

export const connectUser = async (setWalletAddress, setIsConnected, setContract, setProvider, setError, provider) => {
    if (provider) {
        try {
            console.log("Provider detected, requesting accounts...");
            const accounts = await provider.eth.requestAccounts();
            console.log("Accounts:", accounts);
            setProvider(provider);

            const contract = new provider.eth.Contract(ContractAbi.abi, ContractAddress);
            setContract(contract);

            const connected = await contract.methods.users(accounts[0]).call();
            console.log("User connected status:", connected);
            if (connected.isConnected) {
                setIsConnected(true);
                setWalletAddress(accounts[0]);
            } else {
                console.log("User not connected, sending transaction to connect...");
                const tx = await contract.methods.connect_user().send({ from: accounts[0] });
                console.log("Transaction:", tx);
                setWalletAddress(accounts[0]);
                setIsConnected(true);
            }
        } catch (err) {
            setError('Error connecting to wallet');
            console.log("Error connecting to wallet:", err);
        }
    } else {
        setError('Please install MetaMask');
        console.log('Please install MetaMask');
    }
};



export const disconnectWallet = (setWalletAddress) => {
    setWalletAddress(null);
};

export const CreateChamas = async (_name, _purpose, _maxNoPeople, _minDeposit, _visibility, setSuccessMessage) => {
    if (web3) {
        const accounts = await web3.eth.getAccounts();
        const contract = new web3.eth.Contract(ContractAbi.abi, ContractAddress);

        try {
            const tx = await contract.methods.create_chama(_name, _maxNoPeople, _visibility, _minDeposit).send({ from: accounts[0] });
            contract.once('ChamaCreated', (chamaId, name) => {
                setSuccessMessage(`Chama ${name} created successfully with ID ${chamaId}`);
            });
            console.log('Chama created successfully');
        } catch (e) {
            console.log(e);
        }
    }
};

export const joinChama = async (_name, setSuccessMessage, setErrorMessage) => {
    if (web3) {
        const accounts = await web3.eth.getAccounts();
        const contract = new web3.eth.Contract(ContractAbi.abi, ContractAddress);

        try {
            const tx = await contract.methods.join_chama(_name).send({ from: accounts[0] });
            contract.once('UserJoinedChama', (name, user_address) => {
                setSuccessMessage(`User ${user_address} joined Chama ${name}`);
            });
            console.log('User joined Chama successfully');
        } catch (e) {
            setErrorMessage('Error joining Chama');
            console.log(e);
        }
    }
};

export const contributeFunds = async (_name, _amount, setSuccessMessage, setErrorMessage) => {
    if (web3) {
        const accounts = await web3.eth.getAccounts();
        const contract = new web3.eth.Contract(ContractAbi.abi, ContractAddress);

        try {
            const tx = await contract.methods.contributeFunds(_name).send({ from: accounts[0], value: web3.utils.toWei(_amount, 'ether') });
            contract.once('ContributionMade', (name, user_address, amount) => {
                setSuccessMessage(`Contribution of ${amount} made by ${user_address} to Chama ${name}`);
            });
            console.log('Contribution made successfully');
        } catch (e) {
            setErrorMessage('Error contributing funds');
            console.log(e);
        }
    }
};

export const voteForRecipient = async (_name, _recipient, setSuccessMessage, setErrorMessage) => {
    if (web3) {
        const accounts = await web3.eth.getAccounts();
        const contract = new web3.eth.Contract(ContractAbi.abi, ContractAddress);

        try {
            const tx = await contract.methods.voteForRecipient(_name, _recipient).send({ from: accounts[0] });
            contract.once('VoteCast', (name, voter, recipient) => {
                setSuccessMessage(`Vote cast by ${voter} for ${recipient} in Chama ${name}`);
            });
            console.log('Vote cast successfully');
        } catch (e) {
            setErrorMessage('Error voting for recipient');
            console.log(e);
        }
    }
};

export const getAllChamas = async (setChamas, setErrorMessage) => {
    if (web3) {
        const accounts = await web3.eth.getAccounts();
        const contract = new web3.eth.Contract(ContractAbi.abi, ContractAddress);

        try {
            const chamas = await contract.methods.getAllChamas().call({ from: accounts[0] });
            setChamas(chamas);
            console.log('Chamas retrieved successfully');
        } catch (e) {
            setErrorMessage('Error retrieving Chamas');
            console.log(e);
        }
    }
};
