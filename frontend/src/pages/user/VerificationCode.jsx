// VerificationCode Component - 6-digit verification code input interface
// Handles phone number verification with auto-focus and timer functionality
// Features security banner, resend code option, and keyboard navigation
// Used for two-factor authentication during checkout process
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../../styles/user/VerificationCode.css';

const VerificationCode = () => {
  // navigation
  const navigate = useNavigate();
  const location = useLocation();
  // store 6-digit code
  const [code, setCode] = useState(['', '', '', '', '', '']);
  // resend timer
  const [timer, setTimer] = useState(30);

  // Countdown timer effect
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);
// handle typing in input boxes
  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto focus next input when digit is entered
      if (value !== '' && index < 5) {
        const nextInput = document.getElementById(`code-input-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };
// handle backspace navigation
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };
// verify code
  const handleVerify = () => {
    const fullCode = code.join('');
    if (fullCode.length === 6) {
      navigate('/order-success', { state: location.state });
    } else {
      alert('Please enter all 6 digits.');
    }
  };
// format timer (mm:ss)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Main component render
  return (
    <div className="vc-page">
      <div className="vc-container">
        
        {/* Timer icon */}
        <div className="vc-icon-wrap">
          <div className="vc-icon-bg">
            <span className="material-symbols-outlined vc-clock">timer</span>
          </div>
        </div>

        {/* Page header */}
        <h1 className="vc-title">Verification Code</h1>
        <p className="vc-subtitle">
          We have sent a 6-digit code to <span className="vc-phone">+1 (555) 000-0000</span>
        </p>

        {/* 6-digit code input boxes */}
        <div className="vc-inputs">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-input-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="vc-code-field"
              autoFocus={index === 0}
            />
          ))}
        </div>

        {/* Verify button */}
        <button className="vc-verify-btn" onClick={handleVerify}>
          Verify & Proceed
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>

        {/* Resend code section with timer */}
        <div className="vc-resend-row">
          <span className="vc-gray-text">Didn't receive code?</span>
          <button 
            className="vc-resend-btn" 
            onClick={() => setTimer(30)}
            disabled={timer > 0}
          >
            Resend Code
          </button>
          <span className="vc-divider">|</span>
          <span className="vc-timer">{formatTime(timer)}s</span>
        </div>

        {/* Back to payment link */}
        <div className="vc-back-action">
          <Link to="/payment" className="vc-back-link">
            <span className="material-symbols-outlined">arrow_back</span>
            Change Phone Number
          </Link>
        </div>

        {/* Security banner with trust indicators */}
        <div className="vc-security-banner">
          <div className="vc-banner-content">
             {/* Security icons */}
             <div className="vc-banner-icons">
               <span className="material-symbols-outlined vc-banner-icon">check_circle</span>
               <span className="material-symbols-outlined vc-banner-icon">lock</span>
               <span className="material-symbols-outlined vc-banner-icon">phone_iphone</span>
               <span className="material-symbols-outlined vc-banner-icon">verified_user</span>
             </div>
             <p className="vc-security-label">SECURITY FIRST</p>
             <p className="vc-security-text">
                Your account security is our priority. Please do not share this code with anyone.
             </p>
          </div>
          <div className="vc-banner-visual">
             {/* Shoe image placeholder in banner */}
             <div className="vc-shoe-mask"></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VerificationCode; // Export VerificationCode component
