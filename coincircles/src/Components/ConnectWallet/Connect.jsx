import { useState, useEffect } from 'react';
import Button from "react-bootstrap/Button";
import { useNavigate } from 'react-router-dom';
import { ContractAddress } from "../Constants/Constants";
import ContractAbi from "../../artifacts/contracts/Lock.sol/CoinCircles.json";
import { connectUser } from '../CallContractFunctions/CallContract';
import { ethers } from 'ethers';
import { disconnectWallet } from '../CallContractFunctions/CallContract';

export default function ConnectWallet() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkConnection() {
      if (provider && walletAddress) {
        try {
          const contract = new ethers.Contract(ContractAddress, ContractAbi, provider);
          const events = await contract.queryFilter(contract.filters.UserConnected());
          const userEvents = events.filter(event => event.args.wallet_address === walletAddress);
          if (userEvents.length > 0) {
            // If user is connected, navigate to available chamas
            navigate('/availableChamas');
          }
        } catch (error) {
          console.error('Error checking connection:', error);
          setError('Error checking connection');
        }
      }
    }
    checkConnection();
  }, [provider, walletAddress, navigate]);

  return (
    <>
      {walletAddress ? (
        <>
          <h3>Address: {walletAddress.substring(0, 5)}</h3>
          <Button className="connect-btn" onClick={() => disconnectWallet(setWalletAddress)}>Disconnect</Button>
        </>
      ) : (
        <Button className="connect-btn" onClick={() => connectUser(setWalletAddress, setProvider, setError)}>Connect</Button>
      )}
      {error && <p>{error}</p>}
    </>
  );
}
