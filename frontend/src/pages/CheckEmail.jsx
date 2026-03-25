import { Link } from "react-router-dom";
import { HiOutlineMailOpen } from "react-icons/hi";
import checkImage from "../assets/check-email.png";
import "./Auth.css";

function CheckEmail() {
  return (
    <div className="auth-container">
      {/* Left Side */}
      <div className="auth-left-panel">
        <img
          src={checkImage}
          alt="Check Email"
          className="auth-image"
        />
        <div className="auth-overlay"></div>
        <div className="auth-overlay-content">
          <p className="auth-tag">Solevora</p>
          <h1 className="auth-heading-img">
            The intersection of
            <br />
            high-performance &amp;
            <br />
            premium utility.
          </h1>
          <div style={{marginTop: "1.5rem", width: "3rem", height: "4px", backgroundColor: "#f97316", borderRadius: "2px"}}></div>
        </div>
      </div>

      {/* Right Side */}
      <div className="auth-right-panel">
        <div className="auth-form-wrapper">
          <div className="auth-check-icon">
            <HiOutlineMailOpen />
          </div>

          <h2 className="auth-title">
            Check your email
          </h2>

          <p className="auth-subtitle">
            We&apos;ve sent a password reset link to your registered email
            address. Please click the link in that email to reset your
            password.
          </p>

          <Link to="/reset-password" className="auth-submit-btn" style={{textDecoration: "none"}}>
            Create New Password →
          </Link>
          
          <div style={{marginTop: "2rem", textAlign: "center"}}>
            <p style={{color: "#64748b", fontSize: "1rem"}}>
              Didn&apos;t receive the email?{" "}
              <span style={{fontWeight: "600", color: "#f97316", cursor: "pointer"}}>
                Resend Email
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckEmail;