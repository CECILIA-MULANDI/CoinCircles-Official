import React, { useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/esm/Button';
import Container from 'react-bootstrap/Container';
import ConnectWallet from '../ConnectWallet/Connect';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();

  const handleConnect = () => {
    setIsConnected(true);
    // Optionally, you can handle wallet connection logic here
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    // Optionally, you can handle wallet disconnection logic here
  };

  const handleNavigateChamas = () => {
    if (isConnected) {
      navigate('/availableChamas');
    } else {
      navigate('/', { state: { error: 'You are not connected to your wallet. Please connect to access available chamas.' } });
    }
  };

  return (
    <Navbar className='custom-color' expand="lg">
      <Container>
        <Navbar.Brand href="/">
          <img
            src="" // Replace with your logo's path
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="Logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-3 me-auto" variant="pills">
            <Nav.Item>
              <Nav.Link href="/">
                Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href='/about-us'>
                About
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href='/contact-us'>
                Contact
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Nav>
            {isConnected ? (
              <Button className="connect-btn" onClick={handleNavigateChamas}>Available Chamas</Button>
            ) : (
              <ConnectWallet onConnect={handleConnect} />
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
