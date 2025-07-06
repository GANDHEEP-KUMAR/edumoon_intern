import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loaders'; // Assuming you have a Loader component for loading state

function AuthForm(props) {
  const { islogin } = props;
  const [input, setInput] = useState({
    name: '',
    email: '',
    password: '',
    bio: ''
  });

  const [loader, setLoader] = useState(false);

  const isAuthenticated = localStorage.getItem('session_token') != null;

  const triggerAPI = (payload) => {
    const url = import.meta.env.VITE_SH_BE_URL + 'api/v1/user/' + (islogin ? 'login' : 'sign-up');
    setLoader(true);
    axios.post(url, payload)
      .then(response => {

        if (!islogin && response.status === 200) {
          alert("Sign-up successful");
          // Redirect or perform other actions as needed
          window.location.href = "/login";
        }
        // Handle successful response
        else if (response.status === 200) {
          // alert("Operation successful");
          // Redirect or perform other actions as needed
          localStorage.setItem("session_token", response.data.data.session_token);
          window.location.href = "/home";
        }
      })
      .catch(error => {
        alert("Error occurred during the operation! Please try again.");
        console.error("Error calling API:", error);
        // Handle error response
      })
      .finally(() => {
            setLoader(false);
      });
  }

  const handleformsubmit = (input) => {
    if (islogin) {
      // Handle login logic here
      if (!input.email || !input.password) {
        alert("Email and Password are required");
        return;
      }
      triggerAPI(input);
    }
    else {
      // Handle sign-up logic here
      if (input.password !== input.confirmpassword) {
        alert("Passwords do not match");
        return;
      }
      if (!input.name || !input.email || !input.password) {
        alert("Name, Email, and Password are required");
        return;
      }
      triggerAPI(input);
    }
  }
  if (isAuthenticated) {
    window.location.href = "/home";
    return null;
  }
  return (
    <>
      {loader && <Loader />}
      <div className="min-vh-100 d-flex align-items-center justify-content-center animate-fade-in" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '100px',
          height: '100px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '70%',
          right: '15%',
          width: '150px',
          height: '150px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse'
        }}></div>
        
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card glass-effect animate-scale-in" style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '24px',
                padding: '40px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
              }}>
                <div className="text-center mb-4">
                  <div className="d-inline-block p-3 rounded-circle mb-3" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                  }}>
                    <i className="fas fa-user-circle fa-2x"></i>
                  </div>
                  <h2 className="gradient-text mb-2 fw-bold">
                    {islogin ? "Welcome Back" : "Join StudentHub"}
                  </h2>
                  <p className="text-muted">
                    {islogin ? "Sign in to continue your learning journey" : "Create your account and start collaborating"}
                  </p>
                </div>

                <Form className="animate-slide-up">
                  {!islogin && (
                    <Form.Group className="mb-4" controlId="formBasicName">
                      <Form.Label className="fw-semibold">
                        <i className="fas fa-user me-2 text-primary"></i>Full Name
                      </Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Enter your full name" 
                        value={input.name} 
                        onChange={(e) => setInput((prev) => ({ ...prev, name: e.target.value }))}
                        className="form-control-lg"
                        style={{ borderRadius: '12px', padding: '16px' }}
                      />
                    </Form.Group>
                  )}

                  {!islogin && (
                    <Form.Group className="mb-4" controlId="formBasicBio">
                      <Form.Label className="fw-semibold">
                        <i className="fas fa-edit me-2 text-primary"></i>Bio
                      </Form.Label>
                      <Form.Control 
                        as="textarea"
                        rows={3}
                        placeholder="Tell us about yourself..." 
                        value={input.bio} 
                        onChange={(e) => setInput((prev) => ({ ...prev, bio: e.target.value }))}
                        style={{ borderRadius: '12px', padding: '16px' }}
                      />
                    </Form.Group>
                  )}

                  <Form.Group className="mb-4" controlId="formBasicEmail">
                    <Form.Label className="fw-semibold">
                      <i className="fas fa-envelope me-2 text-primary"></i>Email Address
                    </Form.Label>
                    <Form.Control 
                      type="email" 
                      placeholder="Enter your email" 
                      value={input.email} 
                      onChange={(e) => setInput((prev) => ({ ...prev, email: e.target.value }))}
                      className="form-control-lg"
                      style={{ borderRadius: '12px', padding: '16px' }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formBasicPassword">
                    <Form.Label className="fw-semibold">
                      <i className="fas fa-lock me-2 text-primary"></i>Password
                    </Form.Label>
                    <Form.Control 
                      type="password" 
                      placeholder="Enter your password" 
                      value={input.password} 
                      onChange={(e) => setInput((prev) => ({ ...prev, password: e.target.value }))}
                      className="form-control-lg"
                      style={{ borderRadius: '12px', padding: '16px' }}
                    />
                  </Form.Group>

                  {!islogin && (
                    <Form.Group className="mb-4" controlId="formBasicConfirmPassword">
                      <Form.Label className="fw-semibold">
                        <i className="fas fa-shield-alt me-2 text-primary"></i>Confirm Password
                      </Form.Label>
                      <Form.Control 
                        type="password" 
                        placeholder="Confirm your password" 
                        value={input.confirmpassword} 
                        onChange={(e) => setInput((prev) => ({ ...prev, confirmpassword: e.target.value }))}
                        className="form-control-lg"
                        style={{ borderRadius: '12px', padding: '16px' }}
                      />
                    </Form.Group>
                  )}

                  <Button 
                    type="submit" 
                    className="btn-gradient w-100 py-3 mb-4 fw-bold"
                    style={{ fontSize: '16px', borderRadius: '12px' }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleformsubmit(input);
                    }}
                    disabled={loader}
                  >
                    {loader ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className={`fas ${islogin ? 'fa-sign-in-alt' : 'fa-user-plus'} me-2`}></i>
                        {islogin ? "Sign In" : "Create Account"}
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <Link 
                      to={islogin ? "/sign-up" : "/login"}
                      className="text-decoration-none"
                      style={{ 
                        color: 'var(--primary-color)',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {islogin ? (
                        <>
                          <i className="fas fa-user-plus me-2"></i>
                          Don't have an account? <span className="fw-bold">Sign Up</span>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt me-2"></i>
                          Already have an account? <span className="fw-bold">Login</span>
                        </>
                      )}
                    </Link>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthForm;