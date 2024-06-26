import React from 'react';
import { Nav, Navbar, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ConnectWallet from '../ConnectWallet/Connect';
import './NavBar.css';
import { NavHashLink } from 'react-router-hash-link';

function AvailableNavBar() {
    return (
        <>
        <Navbar className='custom-color' expand="lg">
            <Container>
                <Nav.Item>
                    <NavHashLink to="/" className="nav-link" style={{ color: '#1fc1c3' }}>CoinCircles</NavHashLink>
                </Nav.Item>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav>
                        <Nav.Item>
                            <Button as={Link} to="/createChama" variant="primary" style={{ marginLeft: '10px', backgroundColor: '#1fc1c3' }}>
                                Create Chama
                            </Button>
                        </Nav.Item>
                    </Nav>
                    <Nav>
                        <Nav.Item>
                            <ConnectWallet />
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <div className="navbar-separator"></div>
        </>
    );
}

export default AvailableNavBar;