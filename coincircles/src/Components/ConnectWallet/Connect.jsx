import { useState } from 'react';
import Button from "react-bootstrap/Button";
import { connectUser, disconnectWallet } from '../CallContractFunctions/ContractFunctions';
// import "./Connect.css";

export default function ConnectWallet() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  return (
    <>
      {walletAddress ? (
        <>
          <h3>Address: {walletAddress.substring(0, 5)}</h3>
          {isConnected ? (
            <Button className="connect-btn" onClick={() => disconnectWallet(setWalletAddress)}>Disconnect</Button>
          ) : (
            <Button className="connect-btn" onClick={() => connectUser(setWalletAddress, setIsConnected, setError)}>Connect</Button>
          )}
        </>
      ) : (
        <Button className="connect-btn" onClick={() => connectUser(setWalletAddress, setIsConnected, setError)}>Connect</Button>
      )}
      {error && <p>{error}</p>}
    </>
  );
}
