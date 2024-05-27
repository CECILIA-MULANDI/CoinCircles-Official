import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Button from 'react-bootstrap/Button';
import { connectUser, disconnectWallet } from '../CallContractFunctions/CallContract';

export default function ConnectWallet() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize ethers
  const initializeEthers = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' }); // Request account access
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log("Ethereum enabled");
        return provider;
      } catch (error) {
        console.error("User denied account access");
        setError('User denied account access');
      }
    } else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      setError('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  };

  useEffect(() => {
    const setupEthers = async () => {
      const providerInstance = await initializeEthers();
      if (providerInstance) {
        setProvider(providerInstance);
      }
    };

    setupEthers();
  }, []);

  return (
    <>
      {walletAddress ? (
        <>
          <h3>Address: {walletAddress.substring(0, 5)}...</h3>
          {isConnected ? (
            <Button className="connect-btn" onClick={() => disconnectWallet(setWalletAddress)}>Disconnect</Button>
          ) : (
            <Button
              className="connect-btn"
              onClick={() => connectUser(setWalletAddress, setIsConnected, setContract, setProvider, setError)}
            >
              Connect
            </Button>
          )}
        </>
      ) : (
        <Button
          className="connect-btn"
          onClick={() => connectUser(setWalletAddress, setIsConnected, setContract, setProvider, setError)}
        >
          Connect
        </Button>
      )}
      {error && <p>{error}</p>}
    </>
  );
}
