import React, { useState, useEffect } from 'react';
import { getAllChamas, addMemberToPrivateChama, joinChama, isMinimumNumberOfPeopleReached, getContributionAmount } from '../CallContractFunctions/CallContract';
import { ethers } from 'ethers';
import AvailableNavBar from '../NavBar/AvailableNavbar';
import ContractAbi from "../../artifacts/contracts/Lock.sol/CoinCircles.json";

const contractAddress = '0x13B33BEd26F4c0819110B86c1B621fa0407e5B31';

const ChamaList = () => {
    const [chamas, setChamas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userAddress, setUserAddress] = useState(null);
    const [selectedChama, setSelectedChama] = useState(null);

    useEffect(() => {
        const fetchChamas = async () => {
            try {
                const chamaDetails = await getAllChamas();
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

    const handleSelectChama = (chama) => {
        setSelectedChama(chama);
    };

    const handleContributeFunds = async () => {
        try {
            // Ensure a chama is selected
            if (!selectedChama) {
                setError('No chama selected.');
                return;
            }
    
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
    
            const chamaContract = new ethers.Contract(selectedChama.contractAddress, ContractAbi, signer);
    
            // Verify that the method exists in the contract
            const methodName = 'contributeFunds';
            if (!chamaContract[methodName]) {
                setError(`Method ${methodName} not found in the contract.`);
                return;
            }
    
            // Call the method
            const tx = await chamaContract[methodName]();
            await tx.wait();
    
            console.log('Transaction successful:', tx);
        } catch (error) {
            console.error("Error during contribution:", error);
            setError(error.message);
        }
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
                                <button style={styles.button} onClick={() => handleSelectChama(chama)}>Select Chama</button>
                            </div>
                        ))}
                    </div>
                )}
                {selectedChama && (
                    <div style={styles.selectedChama}>
                        <h2>Selected Chama: {selectedChama.name}</h2>
                        <button style={styles.button} onClick={handleContributeFunds}>Contribute Funds</button>
                    </div>
                )}
            </div>
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
    selectedChama: {
        marginTop: '20px',
        padding: '20px',
        backgroundColor: '#f0f0f0',
        borderRadius: '10px',
        textAlign: 'center',
    },
};

export default ChamaList;
