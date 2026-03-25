import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import logo from '../../assets/logo.png';
import "../../styles/user/UserLayout.css";
import "../../styles/user/Home.css";

const UserLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const handleToggle = () => setMenuOpen(!menuOpen);

  return (
    <div className="layout-wrapper">
      {/* Top Navigation Bar - Matching Mockup Precisely */}
      <header className="header-main">
        <nav className="nav-container container">
          <Link to="/" className="nav-logo-link">
            <img src={logo} alt="SoleVoro Logo" className="nav-logo-img" />
          </Link>

          <nav className="nav-menu">
            <Link to="/" className={`nav-link ${location.pathname === '/' || location.pathname === '/home' ? 'active' : ''}`}>Home</Link>
            <Link to="/category" className={`nav-link ${location.pathname === '/category' ? 'active' : ''}`}>Category</Link>
            <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About</Link>
            <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
          </nav>

          <div className="nav-actions">
            {localStorage.getItem('user') ? (
              <>
                <Link to="/cart" className="icon-btn">
                  <span className="material-symbols-outlined">shopping_cart</span>
                </Link>
                <Link to="/profile/wishlist" className="icon-btn">
                  <span className="material-symbols-outlined">favorite</span>
                </Link>
                <Link to="/profile" className="icon-btn profile-btn-active">
                  <span className="material-symbols-outlined">person</span>
                  <span className="user-name-abbr">
                    {JSON.parse(localStorage.getItem('user')).name?.charAt(0) || 'U'}
                  </span>
                </Link>
                <Link to="/logout" className="icon-btn logout-nav-btn" title="Logout">
                  <span className="material-symbols-outlined">logout</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/cart" className="icon-btn">
                  <span className="material-symbols-outlined">shopping_cart</span>
                </Link>
                <Link to="/login" className="login-nav-link">Login</Link>
                <Link to="/register" className="register-nav-btn">Sign Up</Link>
              </>
            )}
            <button className="mobile-toggle" onClick={handleToggle}>
              ☰
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="footer-area">

        {/* Newsletter Strip */}
        <div className="footer-newsletter">
          <div className="footer-container newsletter-row">
            <div className="newsletter-text">
              <h3>Join the Future</h3>
              <p>Subscribe for exclusive drops and 10% off your first order.</p>
            </div>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button aria-label="Subscribe">
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="footer-links">
          <div className="footer-container footer-grid">
            <div className="contact">
              <img src={logo} alt="SoleVora Logo" className="f-logo" />
              <p className="f-brand-desc">
                Step into the future with cutting-edge footwear designed for the
                next generation of athletes and style pioneers.
              </p>
              <div className="contact-details">
                <div className="contact-item">
                  <span className="material-symbols-outlined">location_on</span>
                  <span>123 Future Street, Tech City, TC 12345</span>
                </div>
                <div className="contact-item">
                  <span className="material-symbols-outlined">call</span>
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="contact-item">
                  <span className="material-symbols-outlined">mail</span>
                  <span>hello@solevoro.com</span>
                </div>
              </div>
            </div>

            {/* Shop */}
            <div className="f-col">
              <h5>Shop</h5>
              <Link to="/category">New Arrivals</Link>
              <Link to="/category">Best Sellers</Link>
              <Link to="/category">Running</Link>
              <Link to="/category">Lifestyle</Link>
              <Link to="/category">Basketball</Link>
            </div>

            {/* Support */}
            <div className="f-col">
              <h5>Support</h5>
              <Link to="/contact">Contact Us</Link>
              <Link to="/faq">FAQs</Link>
              <Link to="/shipping">Shipping Info</Link>
              <Link to="/returns">Returns</Link>
              <Link to="/size-guide">Size Guide</Link>
            </div>

            {/* Company */}
            <div className="f-col">
              <h5>Company</h5>
              <Link to="/about">About Us</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/press">Press</Link>
              <Link to="/sustainability">Sustainability</Link>
            </div>
          </div>

          {/* Legal Row (inside dark main footer) */}
          <div className="footer-container footer-legal-row">
            <div className="legal-links">
              <span className="legal-dot">•</span>
              <Link to="/privacy">Privacy &amp; Policy</Link>
              <span className="legal-dot">•</span>
              <Link to="/terms">Terms &amp; Conditions</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-container bottom-bar-row">
            <p className="f-copy">© 2026 SoleVora. All rights reserved.</p>
            <div className="social-links">
              {/* Instagram */}
              <a href="#" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              {/* Twitter / X */}
              <a href="#" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* Facebook */}
              <a href="#" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.514c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

      </footer>
    </div>
  );
};

export default UserLayout;