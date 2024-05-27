import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import {CreateChamas} from '../CallContractFunctions/CallContract';

const ChamaForm = () => {
  const [name, setName] = useState('');
  const [maxNoOfPeople, setMaxNoOfPeople] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [minimumNoOfPeople, setMinimumNoOfPeople] = useState('');
  const [targetAmountPerRound, setTargetAmountPerRound] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert maxNoOfPeople and minimumNoOfPeople to integers
      const maxPeople = parseInt(maxNoOfPeople);
      const minPeople = parseInt(minimumNoOfPeople);
      // Ensure targetAmountPerRound is converted to a float
      const targetAmount = parseFloat(targetAmountPerRound);
  
      // Call CreateChamas function with the correct parameters
      await CreateChamas(
        name,
        maxPeople,
        visibility,
        minPeople,
        targetAmount,
        setSuccessMessage,
        setErrorMessage
      );
      setErrorMessage('');
    } catch (err) {
      setErrorMessage('Error creating chama. Please try again.');
      console.error(err);
    }
  };
  

  return (
    <Container>
      <h1 className="my-4">Create Chama</h1>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter chama name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formMaxNoOfPeople">
          <Form.Label>Maximum Number of People</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter maximum number of people"
            value={maxNoOfPeople}
            onChange={(e) => setMaxNoOfPeople(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formVisibility">
          <Form.Label>Visibility</Form.Label>
          <Form.Control
            as="select"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formMinimumNoOfPeople">
          <Form.Label>Minimum Number of People</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter minimum number of people"
            value={minimumNoOfPeople}
            onChange={(e) => setMinimumNoOfPeople(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formTargetAmountPerRound">
          <Form.Label>Target Amount Per Round (in ETH)</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            placeholder="Enter target amount per round"
            value={targetAmountPerRound}
            onChange={(e) => setTargetAmountPerRound(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Create Chama
        </Button>
      </Form>
    </Container>
  );
};

export default ChamaForm;