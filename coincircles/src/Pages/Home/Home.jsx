import React from 'react';
import NavBar from '../../Components/NavBar/NavBar';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import './Home.css';
import moneyImage from "../../Components/images/money1.jpeg"

export default function Home() {
  return (
    <div style={{ backgroundColor: '#0a253b', minHeight: '100vh' }}>
      <NavBar />
      <div className="navbar-separator"></div>

      <section className="hero">
        <Container>
          <Row>
            <Col md={6} className="hero-image">
              <img src={moneyImage} alt="Coins" />
            </Col>
            <Col md={6} className="hero-text">
              <h1>Join A Chama From Anywhere In The World</h1>
              <Button size="lg" style={{ backgroundColor: '#1fc1c3',border:'None'}}>Explore</Button>
            </Col>
          </Row>
        </Container>
      </section>
      <div className="navbar-separator"></div>
      <section id="about" className="text-center text-white py-5">
        <Container>
          <h2>About Us</h2>
          <div id="story">
            <p>CoinCircles was founded in 2023 by a group of passionate cryptocurrency enthusiasts who envisioned a world where digital assets are accessible to everyone.</p>
          </div>
        </Container>
      </section>
      <div className="navbar-separator"></div>
      <section id="contact" className="text-center text-white mb-5">
        <h2>Contact Us</h2>
        <Container className="w-50 mx-auto my-3">
          <Card className="bg-white">
            <Card.Body>
              <Form>
                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter your avatar name" />
                </Form.Group>
                <Form.Group controlId="formComplaint">
                  <Form.Label>Complaint</Form.Label>
                  <Form.Control as="textarea" rows={3} placeholder="Enter your complaint" />
                </Form.Group>
                <div className="d-flex justify-content-center">
                  <Button type="submit" className="w-50" style={{ backgroundColor: '#1fc1c3', marginTop: '20px', padding: '10px',border:'None'}}>
                    Submit
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </section>
      <div className="navbar-separator"></div>
      <footer className="text-white py-3">
        <Container className="text-center">
          <p>&copy; 2023 CoinCircles. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
}