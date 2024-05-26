import {  useState } from 'react';
import Button from "react-bootstrap/Button";
// import { connectUser } from '../CallContractFunctions/CallContract';
import { connectUser } from '../CallContractFunctions/CallContract';
// import "./Connect.css"
import { disconnectWallet } from '../CallContractFunctions/CallContract';
export default function ConnectWallet() {
  const [walletAddress,setWalletAddress] = useState(null);
  const [error, setError] = useState(null);
  
  const [provider,setProvider]=useState(null);
  // eslint-disable-next-line no-unused-vars
  const [contract,setContract]=useState(null);
  
  const [isConnected, setIsConnected] = useState(false);



 

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
