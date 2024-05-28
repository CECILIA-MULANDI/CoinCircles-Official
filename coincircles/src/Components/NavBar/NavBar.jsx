import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import ConnectWallet from '../ConnectWallet/Connect';
import './NavBar.css'
function NavBar() {
    // const handleSelect = (eventKey) => alert(`selected ${eventKeys
  
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
            <Nav className="ms-3 me-auto" variant="pills" >
              <Nav.Item>
                <Nav.Link  href="/">
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
              <Nav.Item href='/availableChamas'>
                <ConnectWallet />
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
  

export default NavBar;