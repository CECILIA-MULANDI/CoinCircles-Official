import ContractAbi from "../../artifacts/contracts/Lock.sol/CoinCircles.json";
import { ContractAddress } from "../Constants/Constants";
import { ethers } from "ethers";

export const connectUser = async (
  setWalletAddress,
  setIsConnected,
  setContract,
  setProvider,
  setError
) => {
  if (window.ethereum) {
    try {
      let accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected account:", accounts[0]);

      let web3provider = await new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3provider);

      const contract = await new ethers.Contract(
        ContractAddress,
        ContractAbi,
        web3provider.getSigner(accounts[0])
      );
      setContract(contract);

      // CHECK IF USER IS CONNECTED
      const userDetails = await contract.users(accounts[0]);
      console.log("User details:", userDetails);

      if (userDetails.isConnected) {
        console.log("User is already connected");
        setIsConnected(true);
        setWalletAddress(accounts[0]);
      } else {
        // User is not connected, proceed with connection
        const tx = await contract.connect_user();
        await tx.wait();
        setWalletAddress(accounts[0]);
        setIsConnected(true);
      }
    } catch (err) {
      console.error("Error connecting to wallet:", err);
      setError(`Error connecting to wallet: ${err.reason || err.message}`);
    }
  } else {
    setError("Please install Metamask");
    console.log("Please install Metamask");
  }
};

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

