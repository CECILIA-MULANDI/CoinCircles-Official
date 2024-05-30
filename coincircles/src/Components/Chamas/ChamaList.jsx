import React, { useState, useEffect } from 'react';
import { getAllChamas, addMemberToPrivateChama, joinChama, contributeFunds, isMinimumNumberOfPeopleReached, getContributionAmount, getChamaId } from '../CallContractFunctions/CallContract';
import { ethers } from 'ethers';
import AvailableNavBar from '../NavBar/AvailableNavbar';

const ChamaList = () => {
    const [chamas, setChamas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userAddress, setUserAddress] = useState(null);
    const [isContributionStarted, setIsContributionStarted] = useState(false);
    const [contributionAmount, setContributionAmount] = useState('');
    const [showContributionModal, setShowContributionModal] = useState(false);
    const [selectedChama, setSelectedChama] = useState(null);

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
                console.error("Error fetching chamas:", error); // Improved error logging
                setError(error.message);
            } finally {
                console.log("Loading....");
                setLoading(false);
            }
        };

        fetchChamas();
    }, []);

    const handleJoinChama = async (chamaName) => {
        try {
            console.log(`Joining chama: ${chamaName}`);
            await joinChama(chamaName);
            console.log(`Successfully joined chama: ${chamaName}`);
            // Optionally, you can refresh the chama list after joining
        } catch (error) {
            console.error("Error joining chama:", error); // Improved error logging
            setError(error.message);
        }
    };

    const handleAddMemberToPrivateChama = async (chamaName, newMember) => {
        try {
            console.log(`Adding member to private chama: ${chamaName}`);
            await addMemberToPrivateChama(chamaName, newMember);
            console.log(`Successfully added member to chama: ${chamaName}`);
            // Optionally, you can refresh the chama list after adding a member
        } catch (error) {
            console.error("Error adding member to private chama:", error); // Improved error logging
            setError(error.message);
        }
    };

    const handleContributeFunds = async (chamaName) => {
        try {
            console.log(`Contributing to chama: ${chamaName}`);
            const isMinimumReached = await isMinimumNumberOfPeopleReached(chamaName);
            console.log(`Is minimum number of people reached: ${isMinimumReached}`);
            if (isMinimumReached) {
                setIsContributionStarted(true);
                const contributionAmount = await getContributionAmount(chamaName);
                console.log(`Contribution amount for chama ${chamaName}: ${contributionAmount}`);
                setContributionAmount(ethers.utils.formatEther(contributionAmount));
                setShowContributionModal(true);
            } else {
                setError('Minimum number of members required for contributions has not been reached');
            }
        } catch (error) {
            console.error("Error contributing funds:", error); // Improved error logging
            setError(error.message);
        }
    };

    const handleContribution = async () => {
        try {
            if (!window.ethereum) {
                setError('Please install MetaMask or another Ethereum-compatible wallet.');
                return;
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const amountInEther = ethers.utils.parseEther(contributionAmount);
            const amountAsString = ethers.utils.formatEther(amountInEther);

            if (amountAsString === '0.0') {
                setError('Contribution amount is too small');
                return;
            }

            if (!selectedChama) {
                setError('No chama selected.');
                return;
            }

            console.log("Selected Chama Name:", selectedChama.name);
            console.log("Contribution Amount in Ether:", amountAsString);

            const tx = {
                to: selectedChama.address, // The address of the chama contract
                value: amountInEther, // The amount to send in wei
            };

            await signer.sendTransaction(tx);
            console.log('Transaction successful');
            setContributionAmount('');
            setShowContributionModal(false);
            // Optionally, you can refresh the chama list after contributing
        } catch (error) {
            console.error("Error during contribution:", error); // Improved error logging
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
                                {isMember(chama, userAddress) && !chama.hasContributionStarted && !isContributionStarted && (
                                    <button style={styles.button} onClick={() => handleContributeFunds(chama.name)}>
                                        Contribute Funds
                                    </button>
                                )}
                                <button style={styles.button} onClick={() => setSelectedChama(chama)}>Select Chama</button>
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
