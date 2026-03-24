import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import "../../styles/user/UserLayout.css";
import "../../styles/user/home.css";
import {
  ShoppingCartIcon,
  UserIcon,
  HeartIcon,
  ArrowRightIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "../../components/common/icons";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const UserLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggle = () => setMenuOpen(!menuOpen);

  return (
    <div className="layout-container">
      {/* Header */}
      <header className="header">
        <nav className="navbar container">
          <Link to="/" className="navbar__logo">
            Solevera
          </Link>

          {/* Menu */}
          <ul className={`navbar__menu ${menuOpen ? "open" : ""}`}>
            <li>
              <Link to="/" className="active">Home</Link>
            </li>
            <li>
              <Link to="/category">Category</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>

            <ul className="icon-set-hide">
              <li>
                <Link to="/cart">
                  <ShoppingCartIcon className="icon" />
                </Link>
              </li>
              <li>
                <Link to="/profile">
                  <UserIcon className="icon" />
                </Link>
              </li>
              <li>
                <Link to="/favorites">
                  <HeartIcon className="icon" />
                </Link>
              </li>
            </ul>
          </ul>

          {/* Icons */}
          <div className="icon-set">
            <Link to="/cart">
              <ShoppingCartIcon className="icon" />
            </Link>
            <Link to="/profile">
              <UserIcon className="icon" />
            </Link>
            <Link to="/favorites">
              <HeartIcon className="icon" />
            </Link>
          </div>

          {/* Toggle Button */}
          <button className="navbar__toggle" onClick={handleToggle}>
            ☰
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="layout-main">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="footer">
        {/* Subscribe Section */}
        <div className="subscribe">
          <div className="subscribe-text">
            <h3>Join the Future</h3>
            <p>Subscribe for exclusive drops and 10% off your first order</p>
          </div>
          <div className="subscribe-field">
            <input
              type="text"
              placeholder="Enter Your Email"
              className="sub-input"
            />
            <button className="sub-btn">
              <ArrowRightIcon className="icon-arrow" />
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="footer-links">
          <div className="footer-main">
            <div className="contact">
              <img src="/" alt="logo" />
              <p>
                Step into the future with cutting-edge footwear designed for the
                next generation of athletes and style pioneers.
              </p>
              <div className="contact-icons">
                <div className="contact-item">
                  <MapPinIcon className="icon-size" />
                  <span>Colombo, Sri Lanka</span>
                </div>
                <div className="contact-item">
                  <PhoneIcon className="icon-size" />
                  <span>+94 77 123 4567</span>
                </div>
                <div className="contact-item">
                  <EnvelopeIcon className="icon-size" />
                  <span>info@rentnow.com</span>
                </div>
              </div>
            </div>

            {/* Right Sections */}
            <div className="right-section">
              <div className="shop-section">
                <h4>Shop</h4>
                <Link to="/new-arrivals">New Arrivals</Link>
                <Link to="/best-sellers">Best Sellers</Link>
                <Link to="/running">Running</Link>
                <Link to="/lifestyle">Lifestyle</Link>
                <Link to="/basketball">Basketball</Link>
              </div>
              <div className="support-section">
                <h4>Support</h4>
                <Link to="/contact">Contact Us</Link>
                <Link to="/faqs">FAQs</Link>
                <Link to="/shopping-info">Shopping Info</Link>
                <Link to="/returns">Returns</Link>
                <Link to="/size-guide">Size Guide</Link>
              </div>
              <div className="company-section">
                <h4>Company</h4>
                <Link to="/about">About Us</Link>
                <Link to="/careers">Careers</Link>
                <Link to="/press">Press</Link>
                <Link to="/sustainability">Sustainability</Link>
              </div>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="privacy-section">
            <div className="privacy">
              <span className="dot"></span>
              <Link to="/privacy">Privacy Policy</Link>
            </div>
            <div className="privacy">
              <span className="dot"></span>
              <Link to="/terms">Terms & Conditions</Link>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <span>© 2026 SoleVera. All rights reserved.</span>
            <div className="socialmedia">
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                <FaFacebookF />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <FaInstagram />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;