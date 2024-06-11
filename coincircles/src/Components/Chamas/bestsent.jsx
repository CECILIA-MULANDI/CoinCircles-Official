import React, { useState, useEffect } from 'react';
import { getAllChamas, addMemberToPrivateChama, joinChama, isMinimumNumberOfPeopleReached, getContributionAmount, voteForRecipient, getCurrentRecipient } from '../CallContractFunctions/CallContract';
import { ethers } from 'ethers';
import AvailableNavBar from '../NavBar/AvailableNavbar';
import ContractAbi from "../../artifacts/contracts/Lock.sol/CoinCircles.json";

const contractAddress = '0xf7C728CED9D6a68E8e08f0aF136A34Cf617130B6';

const ChamaList = () => {
    const [chamas, setChamas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userAddress, setUserAddress] = useState(null);
    const [contributionAmount, setContributionAmount] = useState('0');
    const [showContributionModal, setShowContributionModal] = useState(false);
    const [selectedChama, setSelectedChama] = useState(null);
    const [userContributions, setUserContributions] = useState({});
    const [showVotingModal, setShowVotingModal] = useState(false);
    const [selectedRecipient, setSelectedRecipient] = useState('');
    const [currentRecipient, setCurrentRecipient] = useState(null);

    const handleSelectChama = async (chamaName) => {
        const selectedChama = chamas.find(chama => chama.name === chamaName);
        setSelectedChama(selectedChama);
        console.log('Selected Chama:', selectedChama.name);

        try {
            const recipient = await getCurrentRecipient(chamaName);
            setCurrentRecipient(recipient);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        const fetchChamas = async () => {
            try {
                const chamaDetails = await getAllChamas();
                const chamasWithContractAddress = chamaDetails.map(chama => ({
                    ...chama,
                    contractAddress: contractAddress
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
            console.log(`isMinimumNumberOfPeopleReached: ${isMinimumReached}`);
            if (!isMinimumReached) {
                setError('Minimum number of members required for contributions has not been reached');
                return;
            }
            const contributionAmount = await getContributionAmount(chamaName);
            setContributionAmount(ethers.utils.formatEther(contributionAmount));
            setSelectedChama(selected);
            setShowContributionModal(true);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleContribution = async () => {
        try {
            if (!window.ethereum) {
                setError('Please install MetaMask or another Ethereum-compatible wallet.');
                return;
            }

            await window.ethereum.request({ method: 'eth_requestAccounts' });

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const amountInEther = ethers.utils.parseEther(contributionAmount);

            if (!amountInEther || isNaN(parseFloat(amountInEther))) {
                setError('Invalid contribution amount.');
                return;
            }

            if (!selectedChama) {
                setError('No chama selected.');
                return;
            }

            const chamaAddress = selectedChama.contractAddress;
            if (!chamaAddress) {
                setError('Chama contract address not found.');
                return;
            }

            const chamaContract = new ethers.Contract(chamaAddress, ContractAbi, signer);
            const methodName = 'contributeFunds';

            if (!chamaContract[methodName]) {
                setError(`Method ${methodName} not found in the contract.`);
                return;
            }

            const hasUserContributedInCurrentRound = userContributions[selectedChama.name]?.[selectedChama.currentRound]?.includes(userAddress) || false;

            if (hasUserContributedInCurrentRound) {
                setError('You have already contributed in the current round.');
                return;
            }

            const tx = await chamaContract[methodName](selectedChama.name, { value: amountInEther });
            await tx.wait();

            setUserContributions(prevState => ({
                ...prevState,
                [selectedChama.name]: {
                    ...(prevState[selectedChama.name] || {}),
                    [selectedChama.currentRound]: [...(prevState[selectedChama.name]?.[selectedChama.currentRound] || []), userAddress]
                }
            }));
            setContributionAmount('');
            setShowContributionModal(false);
            setSelectedChama(null);
        } catch (error) {
            console.error("Error during contribution:", error);
            if (error.data && error.data.originalError && error.data.originalError.message.includes('You have already contributed in the current round')) {
                setError('You have already contributed in the current round.');
            } else {
                setError(error.message);
            }
        }
    };

    const isMember = (chama, userAddress) => {
        const isInMemberList = chama.listOfMembers.includes(userAddress);
        const hasContributedInCurrentRound = userContributions[chama.name]?.[chama.currentRound]?.includes(userAddress) || false;
        return isInMemberList || hasContributedInCurrentRound;
    };

    const handleVote = async () => {
        try {
            await voteForRecipient(selectedChama.name, selectedRecipient);
            setSelectedRecipient('');
            setShowVotingModal(false);
        } catch (error) {
            setError(error.message);
        }
    };

    const isVotingRound = (chama) => {
        return chama.hasContributionStarted && chama.currentRound <= chama.numberOfRounds;
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
                                {chama.hasContributionStarted && chama.currentRound <= chama.numberOfRounds && (
                                    <p>Current Recipient: {chama.currentRecipient}</p>
                                )}
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
                                {isMember(chama, userAddress) && chama.minimumNoOfPeople <= chama.listOfMembers.length && (
                                    <button style={styles.button} onClick={() => handleContributeFunds(chama.name)}>
                                        Contribute Funds
                                    </button>
                                )}
                                {isMember(chama, userAddress) && isVotingRound(chama) && (
                                    <button style={styles.button} onClick={() => {
                                        setSelectedChama(chama);
                                        setShowVotingModal(true);
                                    }}>
                                        Vote for Recipient
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
            {showVotingModal && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h3>Vote for Recipient</h3>
                        {currentRecipient && (
                            <p>Current Recipient: {currentRecipient}</p>
                        )}
                        <select
                            value={selectedRecipient}
                            onChange={(e) => setSelectedRecipient(e.target.value)}
                        >
                            <option value="">Select a recipient</option>
                            {selectedChama.listOfMembers.map((member, index) => (
                                <option key={index} value={member}>{member}</option>
                            ))}
                        </select>
                        <button style={styles.button} onClick={handleVote}>
                            Vote
                        </button>
                        <button style={styles.button} onClick={() => setShowVotingModal(false)}>
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

