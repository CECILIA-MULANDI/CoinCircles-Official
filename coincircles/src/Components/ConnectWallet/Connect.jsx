// import { ethers } from 'ethers';
import {  useState,useEffect } from 'react';
import Button from "react-bootstrap/Button";

import ContractAbi from "../../artifacts/contracts/Lock.sol/CoinCircles.json";
import { connectUser } from '../CallContractFunctions/CallContract';
import { ethers } from 'ethers';
import { disconnectWallet } from '../CallContractFunctions/CallContract';
const ContractAddress='0xAfFd205a78DD861128e9e8Ca1191aaBb9dbfD6CB'
export default function ConnectWallet() {
  const [walletAddress,setWalletAddress] = useState(null);
  const [error, setError] = useState(null);
  
  const [provider,setProvider]=useState(null);
  // eslint-disable-next-line no-unused-vars
  const [contract,setContract]=useState(null);
  
  const [isConnected, setIsConnected] = useState(false);
  

  useEffect(() => {
    async function checkConnection() {
      if (provider && walletAddress) {
        try {
          const contract = new ethers.Contract(ContractAddress, ContractAbi, provider);
          const filter = contract.filters.UserConnected(walletAddress);
          const events = await contract.queryFilter(filter);
          if (events.length > 0) {
            setIsConnected(true);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
          setError('Error checking connection');
        }
      }
    }

    checkConnection();
  }, [provider, walletAddress]);



 

  return (
    <>
  {walletAddress ? (
      <>
        <h3>Address: {walletAddress.substring(0, 5)}</h3>
        {isConnected ? (
          <Button className="connect-btn" onClick={()=>disconnectWallet(setWalletAddress)}>Disconnect</Button>
        ) : (
          <Button className="connect-btn" onClick={() => connectUser(setWalletAddress, setIsConnected, setContract, setProvider,setError)} >Connect</Button>
        )}
      </>
    ) : (
      <Button className="connect-btn" onClick={() => connectUser(setWalletAddress, setIsConnected, setContract, setProvider,setError)}>Connect</Button>
    )}
    {error && <p>{error}</p>}
    </>
  );
}
