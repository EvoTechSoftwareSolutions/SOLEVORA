import { Link, useNavigate } from "react-router-dom";
import forgotImage from "../assets/shoe.png";
import "./Auth.css";

function ForgotPassword() {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      {/* Left Side */}
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

      {/* Right Side */}
      <div className="auth-right-panel">
        <div className="auth-form-wrapper">
          <h2 className="auth-title">Forgot your password?</h2>
          <p className="auth-subtitle">
            No worries, it happens. Enter your email address and we&apos;ll
            send you a link to reset it.
          </p>

          <form style={{marginTop: "2rem"}}>
            <div className="auth-form-group">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrapper">
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="auth-input"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/check-email")}
              className="auth-submit-btn"
            >
              Send Reset Link →
            </button>
          </form>

          <Link to="/" className="auth-link-back">
            ← Return to Login
          </Link>
          
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