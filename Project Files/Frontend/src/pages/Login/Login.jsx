import React from "react";
import { Form, Button } from "react-bootstrap";
import "./Login.css";

const Login = () => {
  return (
    <div className="login-page">
      <div className="login-box">
        <h2 className="login-title">Login</h2>

        <Form>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Type your username" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Type your password" />
            <div className="forgot-pass">Forgot password?</div>
          </Form.Group>

          <Button className="login-btn" type="submit">
            Login
          </Button>

          <div className="or-text">Or login using</div>
          <div className="social-icons">
            <i className="fab fa-facebook-f"></i>
            <i className="fab fa-twitter"></i>
            <i className="fab fa-google"></i>
          </div>

          <div className="signup-text">
            Or sign up using <span>Sign Up</span>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
