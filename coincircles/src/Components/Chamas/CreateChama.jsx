import React, { useState } from 'react';
import { createChama } from '../CallContractFunctions/CallContract';

export default function CreateChama  ()  {
  // State variables for form inputs
  const [chamaName, setChamaName] = useState('');
  const [maxMembers, setMaxMembers] = useState('');
  const [chamaVisibility, setChamaVisibility] = useState('Public');
  const [minimumMembers, setMinimumMembers] = useState('');
  const [targetAmount, setTargetAmount] = useState('');

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createChama(chamaName, maxMembers, chamaVisibility, minimumMembers, targetAmount);
      // Reset form inputs
      setChamaName('');
      setMaxMembers('');
      setChamaVisibility('Public');
      setMinimumMembers('');
      setTargetAmount('');
    } catch (error) {
      console.error('Error creating chama:', error);
    }
  };
  return (
    <div>
      <h2>Create Chama</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="chamaName">Chama Name:</label>
          <input
            type="text"
            id="chamaName"
            value={chamaName}
            onChange={(e) => setChamaName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="maxMembers">Maximum Members:</label>
          <input
            type="number"
            id="maxMembers"
            value={maxMembers}
            onChange={(e) => setMaxMembers(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="chamaVisibility">Chama Visibility:</label>
          <select
            id="chamaVisibility"
            value={chamaVisibility}
            onChange={(e) => setChamaVisibility(e.target.value)}
          >
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>
        </div>
        <div>
          <label htmlFor="minimumMembers">Minimum Members:</label>
          <input
            type="number"
            id="minimumMembers"
            value={minimumMembers}
            onChange={(e) => setMinimumMembers(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="targetAmount">Target Amount per Round (ETH):</label>
          <input
            type="number"
            id="targetAmount"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Chama</button>
      </form>
    </div>
  );

  // ... (rest of the component code)
};
