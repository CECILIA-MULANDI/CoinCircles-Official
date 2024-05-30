import React, { useState, useEffect } from 'react';
import { getAllChamas, addMemberToPrivateChama, joinChama, contributeFunds,isMinimumNumberOfPeopleReached,getContributionAmount,getChamaId } from '../CallContractFunctions/CallContract';
import { ethers } from 'ethers';
import AvailableNavBar from '../NavBar/AvailableNavbar';

const ChamaList = () => {
    const [chamas, setChamas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userAddress, setUserAddress] = useState(null);
    const [isContributionStarted, setIsContributionStarted] = useState(false);
    const [contributionAmount, setContributionAmount] = useState(null);
    const [showContributionModal, setShowContributionModal] = useState(false);

    useEffect(() => {
        // ... (same as before)
    }, []);

    const handleJoinChama = async (chamaName) => {
        // ... (same as before)
    };

    const handleAddMemberToPrivateChama = async (chamaName, newMember) => {
        // ... (same as before)
    };

    const handleContributeFunds = async (chamaName) => {
        try {
            const isMinimumReached = await isMinimumNumberOfPeopleReached(chamaName);
            if (isMinimumReached) {
                setIsContributionStarted(true);
                const contributionAmount = await getContributionAmount(chamaName);
                setContributionAmount(contributionAmount);
                setShowContributionModal(true);
            } else {
                setError('Minimum number of members required for contributions has not been reached');
            }
        } catch (error) {
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
                                {/* ... (chama details remain the same) */}
                                {isMember(chama, userAddress) && !chama.hasContributionStarted && !isContributionStarted && (
                                    <button style={styles.button} onClick={() => handleContributeFunds(chama.name)}>
                                        Contribute Funds
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {showContributionModal && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h3>Contribution Amount</h3>
                        <p>Your contribution amount is {formatContributionAmount(contributionAmount)} Kenyan Shillings (KES).</p>
                        <button style={styles.button} onClick={() => setShowContributionModal(false)}>
                            Close
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
        borderRadius: '5px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        textAlign: 'center',
    },
};

export default ChamaList;