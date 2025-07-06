import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';


function Navigationbar() {   
  const isAuthenticated = localStorage.getItem('session_token') != null; 
  
  const handleLogout = () => {
    localStorage.removeItem('session_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_id');
    window.location.href = '/login';
  };

  return (
    <>
      <Navbar 
        expand="lg" 
        className="navbar-light bg-white py-2 shadow-sm"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}
      >
        <Container>
          <Navbar.Brand 
            as={Link} 
            to="/home" 
            className="d-flex align-items-center fw-bold text-primary"
          >
            <i className="fas fa-graduation-cap me-2 fs-4"></i>
            StudentHub
          </Navbar.Brand>

          <Navbar.Toggle 
            aria-controls="basic-navbar-nav"
            style={{
              border: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '8px',
              padding: '8px 12px'
            }}
          >
            <i className="fas fa-bars text-white"></i>
          </Navbar.Toggle>

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto d-flex align-items-center">
              {isAuthenticated && (
                <Nav.Link 
                  as={Link} 
                  to="/home"
                  className="nav-link-modern me-3"
                  style={{
                    color: '#495057',
                    fontWeight: '500',
                    padding: '12px 20px',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                    position: 'relative'
                  }}
                >
                  <i className="fas fa-home me-2"></i>
                  Home
                </Nav.Link>
              )}

              {!isAuthenticated ? (
                <div className="d-flex gap-2">
                  <Nav.Link 
                    as={Link} 
                    to="/login"
                    className="btn btn-outline-gradient me-2"
                    style={{
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 20px',
                      borderRadius: '10px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Login
                  </Nav.Link>
                  
                  <Nav.Link 
                    as={Link} 
                    to="/sign-up"
                    className="btn btn-gradient"
                    style={{
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 20px',
                      borderRadius: '10px',
                      fontWeight: '500'
                    }}
                  >
                    <i className="fas fa-user-plus me-2"></i>
                    Sign Up
                  </Nav.Link>
                </div>
              ) : (
                <div className="dropdown">
                  <button
                    className="btn d-flex align-items-center dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      background: 'rgba(102, 126, 234, 0.1)',
                      border: '2px solid rgba(102, 126, 234, 0.2)',
                      borderRadius: '12px',
                      padding: '10px 16px',
                      color: '#667eea',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div 
                      className="me-2 d-flex align-items-center justify-content-center"
                      style={{
                        width: '32px',
                        height: '32px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px'
                      }}
                    >
                      <i className="fas fa-user"></i>
                    </div>
                    Account
                  </button>
                  <ul 
                    className="dropdown-menu dropdown-menu-end animate-scale-in"
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                      padding: '8px'
                    }}
                  >
                    <li>
                      <Link 
                        to="/profile"
                        className="dropdown-item d-flex align-items-center"
                        style={{
                          borderRadius: '8px',
                          padding: '12px 16px',
                          transition: 'all 0.3s ease',
                          color: '#495057',
                          textDecoration: 'none'
                        }}
                      >
                        <i className="fas fa-user-circle me-3 text-primary"></i>
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/profile"
                        className="dropdown-item d-flex align-items-center"
                        style={{
                          borderRadius: '8px',
                          padding: '12px 16px',
                          transition: 'all 0.3s ease',
                          color: '#495057',
                          textDecoration: 'none'
                        }}
                        onClick={() => window.location.href = '/profile?tab=settings'}
                      >
                        <i className="fas fa-cog me-3 text-secondary"></i>
                        Settings
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" style={{ margin: '8px 0', opacity: 0.2 }} /></li>
                    <li>
                      <button
                        className="dropdown-item d-flex align-items-center"
                        onClick={handleLogout}
                        style={{
                          borderRadius: '8px',
                          padding: '12px 16px',
                          transition: 'all 0.3s ease',
                          color: '#dc3545',
                          border: 'none',
                          background: 'none',
                          width: '100%'
                        }}
                      >
                        <i className="fas fa-sign-out-alt me-3"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <style jsx>{`
        .dropdown-item:hover {
          background: rgba(102, 126, 234, 0.1) !important;
          color: #667eea !important;
        }
        
        .nav-link-modern:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea !important;
          transform: translateY(-2px);
        }
      `}</style>
    </>
  );
}

export default Navigationbar;