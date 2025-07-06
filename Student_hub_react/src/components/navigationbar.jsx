import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';


function Navigationbar() {   
  const isAuthenticated = localStorage.getItem('session_token') != null; 
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">StudentHub</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Item className=''> <Link to="/home">Home</Link> </Nav.Item>
            {!isAuthenticated && <Nav.Item> <Link to="/login">Login</Link> </Nav.Item>}
            {!isAuthenticated && <Nav.Item> <Link to="/sign-up">Sign Up</Link> </Nav.Item>} 
            {isAuthenticated && (
            <Nav.Link as="button" style={{ color: 'white' }} onClick={
              () => {
                localStorage.removeItem('session_token');
                window.location.href = '/login'; // Redirect to login page after logout
              }
            }>
              Logout
            </Nav.Link>
          )} </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Navigationbar;