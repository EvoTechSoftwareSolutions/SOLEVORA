// Importing necessary libraries, components, and styles
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { showSuccess, showError } from "../../utils/notifications";
import forgotImage from "../../assets/shoe.png";

import { HiOutlineMail } from "react-icons/hi";
import "../../styles/Auth.css";

function ForgotPassword() {
  const navigate = useNavigate();

  // State to manage the email input
  const [email, setEmail] = useState("");


  // Function to handle the forgot password form submission
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!email) {
      showError("Please enter your email address");
      return;
    }

    try {
      // Sending the email to the backend API for password reset
      const res = await axios.post("http://localhost:5001/forgot-password", {
        email,
      });

      showSuccess("Email Sent!", res.data.message);

      // Redirecting to the check email page after a short delay
      setTimeout(() => {
        navigate("/check-email");
      }, 2000);
    } catch (error) {
      // Handling errors and displaying appropriate messages
      const errorMsg = error.response?.data?.message || "Something went wrong";
      showError("Error", errorMsg);
    }
  };


  return (
    <div className="auth-container">
      {/* Left Side - Image and Overlay Section */}
      <div className="auth-left-panel">
        <img
          src={forgotImage}
          alt="Forgot Password Shoe"
          className="auth-image"
        />
        <div className="auth-overlay"></div>
        <div className="auth-overlay-content">
          <p className="auth-tag">Craftsmanship & Heritage</p>
          <h1 className="auth-heading-img">
            Designed for the
            <br />
            <span style={{color: "#f97316"}}>Modern Kinetic.</span>
          </h1>
          <p className="auth-subheading-img">
            Solevora Ember blends high-performance utility with an
            editorial aesthetic for those who move with purpose.
          </p>
        </div>
      </div>

      {/* Right Side - Forgot Password Form Section */}
      <div className="auth-right-panel">
        <div className="auth-form-wrapper">
          <h2 className="auth-title">Forgot your password?</h2>
          <p className="auth-subtitle">
            No worries, it happens. Enter your email address and we&apos;ll
            send you a link to reset it.
          </p>

          <form onSubmit={handleForgotPassword}>
            {/* Email Input Field */}
            <div className="auth-form-group">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrapper">
                <HiOutlineMail className="auth-icon" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="auth-submit-btn"
            >
              Send Reset Link →
            </button>

          </form>


          {/* Link to Return to Login */}
          <Link to="/" className="auth-link-back">
            ← Return to Login
          </Link>
          
          {/* Support Contact Information */}
          <div style={{marginTop: "3rem", textAlign: "center"}}>
            <p style={{fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#94a3b8", fontWeight: "600"}}>
              Need Help? <span style={{color: "#f97316", cursor: "pointer"}}>Contact Support</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
