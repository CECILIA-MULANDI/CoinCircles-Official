import React, { useState } from 'react';

const VotingComponent = ({ chama, contributors, onVote }) => {
    const [selectedMember, setSelectedMember] = useState('');

    const handleVote = () => {
        if (selectedMember) {
            onVote(selectedMember);
        }
    };

    return (
        <div style={styles.modal}>
            <div style={styles.modalContent}>
                <h3>Vote for Member</h3>
                <p>Please select a member to vote for:</p>
                <div>
                    {contributors.map((contributor, index) => (
                        <div key={index} style={styles.memberOption}>
                            <input
                                type="radio"
                                id={`member-${index}`}
                                name="member"
                                value={contributor}
                                checked={selectedMember === contributor}
                                onChange={() => setSelectedMember(contributor)}
                            />
                            <label htmlFor={`member-${index}`}>{contributor}</label>
                        </div>
                    ))}
                </div>
                <button style={styles.button} onClick={handleVote} disabled={!selectedMember}>
                    Vote
                </button>
            </div>
        </div>
    );
};

const styles = {
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
    memberOption: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
    },
    button: {
        backgroundColor: '#1fc1c3',
        color: 'white',
        padding: '10px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        margin: '10px',
    },
};

export default VotingComponent;