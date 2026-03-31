import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import footerLogo from '../../assets/logo.png';
import SuccessPopup from "./SuccessPoppup";
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
const [popupType, setPopupType] = useState("success");
  const handleSubscribe = async () => {
    if (!email) {
    setMessage("Please enter your email");
    setPopupType("error");
    setShowPopup(true);
    return;
  }

    setLoading(true); 

    try {
      const res = await axios.post("http://localhost:5000/api/newsletter/subscribe", { email });

      setMessage(res.data.message || "Thank you for subscribing!");
      setShowPopup(true);
      setPopupType("success");
      setEmail("");
    } catch (err) {
      setMessage("Error subscribing. Please try again.");
      setShowPopup(true);
    } finally {
      setLoading(false);
      setPopupType("error"); 
    }
  };

  return (
    <>
       {showPopup && (
             <SuccessPopup
               message={message}
               onClose={() => setShowPopup(false)}
             />
           )}
      <footer className="footer-area">
        {/* Newsletter Strip */}
       <div className="footer-newsletter">
          <div className="footer-container newsletter-row">
            <div className="newsletter-left">
              <h3 className="newsletter-title">Join the Future</h3>
              <p className="newsletter-subtitle">
                Subscribe for exclusive drops and 10% off your first order.
              </p>
            </div>
            <div className="newsletter-right">
              <div className="newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading} 
                />
                <button
                  className="newsletter-submit"
                  aria-label="Subscribe"
                  onClick={handleSubscribe}
                  disabled={loading} 
                >
                  {loading ? (
                    <span className="loader"></span> 
                  ) : (
                    <span className="material-symbols-outlined">arrow_forward</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Section */}
        <div className="footer-main-section">
          <div className="footer-container main-footer-row">
            {/* Brand Column */}
            <div className="footer-brand-col">
              <Link to="/" className="footer-logo">
                <img src={footerLogo} alt="SoleVora Logo" />
              </Link>
              <p className="brand-description">
                Step into the future with cutting-edge footwear designed for the
                next generation of athletes and style pioneers.
              </p>
              <div className="footer-contact-info">
                <div className="contact-item">
                  <span className="material-symbols-outlined icon-orange">location_on</span>
                  <span>123 Future Street, Tech City, TC 12345</span>
                </div>
                <div className="contact-item">
                  <span className="material-symbols-outlined icon-orange">call</span>
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="contact-item">
                  <span className="material-symbols-outlined icon-orange">mail</span>
                  <span>hello@solevoro.com</span>
                </div>
              </div>
            </div>

            {/* Links Columns */}
            <div className="footer-links-grid">
              <div className="link-column">
                <h4>Shop</h4>
                <Link to="/category">New Arrivals</Link>
                <Link to="/category">Best Sellers</Link>
                <Link to="/category">Running</Link>
                <Link to="/category">Lifestyle</Link>
                <Link to="/category">Basketball</Link>
              </div>
              <div className="link-column">
                <h4>Support</h4>
                <Link to="/contact">Contact Us</Link>
                <Link to="/faq">FAQs</Link>
                <Link to="/shipping">Shipping Info</Link>
                <Link to="/returns">Returns</Link>
                <Link to="/size-guide">Size Guide</Link>
              </div>
              <div className="link-column">
                <h4>Company</h4>
                <Link to="/about">About Us</Link>
                <Link to="/careers">Careers</Link>
                <Link to="/press">Press</Link>
                <Link to="/sustainability">Sustainability</Link>
              </div>
            </div>
          </div>

          {/* Legal Bar */}
          <div className="footer-container legal-bar">
            <div className="legal-links">
              <span className="dot"></span>
              <Link to="/privacy">Privacy & Policy</Link>
              <span className="dot"></span>
              <Link to="/terms">Terms & Conditions</Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-container bottom-row">
            <p className="copyright">© 2026 SoleVora. All rights reserved.</p>
            <div className="social-links">
              <a href="#" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="#" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>
              <a href="#" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
