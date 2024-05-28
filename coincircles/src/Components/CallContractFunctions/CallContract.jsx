import ContractAbi from "../../artifacts/contracts/Lock.sol/CoinCircles.json";
import { ContractAddress } from "../Constants/Constants";
import { ethers } from "ethers";



async function connectUser(setWalletAddress, setProvider, setError) {
  try {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
      // Request account access if needed
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Get the provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      
      // Get the user's address
      const accounts = await provider.listAccounts();
      const walletAddress = accounts[0];
      setWalletAddress(walletAddress);
    } else {
      throw new Error('MetaMask extension not detected');
    }
  } catch (error) {
    console.error('Error connecting to wallet:', error);
    setError('Error connecting to wallet');
  }
}

export { connectUser };

export const disconnectWallet = (setWalletAddress) => {
  setWalletAddress(null);
};
export const connectToContract = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(ContractAddress, ContractAbi, signer);
      return contract;
    } catch (error) {
      console.error('Error connecting to contract:', error);
      throw error;
    }
};


// Function to create a chama
export const createChama = async (chamaName, maxMembers, chamaVisibility, minimumMembers, targetAmount) => {
    try {
      const contract = await connectToContract();
      const visibilityValue = chamaVisibility === 'Public' ? 0 : 1;
      const tx = await contract.create_chama(
        chamaName,
        maxMembers,
        visibilityValue,
        minimumMembers,
        ethers.utils.parseEther(targetAmount)
      );
      await tx.wait();
      console.log('Chama created successfully!');
    } catch (error) {
      if (error.message.includes('A chama with this name already exists')) {
        throw new Error('A chama with the provided name already exists. Please choose a different name.');
      } else if (error.message.includes('User is not connected')) {
        throw new Error('You must connect your wallet before creating a chama.');
      } else if (error.message.includes('Chama should have at least two members')) {
        throw new Error('The maximum number of members should be at least 2.');
      } else if (error.message.includes('The length of the name should not be empty')) {
        throw new Error('The chama name cannot be empty.');
      } else {
        console.error('Error creating chama:', error);
        throw error;
      }
    }
  };




 export const getAllChamas = async () => {
    try {
      const contract = await connectToContract();
      const chamaDetails = await contract.getAllChamas();
      return chamaDetails;
    } catch (error) {
      console.error('Error getting chama details:', error);
      throw error;
    }
  };



 

export const joinChama = async (chamaName) => {
  try {
    const contract = await connectToContract();
    const tx = await contract.join_chama(chamaName);
    await tx.wait();
    console.log(`Joined chama ${chamaName} successfully!`);
  } catch (error) {
    console.error('Error joining chama:', error);
    throw error;
  }
};

export const addMemberToPrivateChama = async (chamaName, newMember) => {
  try {
    const contract = await connectToContract();
    const tx = await contract.add_members_to_privatechama(chamaName, newMember);
    await tx.wait();
    console.log(`Added ${newMember} to private chama ${chamaName} successfully!`);
  } catch (error) {
    console.error('Error adding member to private chama:', error);
    throw error;
  }
};

export const contributeFunds = async (chamaName, amount) => {
  try {
    const contract = await connectToContract();
    const amountInWei = ethers.utils.parseEther(amount.toString());
    const tx = await contract.contributeFunds(chamaName, { value: amountInWei });
    await tx.wait();
    console.log(`Contributed ${amount} ETH to chama ${chamaName} successfully!`);
  } catch (error) {
    console.error('Error contributing funds:', error);
    throw error;
  }
};

