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
        console.log("Response from API:", response.data);
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
    console.log(import.meta.env.VITE_SH_BE_URL);
    if (islogin) {
      // Handle login logic here
      if (!input.email || !input.password) {
        alert("Email and Password are required");
      }
      triggerAPI(input);
    }
    else {
      // Handle sign-in logic here
      if (input.password !== input.confirmpassword) {
        alert("Passwords do not match");
        return;
      }
      if (!input.name || !input.email || !input.password) {
        alert("Name, Email, and Password are required");
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
      <div className="container mt-5">
        <h1 className="text-center mb-4">{islogin ? "login" : "Sign-up"}</h1>
        <br />
        <Form>
          {!islogin && <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>User Name</Form.Label>
            <Form.Control type="name" placeholder="Enter username" value={input.name} onChange={(e) => setInput((prev) => ({ ...prev, name: e.target.value }))} />
          </Form.Group>}

          {!islogin && <Form.Group className="mb-3" controlId="formBasicBio">
            <Form.Label>Bio</Form.Label>
            <Form.Control type="bio" placeholder="Enter bio" value={input.bio} onChange={(e) => setInput((prev) => ({ ...prev, bio: e.target.value }))} />
          </Form.Group>}


          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={input.email} onChange={(e) => setInput((prev) => ({ ...prev, email: e.target.value }))} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" value={input.password} onChange={(e) => setInput((prev) => ({ ...prev, password: e.target.value }))} />
          </Form.Group>
          {!islogin && <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
            <Form.Label>ConfirmPassword</Form.Label>
            <Form.Control type="confirmpassword" placeholder="ConfirmPassword" value={input.confirmpassword} onChange={(e) => setInput((prev) => ({ ...prev, confirmpassword: e.target.value }))} />
          </Form.Group>}

          <Link to={islogin ? "/sign-up" : "/login"}>
            <Form.Text className="text-muted">
              {islogin ? "Don't have an account? Sign In" : "Already have an account? Login"}
            </Form.Text>
          </Link>

          <Button variant="primary" type="submit" onClick={(e) => {
            e.preventDefault();
            // Handle form submission logic here
            console.log("Form submitted with data:", input);
            handleformsubmit(input);
            // Reset the form or redirect as needed
            setInput({
              name: '',
              email: '',
              password: '',
              bio: ''
            });
          }}>
            Submit
          </Button>
        </Form>
      </div>
    </>
  );
}

export default AuthForm;