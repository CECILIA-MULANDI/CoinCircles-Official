import { useState, useEffect } from 'react';
import Button from "react-bootstrap/Button";
import { useNavigate } from 'react-router-dom';
import { ContractAddress } from "../Constants/Constants";
import ContractAbi from "../../artifacts/contracts/Lock.sol/CoinCircles.json";
import { connectUser } from '../CallContractFunctions/CallContract';
import { ethers } from 'ethers';
import { disconnectWallet } from '../CallContractFunctions/CallContract';

export default function ConnectWallet() {
  const [walletAddress, setWalletAddress] = useState(localStorage.getItem('walletAddress'));
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isConnected, setIsConnected] = useState(!!walletAddress);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkConnection() {
      if (walletAddress) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract(ContractAddress, ContractAbi, provider);
  
          // Check if the wallet address is connected
          const isConnected = await contract.users(walletAddress).isConnected;
  
          setProvider(provider);
          setIsConnected(isConnected);
        } catch (error) {
          console.error('Error checking connection:', error);
          setError('Error checking connection');
        }
      }
    }
  
    checkConnection();
  }, [walletAddress]);

  useEffect(() => {
    if (isConnected) {
      navigate('/availableChamas');
    }
  }, [isConnected, navigate]);

  const handleConnect = async () => {
    try {
      const { address, provider, signer } = await connectUser(setWalletAddress, setProvider, setError);
      setWalletAddress(address);
      setProvider(provider);
  
      // Create an instance of the contract
      const contract = new ethers.Contract(ContractAddress, ContractAbi, signer);
  
      // Call the connect_user function
      const tx = await contract.connect_user();
      await tx.wait();
  
      setIsConnected(true);
      localStorage.setItem('walletAddress', address);
  
      console.log('Wallet connected successfully');
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