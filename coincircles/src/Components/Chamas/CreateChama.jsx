import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { createChama } from '../CallContractFunctions/CallContract';
import './css/createchama.css'; // Import CSS for additional styles

const CreateChama = () => {
  const [chamaName, setChamaName] = useState('');
  const [maxMembers, setMaxMembers] = useState('');
  const [chamaVisibility, setChamaVisibility] = useState('Public');
  const [minimumMembers, setMinimumMembers] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [messageTimeout, setMessageTimeout] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      await createChama(chamaName, maxMembers, chamaVisibility, minimumMembers, targetAmount);
      setSuccessMessage(`Chama "${chamaName}" created successfully!`);
      resetForm();
      clearTimeout(messageTimeout); // Clear any previous timeout
      const timeout = setTimeout(() => {
        setSuccessMessage('');
      }, 5000); // Show success message for 5 seconds
      setMessageTimeout(timeout);
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage('');
      clearTimeout(messageTimeout); // Clear any previous timeout
      const timeout = setTimeout(() => {
        setErrorMessage('');
      }, 5000); // Show error message for 5 seconds
      setMessageTimeout(timeout);
    }
  };

  const resetForm = () => {
    setChamaName('');
    setMaxMembers('');
    setChamaVisibility('Public');
    setMinimumMembers('');
    setTargetAmount('');
    setErrorMessage('');
    clearTimeout(messageTimeout); // Clear the message timeout
    setMessageTimeout(null);
  };

  return (
    <div className="create-chama-container">
      <Card className="create-chama-card">
        <Card.Body>
          <Card.Title>Create Chama</Card.Title>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="chamaName">
              <Form.Label>Chama Name:</Form.Label>
              <Form.Control
                type="text"
                value={chamaName}
                onChange={(e) => setChamaName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="maxMembers">
              <Form.Label>Maximum Members:</Form.Label>
              <Form.Control
                type="number"
                value={maxMembers}
                onChange={(e) => setMaxMembers(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="chamaVisibility">
              <Form.Label>Chama Visibility:</Form.Label>
              <Form.Control
                as="select"
                value={chamaVisibility}
                onChange={(e) => setChamaVisibility(e.target.value)}
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="minimumMembers">
              <Form.Label>Minimum Members:</Form.Label>
              <Form.Control
                type="number"
                value={minimumMembers}
                onChange={(e) => setMinimumMembers(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="targetAmount">
              <Form.Label>Target Amount per Round (ETH):</Form.Label>
              <Form.Control
                type="number"
                step="0.001"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className='create-btn'>
              Create Chama
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CreateChama;
