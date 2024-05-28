import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import ConnectWallet from '../ConnectWallet/Connect';
function NavBar() {
    const handleSelect = (eventKey) => alert(`selected ${eventKey}`);
  
    return (
      <Navbar bg="light" expand="lg">
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
            <Nav className="mx-auto" variant="pills" activeKey="1" onSelect={handleSelect}>
              <Nav.Item>
                <Nav.Link eventKey="1" href="/">
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