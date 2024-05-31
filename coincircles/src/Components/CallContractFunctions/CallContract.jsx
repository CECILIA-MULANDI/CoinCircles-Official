import ContractAbi from "../../artifacts/contracts/Lock.sol/CoinCircles.json";
import { ContractAddress } from "../Constants/Constants";
import { ethers } from "ethers";



export const connectUser = async (setWalletAddress, setProvider, setError) => {
  if (window.ethereum) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      // Store the connection details in local storage
      localStorage.setItem('walletAddress', address);
      setWalletAddress(address);
      setProvider(provider);
      setError(null);

      return { provider, signer, address };
    } catch (error) {
      console.error("Failed to connect wallet", error);
      setError("Failed to connect wallet");
    }
  } else {
    setError("MetaMask is not installed");
  }
};

export const disconnectWallet = (setWalletAddress) => {
  localStorage.removeItem('walletAddress');
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

      const receipt = await tx.wait();
      const event = receipt.events.find(event => event.event === 'ChamaCreated');
      if (event) {
        return { success: `Chama "${event.args[1]}" created successfully with ID: ${event.args[0].toNumber()}!` };
      } else {
        throw new Error('Chama creation event not found. Please check the transaction status.');
      }
    } catch (error) {
      let errorMessage;
      if (error.message.includes('A chama with this name already exists')) {
        errorMessage = 'A chama with the provided name already exists. Please choose a different name.';
      } else if (error.message.includes('User is not connected')) {
        errorMessage = 'You must connect your wallet before creating a chama.';
      } else if (error.message.includes('Chama should have at least two members')) {
        errorMessage = 'The maximum number of members should be at least 2.';
      } else if (error.message.includes('The length of the name should not be empty')) {
        errorMessage = 'The chama name cannot be empty.';
      } else if (error.message.includes('Maximum number of people should be greater than or equal to the minimum')) {
        errorMessage = 'Maximum number of people should be greater than or equal to the minimum.';
      } else {
        errorMessage = 'An unexpected error occurred. Please try again later.';
      }
      return { error: errorMessage };
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



 
  export const addMemberToPrivateChama = async (chamaName, newMember) => {
    try {
      const contract = await connectToContract();
      const tx = await contract.add_members_to_privatechama(chamaName, newMember);
      await tx.wait();
    } catch (error) {
      console.error('Error adding member to private chama:', error);
      throw error;
    }
  };
  
  export const joinChama = async (chamaName) => {
    try {
      const contract = await connectToContract();
      const tx = await contract.join_chama(chamaName);
      await tx.wait();
    } catch (error) {
      console.error('Error joining chama:', error);
      throw error;
    }
  };
  
  // export const contributeFunds = async (chamaName, amount) => {
  //   try {
  //     const contract = await connectToContract();
  //     const tx = await contract.contributeFunds(chamaName, amount);
  //     await tx.wait();
  //   } catch (error) {
  //     console.error('Error contributing funds:', error);
  //     throw error;
  //   }
  // };
  export const contributeFunds = async (chamaData) => {
    try {
      const contract = await connectToContract();
      const tx = await contract.contributeFunds(chamaData);
      await tx.wait();
    } catch (error) {
      console.error('Error contributing funds:', error);
      throw error;
    }
  };
  
  export const isMinimumNumberOfPeopleReached = async (chamaName) => {
    try {
      const contract = await connectToContract();
      const isMinimumReached = await contract.isMinimumNumberOfPeopleReached(chamaName);
      return isMinimumReached;
    } catch (error) {
      console.error('Error checking minimum number of people:', error);
      throw error;
    }
  };
  
  export const getContributionAmount = async (chamaName) => {
    try {
      const contract = await connectToContract();
      const contributionAmount = await contract.getContributionAmount(chamaName);
      return contributionAmount;
    } catch (error) {
      console.error('Error getting contribution amount:', error);
      throw error;
    }
  };

export const getChamaId = async (chamaName) => {
  try {
      const contract = await connectToContract();
      const chamaId = await contract.getChamaId(chamaName);
      return chamaId;
  } catch (error) {
      console.error('Error getting chama ID:', error);
      throw error;
  }
};

