import Web3 from 'web3';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { connectUser, disconnectWallet } from '../CallContractFunctions/CallContract';

export default function ConnectWallet() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize Web3
  const initializeWeb3 = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable(); // Request account access
        console.log("Ethereum enabled");
        return web3;
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
    const setupWeb3 = async () => {
      const web3Instance = await initializeWeb3();
      if (web3Instance) {
        setProvider(web3Instance);
      }
    };

    setupWeb3();
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
