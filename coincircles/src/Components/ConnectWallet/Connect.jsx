import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Button from 'react-bootstrap/Button';
import { ContractAddress } from '../Constants/Constants';
import ContractAbi from "../../artifacts/contracts/Lock.sol/CoinCircles.json"
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
        const provider = new ethers.BrowserProvider(window.ethereum);
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
        const signer = providerInstance.getSigner();
        const contract = new ethers.Contract(
          ContractAddress,
          ContractAbi.abi,
          signer
        );
        setContract(contract);
      }
    };

    setupEthers();
  }, []);

  const connectUser = async () => {
    try {
      const accounts = await provider.listAccounts();
      const connected = await contract.users(accounts[0]);
      if (connected.isConnected) {
        setIsConnected(true);
        setWalletAddress(accounts[0]);
      } else {
        const tx = await contract.connect_user();
        await tx.wait();
        setWalletAddress(accounts[0]);
        setIsConnected(true);
      }
    } catch (err) {
      setError('Error connecting to wallet');
      console.error(err);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setIsConnected(false);
  };

  return (
    <>
      {walletAddress ? (
        <>
          <h3>Address: {walletAddress.substring(0, 5)}...</h3>
          {isConnected ? (
            <Button className="connect-btn" onClick={disconnectWallet}>Disconnect</Button>
          ) : (
            <Button
              className="connect-btn"
              onClick={connectUser}
            >
              Connect
            </Button>
          )}
        </>
      ) : (
        <Button
          className="connect-btn"
          onClick={connectUser}
        >
          Connect
        </Button>
      )}
      {error && <p>{error}</p>}
    </>
  );
}
