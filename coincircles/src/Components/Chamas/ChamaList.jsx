import React, { useState, useEffect } from 'react';
import { getAllChamas, addMemberToPrivateChama, joinChama, isMinimumNumberOfPeopleReached, getContributionAmount } from '../CallContractFunctions/CallContract';
import { ethers } from 'ethers';
import AvailableNavBar from '../NavBar/AvailableNavbar';
import ContractAbi from "../../artifacts/contracts/Lock.sol/CoinCircles.json";
// import { ContractAddress } from '../Constants/Constants';
const contractAddress='0x13B33BEd26F4c0819110B86c1B621fa0407e5B31';
const ChamaList = () => {
    const [chamas, setChamas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userAddress, setUserAddress] = useState(null);
    const [isContributionStarted, setIsContributionStarted] = useState(false);
    const [contributionAmount, setContributionAmount] = useState('0');
    const [showContributionModal, setShowContributionModal] = useState(false);
    const [selectedChama, setSelectedChama] = useState(null);
    const [contributionStatus, setContributionStatus] = useState({});

    const handleSelectChama = (chamaName) => {
        const selectedChama = chamas.find(chama => chama.name === chamaName);
        setSelectedChama(selectedChama);
        console.log('Selected Chama:', selectedChama.name);
    };

    useEffect(() => {
        const fetchChamas = async () => {
            try {
                const chamaDetails = await getAllChamas();
                console.log('Chamas fetched:', chamaDetails); // Log the fetched details
        
                // Ensure each chama object includes the contractAddress property
                const chamasWithContractAddress = chamaDetails.map(chama => ({
                    ...chama,
                    contractAddress: '0x13B33BEd26F4c0819110B86c1B621fa0407e5B31' // Replace with actual contract address
                }));
        
                setChamas(chamasWithContractAddress);
        
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
        } catch (error) {
            setError(error.message);
        }
    };

    const handleAddMemberToPrivateChama = async (chamaName, newMember) => {
        try {
            await addMemberToPrivateChama(chamaName, newMember);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleContributeFunds = async (chamaName) => {
        try {
            const selected = chamas.find(chama => chama.name === chamaName);
            if (!selected) {
                setError('Selected Chama does not exist.');
                return;
            }
            
            const isMinimumReached = await isMinimumNumberOfPeopleReached(chamaName);
            if (isMinimumReached) {
                setIsContributionStarted(true);
                const contributionAmount = await getContributionAmount(chamaName);
                setContributionAmount(ethers.utils.formatEther(contributionAmount));
                setSelectedChama(selected); // Update selectedChama state
                setShowContributionModal(true);
            } else {
                setError('Minimum number of members required for contributions has not been reached');
            }
        } catch (error) {
            setError(error.message);
        }
    };
    
    const handleContribution = async () => {
        try {
            // Check if MetaMask or another Ethereum-compatible wallet is installed
            if (!window.ethereum) {
                setError('Please install MetaMask or another Ethereum-compatible wallet.');
                return;
            }
    
            // Request account access from the user
            await window.ethereum.request({ method: 'eth_requestAccounts' });
    
            // Create a provider and signer using the Web3Provider
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
    
            // Parse contributionAmount into Ether
            if (!contributionAmount || isNaN(parseFloat(contributionAmount))) {
                setError('Invalid contribution amount.');
                return;
            }
            const amountInEther = ethers.utils.parseEther(contributionAmount);
    
            // Check if selectedChama is valid
            if (!selectedChama) {
                setError('No chama selected.');
                return;
            }
    
            // Get the chama name from the selectedChama object
            const chamaName = selectedChama.name;
    
            // Get the contract address of the selectedChama
            const chamaAddress = selectedChama.contractAddress;
            if (!chamaAddress) {
                setError('Chama contract address not found.');
                return;
            }
    
            console.log("Selected Chama Address:", chamaAddress);
            console.log("Contribution Amount in Ether:", amountInEther.toString());
            console.log("Contribution Amount:", contributionAmount);
    
            const chamaContract = new ethers.Contract(chamaAddress, ContractAbi, signer);
    
            // Verify that the method exists in the contract
            const methodName = 'contributeFunds';
            if (!chamaContract[methodName]) {
                setError(`Method ${methodName} not found in the contract.`);
                return;
            }
    
            // Call the method with the chama name and amount in ether
            const tx = await chamaContract[methodName](chamaName, { value: amountInEther });
            await tx.wait();
    
            // Update contribution status for the chama only if it's not already true
            setContributionStatus(prevStatus => ({
                ...prevStatus,
                [chamaName]: prevStatus[chamaName] || true
            }));
    
            console.log('Transaction successful:', tx);
            setContributionAmount('');
            setShowContributionModal(false);
        } catch (error) {
            console.error("Error during contribution:", error);
            setError(error.message);
        }
    };
    

    const isMember = (chama, userAddress) => {
        return chama.listOfMembers.includes(userAddress);
    };

    const formatContributionAmount = (amount) => {
        const ethToKsh = 200; // Replace with the appropriate exchange rate
        const contributionInKsh = parseFloat(ethers.utils.formatEther(amount)) * ethToKsh;
        return contributionInKsh.toFixed(2);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <AvailableNavBar />
            <div style={styles.page}>
                <h2 style={styles.heading}>Available Chamas</h2>
                {chamas.length === 0 ? (
                    <p>No chamas found.</p>
                ) : (
                    <div style={styles.cardContainer}>
                       {chamas.map((chama, index) => (
    <div key={index} style={styles.card}>
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
                    <button style={styles.button} onClick={() => handleJoinChama(chama.name)}>Join Chama</button>
                ) : (
                    <button style={styles.button} onClick={() => handleAddMemberToPrivateChama(chama.name, userAddress)}>
                        Add Me to Private Chama
                    </button>
                )}
            </>
        )}
        {isMember(chama, userAddress) && !contributionStatus[chama.name] && !chama.hasContributionStarted && !isContributionStarted && (
    <button style={styles.button} onClick={() => handleContributeFunds(chama.name)}>
        Contribute Funds
    </button>
)}
        
        <button style={styles.button} onClick={() => handleSelectChama(chama.name)}>Select Chama</button>
    </div>
))}

                    </div>
                )}
            </div>
            {showContributionModal && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h3>Contribution Amount</h3>
                        <p>Your contribution amount is {contributionAmount} ETH.</p>
                        <input
                            type="text"
                            value={contributionAmount}
                            onChange={(e) => setContributionAmount(e.target.value)}
                            placeholder="Enter contribution amount"
                        />
                        <button style={styles.button} onClick={() => handleContribution()}>
                            Contribute
                        </button>
                        <button style={styles.button} onClick={() => setShowContributionModal(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

const styles = {
    page: {
        backgroundColor: '#0a253b',
        padding: '20px',
    },
    heading: {
        textAlign: 'center',
        color: 'white',
    },
    cardContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'center',
    },
    card: {
        backgroundColor: 'white',
        color: 'black',
        padding: '20px',
        borderRadius: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '400px',
    },
    button: {
        backgroundColor: '#1fc1c3',
        color: 'white',
        padding: '10px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        margin: '5px',
    },
    modal: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center',
    },
};

export default ChamaList;

           
