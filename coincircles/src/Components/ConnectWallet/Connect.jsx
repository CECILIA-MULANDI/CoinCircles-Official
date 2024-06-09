import { useState, useEffect } from 'react';
import Button from "react-bootstrap/Button";
import { useNavigate } from 'react-router-dom';
// import { ContractAddress } from "../Constants/Constants";
import ContractAbi from "../../artifacts/contracts/Lock.sol/CoinCircles.json";
import { connectUser } from '../CallContractFunctions/CallContract';
import { ethers } from 'ethers';
import { disconnectWallet } from '../CallContractFunctions/CallContract';
const contractAddress = '0xf7C728CED9D6a68E8e08f0aF136A34Cf617130B6';
export default function ConnectWallet() {
  const [walletAddress, setWalletAddress] = useState(localStorage.getItem('walletAddress'));
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("isConnected changed:", isConnected);
    console.log("window.location.pathname:", window.location.pathname);
  
    if (isConnected && window.location.pathname !== '/availableChamas') {
      navigate('/availableChamas');
    } else {
      console.log("Cannot redirect");
    }
  }, [isConnected, navigate]);


  const handleConnect = async () => {
    try {
      const result = await connectUser(setWalletAddress, setProvider, setError);
  
      if (result && result.address && result.provider && result.signer) {
        const { address, provider, signer } = result;
        setWalletAddress(address);
        setProvider(provider);
  
        // Create an instance of the contract
        const contract = new ethers.Contract(contractAddress, ContractAbi, signer);
  
        try {
          // Call the connect_user function
          const tx = await contract.connect_user();
          await tx.wait();
  
          // Set isConnected to true after a successful connection
          setIsConnected(true);
          localStorage.setItem('walletAddress', address);
        } catch (error) {
          if (error.message.includes('User is already connected')) {
            // User is already connected, set isConnected to true
            setIsConnected(true);
            localStorage.setItem('walletAddress', address);
          } else {
            // Handle other contract errors
            console.error('Contract error:', error);
            setError('Error connecting wallet: ' + error.message);
          }
        }
      } else {
        console.error('connectUser function returned invalid result:', result);
        setError('Error connecting wallet');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError('Error connecting wallet');
    }
  };



 

  

  const handleDisconnect = () => {
    disconnectWallet(setWalletAddress);
    setWalletAddress(null);
    setProvider(null);
    setIsConnected(false);
    localStorage.removeItem('walletAddress');
  };

  return (
    <>
      {walletAddress ? (
        <>
          <h3>Address: {walletAddress.substring(0, 5)}...</h3>
          <Button className="connect-btn" onClick={handleDisconnect}>Disconnect</Button>
        </>
      ) : (
        <Button className="connect-btn" onClick={handleConnect}>Connect</Button>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </>
  );
}