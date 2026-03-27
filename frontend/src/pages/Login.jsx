import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import loginImage from "../assets/login-shoe.png";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaUser } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { LuLock } from "react-icons/lu";
import { FiSettings } from "react-icons/fi";

import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from location state
  const from = location.state?.from || "/home";

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please enter email and password");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("isAuthenticated", "true");
      navigate(from, { replace: true });
    } catch (error) {
      if (error.response && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Login failed");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email: "googleuser@gmail.com",
        password: "social_login",
      });

      localStorage.setItem("user", JSON.stringify({ email: "googleuser@gmail.com", name: "Google User" }));
      localStorage.setItem("isAuthenticated", "true");
      navigate(from, { replace: true });
    } catch (error) {
      if (error.response && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Google login failed");
      }
    }
  };

  const handleAppleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email: "appleuser@gmail.com",
        password: "social_login",
      });

      localStorage.setItem("user", JSON.stringify({ email: "appleuser@gmail.com", name: "Apple User" }));
      localStorage.setItem("isAuthenticated", "true");
      navigate(from, { replace: true });
    } catch (error) {
      if (error.response && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Apple login failed");
      }
    }
  };

  return (
    <div className="auth-container">
      {/* Near-invisible Admin Entry */}
      <div 
        onClick={() => navigate('/admin-login')}
        style={{
          position: "fixed",
          bottom: "12px",
          right: "12px",
          color: "#1a1a1a",
          opacity: 0.05, /* Barely visible, only if you look for it */
          cursor: "pointer",
          zIndex: 9999
        }}
        title="Admin Entry"
      >
        <FiSettings size={14} />
      </div>
      {/* Left Side */}
      <div className="auth-left-panel">
        <img
          src={loginImage}
          alt="Login Shoe"
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
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Sign in to your Solevora account to access your orders and wishlist.
          </p>

          <form onSubmit={handleLogin}>
            <div className="auth-form-group">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrapper">
                <HiOutlineMail className="auth-icon" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="auth-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrapper">
                <LuLock className="auth-icon" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="auth-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div style={{textAlign: "right", marginTop: "-0.5rem", marginBottom: "2rem"}}>
              <Link to="/forgot-password" style={{color: "#f97316", fontWeight: "600", textDecoration: "none"}}>
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="auth-submit-btn">
              Sign In
            </button>

            {message && <p className="auth-error">{message}</p>}
          </form>

          <div className="auth-divider">
            <span>Or continue with</span>
          </div>

          <div className="auth-social-buttons">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="auth-social-btn"
            >
              <FcGoogle size={22} />
              Google
            </button>

            <button
              type="button"
              onClick={handleAppleLogin}
              className="auth-social-btn"
            >
              <FaApple size={20} />
              Apple
            </button>
          </div>

          <Link to="/register" className="auth-link-back" style={{marginTop: "1rem"}}>
            Don&apos;t have an account? <span style={{color: "#f97316"}}>Sign Up</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;