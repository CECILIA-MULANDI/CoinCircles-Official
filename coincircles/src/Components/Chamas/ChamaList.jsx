import React, { useState, useEffect } from 'react';
import { getAllChamas } from '../CallContractFunctions/CallContract';
import { ethers } from 'ethers';
const ChamaList = () => {
  const [chamas, setChamas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChamas = async () => {
      try {
        const chamaDetails = await getAllChamas();
        setChamas(chamaDetails);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChamas();
  }, []);

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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChamaList;