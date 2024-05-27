
import ContractAbi from "../../artifacts/contracts/Lock.sol/CoinCircles.json"
import { ContractAddress } from "../Constants/Constants"
import { ethers } from "ethers"

export const connectUser=async(setWalletAddress,setIsConnected,setContract,setProvider,setError)=>{
    
    if(window.ethereum){
        try{
            let accounts=await window.ethereum.request({method:'eth_requestAccounts'});
            let web3provider=  await new ethers.providers.Web3Provider(window.ethereum);
        
            setProvider(web3provider);
            const contract= await new ethers.Contract(ContractAddress,ContractAbi,web3provider.getSigner(accounts[0]));
            setContract(contract);
            console.log(contract);
            
            // CHECK IF USER IS CONNECTED **
            const connected=await contract.users(accounts[0]);
            console.log(connected)
            if(connected.isConnected){
                setIsConnected(true)
                setWalletAddress(accounts[0]);
             
    
            }else{
                const tx = await contract.connect_user();
                await tx.wait();
                setWalletAddress(accounts[0]);
                setIsConnected(true);
        
            }
            
            // setError(null);

        }catch(err){
            // throw new Error('Error Connecting to wallet')
            setError('Error connecting to wallet');
            // console.error(err);
            console.log(err)

        }
        }
    else{
        setError('Please install Metamask');
        console.log('Please install Metamask')
    }

}
export const disconnectWallet=(setWalletAddress)=>{
    setWalletAddress(null)
}

export const CreateChamas=async(_name,_purpose,_maxNoPeople,_minDeposit,_visibility,setSuccessMessage)=>{
    // get provider
    const provider=new ethers.providers.Web3Provider(window.ethereum);
    let signer=provider.getSigner();
// create an instance of the contract
    let contract = new ethers.Contract(ContractAddress,ContractAbi.abi,signer);
    console.log(signer);
    try{

        const tx=await contract.create_chama(_name,_purpose,_maxNoPeople,_minDeposit,_visibility);
        tx.wait();
        // listen to events
        contract.once('ChamaCreated',(chamaId,name)=>{
            setSuccessMessage(`Chama ${name} created successfully with ID ${chamaId}`);

        })
        console.log('Chama created successfully');
    }catch(e){
        console.log(e)
        
    }
    
 
   

}
