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
      console.error('Error creating chama:', error);
      throw error;
    }
  };


// export const CreateChamas=async(_name,_purpose,_maxNoPeople,_minDeposit,_visibility,setSuccessMessage)=>{
//     // get provider
//     const provider=new ethers.providers.Web3Provider(window.ethereum);
//     let signer=provider.getSigner();
// // create an instance of the contract
//     let contract = new ethers.Contract(ContractAddress,ContractAbi.abi,signer);
//     console.log(signer);
//     try{

//         const tx=await contract.create_chama(_name,_purpose,_maxNoPeople,_minDeposit,_visibility);
//         tx.wait();
//         // listen to events
//         contract.once('ChamaCreated',(chamaId,name)=>{
//             setSuccessMessage(`Chama ${name} created successfully with ID ${chamaId}`);

//         })
//         console.log('Chama created successfully');
//     }catch(e){
//         console.log(e)
        
//     }
    
 
   

// }
