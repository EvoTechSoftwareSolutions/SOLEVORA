import { useState } from "react";
import { Link } from "react-router-dom";
import { LuEye, LuCircleCheck, LuCircle } from "react-icons/lu";
import resetImage from "../assets/reset-password.png";
import "./Auth.css";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const hasMinLength = newPassword.length >= 8;
  const hasSpecialAndNumber =
    /[0-9]/.test(newPassword) && /[^A-Za-z0-9]/.test(newPassword);

  return (
    <div className="auth-container">
      {/* Left Side */}
      <div className="auth-left-panel">
        <img
          src={resetImage}
          alt="Reset Password"
          className="auth-image"
        />
        <div className="auth-overlay"></div>
        <div className="auth-overlay-content">
          <h1 className="auth-heading-img">
            Redefining the
            <br />
            <span style={{color: "#f97316"}}>Kinetic</span> Standard.
          </h1>
          <p className="auth-subheading-img">
            Performance meets luxury. Secure your account to access
            our curated archive of high-utility footwear.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="auth-right-panel">
        <div className="auth-form-wrapper">
          <h2 className="auth-title">
            Set a new<br />password
          </h2>
          <p className="auth-subtitle">
            Your new password must be different from previous passwords
            to ensure maximum security.
          </p>

          <form style={{marginTop: "2rem"}}>
            {/* New Password */}
            <div className="auth-form-group">
              <label className="auth-label">New Password</label>
              <div className="auth-input-wrapper">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="auth-input"
                />
                <LuEye className="auth-icon" />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="auth-form-group">
              <label className="auth-label">Confirm Password</label>
              <div className="auth-input-wrapper">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="auth-input"
                />
                <LuEye className="auth-icon" />
              </div>
            </div>

            {/* Security Check Box */}
            <div className="auth-security-box">
              <div className="auth-security-title">
                <span>ⓘ</span> Security Check
              </div>

              <div style={{marginTop: "1rem"}}>
                <div className="auth-security-item">
                  {hasMinLength ? (
                    <LuCircleCheck style={{color: "#22c55e", fontSize: "1.25rem"}} />
                  ) : (
                    <LuCircle style={{color: "#94a3b8", fontSize: "1.25rem"}} />
                  )}
                  <span>At least 8 characters long</span>
                </div>

                <div className="auth-security-item">
                  {hasSpecialAndNumber ? (
                    <LuCircleCheck style={{color: "#22c55e", fontSize: "1.25rem"}} />
                  ) : (
                    <LuCircle style={{color: "#94a3b8", fontSize: "1.25rem"}} />
                  )}
                  <span>One special character &amp; number</span>
                </div>
              </div>
            </div>

            <button type="button" className="auth-submit-btn">
              Reset Password →
            </button>
          </form>

          <Link to="/" className="auth-link-back">
            ← Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;