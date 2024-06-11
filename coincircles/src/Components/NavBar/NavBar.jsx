import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import ConnectWallet from '../ConnectWallet/Connect';
import './NavBar.css';
import { NavHashLink } from 'react-router-hash-link';
import "../Chamas/css/createchama.css"
import logo from "../images/logo-color.png"
function NavBar() {
 
  return (
    <Navbar className='custom-color' expand="lg">
      <Container>
        <Navbar.Brand href="/">
        <Nav.Item>
              <NavHashLink to="/" className="nav-link " style={{ color:'#1fc1c3' }}>CoinCircles</NavHashLink>
            </Nav.Item>
          {/* <img
            src={logo} // Replace with your logo's path
            width="90"
            height="30"
            className="d-inline-block align-top"
            alt="Logo"
            style={{ backgroundColor: 'transparent' }}
          /> */}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-3 me-auto">
            <Nav.Item>
              <NavHashLink to="/" className="nav-link text-white text">Home</NavHashLink>
            </Nav.Item>
            <Nav.Item>
              <NavHashLink to="/#about" className="nav-link text-white" smooth>About</NavHashLink>
            </Nav.Item>
            <Nav.Item>
              <NavHashLink to="/#contact" className="nav-link text-white" smooth>Contact</NavHashLink>
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
  );
}

export default NavBar;