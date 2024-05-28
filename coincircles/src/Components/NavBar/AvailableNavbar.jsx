import React, { useState,useEffect } from 'react';
import { Nav, Navbar, Container, Button } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import ConnectWallet from '../ConnectWallet/Connect';
import { ethers } from 'ethers';
import './NavBar.css';

function AvailableNavBar() {
    const [isConnected, setIsConnected] = useState(false);
    const [userAddress, setUserAddress] = useState(null);
    const history = Navigate();

    useEffect(() => {
        const checkConnection = async () => {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const accounts = await provider.listAccounts();
                if (accounts.length > 0) {
                    setIsConnected(true);
                    setUserAddress(accounts[0]);
                }
            }
        };

        checkConnection();
    }, []);

    const handleConnect = (address) => {
        setIsConnected(true);
        setUserAddress(address);
    };

    const handleDisconnect = () => {
        setIsConnected(false);
        setUserAddress(null);
        history.push('/');
    };

    return (
        <Navbar className='custom-color' expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">
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
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/about-us">About</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/contact-us">Contact</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Nav>
                        <Nav.Item>
                            <ConnectWallet
                                isConnected={isConnected}
                                address={userAddress}
                                onConnect={handleConnect}
                                onDisconnect={handleDisconnect}
                            />
                        </Nav.Item>
                        {isConnected && (
                            <Nav.Item>
                                <Button as={Link} to="/createChama" variant="primary" style={{ marginLeft: '10px' }}>
                                    Create Chama
                                </Button>
                            </Nav.Item>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AvailableNavBar;
