import { ethers } from 'ethers';
import ContractAbi from "../../artifacts/contracts/Lock.sol/CoinCircles.json";
import { ContractAddress } from "../Constants/Constants";

export const connectUser = async (setWalletAddress, setIsConnected, setContract, setProvider, setError) => {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.BrowserProvider(window.ethereum);
            setProvider(provider);
            const contract = new ethers.Contract(ContractAddress, ContractAbi.abi, provider.getSigner());
            setContract(contract);
            const accounts = await provider.listAccounts();
            const connected = await contract.users(accounts[0]);
            if (connected.isConnected) {
                setIsConnected(true);
                setWalletAddress(accounts[0]);
            } else {
                const tx = await contract.connect_user();
                await tx.wait();
                setWalletAddress(accounts[0]);
                setIsConnected(true);
            }
        } catch (err) {
            setError('Error connecting to wallet');
            console.error(err);
        }
    } else {
        setError('Please install MetaMask');
        console.log('Please install MetaMask');
    }
};

export const disconnectWallet = (setWalletAddress) => {
    setWalletAddress(null);
};

export const CreateChamas = async (_name, _maxNoOfPeople, _visibility, _minimumNoOfPeople, _targetAmountPerRound, setSuccessMessage, setErrorMessage) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    try {
        const signer = provider.getSigner();
        const contract = new ethers.Contract(ContractAddress, ContractAbi.abi, signer);
        const tx = await contract.create_chama(_name, _maxNoOfPeople, _visibility, _minimumNoOfPeople, _targetAmountPerRound);
        await tx.wait();
        setSuccessMessage(`Chama ${_name} created successfully`);
    } catch (error) {
        console.error(error);
        setErrorMessage('Error creating chama. Please try again.');
    }
};

// Functions for join, contribute, vote, and get all chamas remain the same

export const joinChama = async (_name, setSuccessMessage, setErrorMessage) => {
    // Same as before
};

export const contributeFunds = async (_name, _amount, setSuccessMessage, setErrorMessage) => {
    // Same as before
};

export const voteForRecipient = async (_name, _recipient, setSuccessMessage, setErrorMessage) => {
    // Same as before
};

export const getAllChamas = async (setChamas, setErrorMessage) => {
    // Same as before
};
