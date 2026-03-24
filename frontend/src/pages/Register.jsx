import { useState } from "react";
import shoeImage from "../assets/shoe.png";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "./Auth.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setMessage("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/register", {
        name,
        email,
        password,
      });

      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Registration failed");
      }
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:5000/social-register", {
        name: "Google User",
        email: "googleuser@gmail.com",
      });

      localStorage.setItem("user", JSON.stringify({ email: "googleuser@gmail.com", name: "Google User" }));
      navigate("/home");
    } catch (error) {
      console.log(error);
      setMessage("Google registration failed");
    }
  };

  const handleAppleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:5000/social-register", {
        name: "Apple User",
        email: "appleuser@gmail.com",
      });

      localStorage.setItem("user", JSON.stringify({ email: "appleuser@gmail.com", name: "Apple User" }));
      navigate("/home");
    } catch (error) {
      console.log(error);
      setMessage("Apple registration failed");
    }
  };

  return (
    <div className="auth-container">
      {/* Left Side */}
      <div className="auth-left-panel">
        <img
          src={shoeImage}
          alt="shoe"
          className="auth-image"
        />
        <div className="auth-overlay"></div>
        <div className="auth-overlay-content">
          <h2 className="auth-heading-img">Step into the future.</h2>
          <p className="auth-subheading-img">
            Join our community and get exclusive <br />
            access to limited drops.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="auth-right-panel">
        <div className="auth-form-wrapper">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">
            Join Solevora for exclusive access to the latest drops.
          </p>

          <form onSubmit={handleRegister}>
            <div className="auth-form-group">
              <label className="auth-label">Full Name</label>
              <div className="auth-input-wrapper">
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="auth-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrapper">
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="auth-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="auth-form-row">
              <div>
                <label className="auth-label">Password</label>
                <div className="auth-input-wrapper">
                  <input
                    type="password"
                    placeholder="********"
                    className="auth-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="auth-label">Confirm</label>
                <div className="auth-input-wrapper">
                  <input
                    type="password"
                    placeholder="********"
                    className="auth-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">
              Create Account
            </button>

            {message && <p className="auth-error">{message}</p>}
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>Or continue with</span>
          </div>

          {/* Social Buttons */}
          <div className="auth-social-buttons">
            <button
              type="button"
              onClick={handleGoogleRegister}
              className="auth-social-btn"
            >
              <FcGoogle size={22} />
              Google
            </button>

            <button
              type="button"
              onClick={handleAppleRegister}
              className="auth-social-btn"
            >
              <FaApple size={20} />
              Apple
            </button>
          </div>

          <Link to="/" className="auth-link-back" style={{marginTop: "1rem"}}>
            Already have an account? <span style={{color: "#f97316"}}>Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;