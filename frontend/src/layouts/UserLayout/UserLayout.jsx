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
            <Link to="/cart" className="icon-btn">
              <span className="material-symbols-outlined">shopping_cart</span>
            </Link>
            <Link to="/profile" className="icon-btn">
              <span className="material-symbols-outlined">person</span>
            </Link>
            <Link to="/profile/wishlist" className="icon-btn">
              <span className="material-symbols-outlined">favorite</span>
            </Link>
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

      {/* Footer Area - Aligned to Mockup */}
      <footer className="footer-area">
        <div className="container">
          <div className="footer-top">
            <div className="footer-info">
              <div className="footer-logo-wrap">
                <img src={logo} alt="SoleVoro Logo" className="f-logo-img" />
              </div>
              <p className="f-desc">Revolutionizing the way you move. Premium footwear for the modern era.</p>
            </div>

            <div className="footer-links-grid">
              <div className="f-col">
                <h5>Shop</h5>
                <Link to="/home">New Arrivals</Link>
                <Link to="/category">Categories</Link>
                <Link to="/track-order">Track Order</Link>
              </div>
              <div className="f-col">
                <h5>Information</h5>
                <Link to="/about">About Us</Link>
                <Link to="/contact">Contact</Link>
              </div>
              <div className="f-col newsletter">
                <h5>Newsletter</h5>
                <div className="f-subscribe">
                  <input type="email" placeholder="Email address" />
                  <button>JOIN</button>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="f-copy">© 2024 SOLEVORA. ALL RIGHTS RESERVED.</p>
            <div className="f-icons">
              <span className="material-symbols-outlined">language</span>
              <span className="material-symbols-outlined">help</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;