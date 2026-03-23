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

  const handleToggle = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <div className="layout-container">
      <header className="header">
        <nav className="navbar container">
          <a href="#" className="navbar__logo">
            Solevera
          </a>

          <ul className={`navbar__menu ${menuOpen ? "open" : ""}`}>
            <li>
              <a href="index.html" className="active">
                Home
              </a>
            </li>
            <li>
              <a href="pages/service.html">Category</a>
            </li>
            <li>
              <a href="pages/about.html">About Us</a>
            </li>
            <li>
              <a href="pages/contact.html">Contact</a>
            </li>
            <ul className="icon-set-hide">
              <a href="/cart">
                <ShoppingCartIcon className="icon" />
              </a>
              <a href="/profile">
                <UserIcon className="icon" />
              </a>
              <a href="/profile">
                <HeartIcon className="icon" />
              </a>
            </ul>
          </ul>

          <div className="icon-set">
            <a href="/cart">
              <ShoppingCartIcon className="icon" />
            </a>
            <a href="/profile">
              <UserIcon className="icon" />
            </a>
            <a href="/favorites">
              <HeartIcon className="icon" />
            </a>
          </div>

          <button className="navbar__toggle" onClick={handleToggle}>
            ☰
          </button>
        </nav>
      </header>

      <main className="layout-main">
        <Outlet />
      </main>

      <footer className="footer">
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
        <div className="footer-links">
          <div className="footer-main">
            <div className="contact">
              <img src="/" alt="image" />
              <p>
                Step into the future with cutting-edge footwear designed for the
                next generation of athletes and style pioneers.
              </p>
              <div className="contact-icons">
                <div className="contact-item">
                  <MapPinIcon className="icon-size" />
                  <a href="">Colombo, Sri Lanka</a>
                </div>

                <div className="contact-item">
                  <PhoneIcon className="icon-size" />
                  <a href="">+94 77 123 4567</a>
                </div>

                <div className="contact-item">
                  <EnvelopeIcon className="icon-size" />
                  <a href="">info@rentnow.com</a>
                </div>
              </div>
            </div>
            <div className="right-section">
              <div className="shop-section">
                <h4>Shop</h4>
                <a href="">New Arrivals</a>
                <a href="">Best Sellers</a>
                <a href="">Running</a>
                <a href="">lifestyle</a>
                <a href="">Basketball</a>
              </div>
              <div className="support-section">
                <h4>Support</h4>
                <a href="">Contact Us</a>
                <a href="">FAQs</a>
                <a href="">Shopping Info</a>
                <a href="">Returns</a>
                <a href="">Size guide</a>
              </div>
              <div className="company-section">
                <h4>Company</h4>
                <a href="">About Us</a>
                <a href="">Careers</a>
                <a href="">Press</a>
                <a href="">Sustainablity</a>
              </div>
            </div>
          </div>
          <div className="privacy-section">
            <div className="privacy">
              <span className="dot"></span>
              <a href="/privacy">Privacy Policy</a>
            </div>

            <div className="privacy">
              <span className="dot"></span>
              <a href="/privacy">Terms & Conditions</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 SoleVera. All rights reserved.</span>

            <div className="socialmedia">
              <a href="#">
                <FaFacebookF />
              </a>
              <a href="#">
                <FaInstagram />
              </a>
              <a href="#">
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
