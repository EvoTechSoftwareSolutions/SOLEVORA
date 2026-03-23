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
      {/* Top Navigation Bar - Unified Professionals Header */}
      <header className="header-main">
        <nav className="nav-container container">
          <Link to="/" className="nav-logo-link">
            <img src={logo} alt="SoleVoro Logo" className="nav-logo-img" />
          </Link>

          <nav className="nav-menu">
            <Link to="/" className={`nav-link ${location.pathname === '/' || location.pathname === '/home' ? 'active' : ''}`}>Home</Link>
            {/* Keeping Category as it has a placeholder */}
            <Link to="/category" className={`nav-link ${location.pathname === '/category' ? 'active' : ''}`}>Category</Link>
            {/* Removed About and Contact as they don't have routes/pages yet */}
          </nav>

          <div className="nav-actions">
            {/* Only including links that have proper routes */}
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

      {/* Footer Area */}
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
              </div>
              <div className="f-col">
                <h5>My Account</h5>
                <Link to="/profile/dashboard">Dashboard</Link>
                <Link to="/profile/orders">Active Orders</Link>
                <Link to="/profile/wishlist">Favorites</Link>
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