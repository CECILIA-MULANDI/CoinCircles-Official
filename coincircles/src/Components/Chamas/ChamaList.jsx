import React, { useState, useEffect } from 'react';
import { getAllChamas,addMemberToPrivateChama,joinChama,contributeFunds } from '../CallContractFunctions/CallContract';
import { ethers } from 'ethers';



const ChamaList = () => {
    const [chamas, setChamas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userAddress, setUserAddress] = useState(null);
  
    useEffect(() => {
      const fetchChamas = async () => {
        try {
          console.log('Fetching chamas...');
          const chamaDetails = await getAllChamas();
          console.log('Chamas fetched:', chamaDetails);
          setChamas(chamaDetails);
  
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setUserAddress(address);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchChamas();
    }, []);
  
    const handleJoinChama = async (chamaName) => {
      try {
        await joinChama(chamaName);
        // Optionally, you can refresh the chama list after joining
      } catch (error) {
        setError(error.message);
      }
    };
  
    const handleAddMemberToPrivateChama = async (chamaName, newMember) => {
      try {
        await addMemberToPrivateChama(chamaName, newMember);
        // Optionally, you can refresh the chama list after adding a member
      } catch (error) {
        setError(error.message);
      }
    };
  
    const handleContributeFunds = async (chamaName, amount) => {
      try {
        await contributeFunds(chamaName, amount);
        // Optionally, you can refresh the chama list after contributing funds
      } catch (error) {
        setError(error.message);
      }
    };
  
    const isMember = (chama, userAddress) => {
      return chama.listOfMembers.includes(userAddress);
    };
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>Error: {error}</div>;
    }
  
    return (
      <div>
        <h2>Chama List</h2>
        {chamas.length === 0 ? (
          <p>No chamas found.</p>
        ) : (
          <ul>
            {chamas.map((chama, index) => (
              <li key={index}>
                <h3>{chama.name}</h3>
                <p>Max Members: {chama.maxNoOfPeople.toString()}</p>
                <p>Visibility: {chama.visibility === 0 ? 'Public' : 'Private'}</p>
                <p>Owner: {chama.owner}</p>
                <p>Target Amount per Round: {ethers.utils.formatEther(chama.targetAmountPerRound.toString())} ETH</p>
                <p>Total Contribution: {ethers.utils.formatEther(chama.totalContribution.toString())} ETH</p>
                <p>Number of Rounds: {chama.numberOfRounds.toString()}</p>
                <p>Minimum Members: {chama.minimumNoOfPeople.toString()}</p>
                <p>Has Contribution Started: {chama.hasContributionStarted ? 'Yes' : 'No'}</p>
                <p>Current Round: {chama.currentRound.toString()}</p>
                {!isMember(chama, userAddress) && (
                  <>
                    {chama.visibility === 0 ? (
                      <button onClick={() => handleJoinChama(chama.name)}>Join Chama</button>
                    ) : (
                      <button onClick={() => handleAddMemberToPrivateChama(chama.name, userAddress)}>
                        Add Me to Private Chama
                      </button>
                    )}
                  </>
                )}
                {isMember(chama, userAddress) && !chama.hasContributionStarted && (
                  <button onClick={() => handleContributeFunds(chama.name, chama.targetAmountPerRound.toString())}>
                    Contribute Funds
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
  
  export default ChamaList;