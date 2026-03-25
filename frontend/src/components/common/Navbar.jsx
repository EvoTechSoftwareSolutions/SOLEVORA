import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from '../../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const handleToggle = () => setMenuOpen(!menuOpen);

  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  return (
    <header className="header-main">
      <nav className="nav-container container">
        <Link to="/" className="nav-logo-link">
          <img src={logo} alt="SoleVoro Logo" className="nav-logo-img" />
        </Link>

        <nav className={`nav-menu ${menuOpen ? 'mobile-active' : ''}`}>
          <Link to="/" className={`nav-link ${location.pathname === '/' || location.pathname === '/home' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/category" className={`nav-link ${location.pathname === '/category' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Category</Link>
          <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Contact</Link>
      <div className="nav-actions">
          {user ? (
            <>
              <Link to="/cart" className="icon-btn responsive">
                <span className="material-symbols-outlined">shopping_cart</span>
              </Link>
              <Link to="/profile" className="icon-btn responsive">
                <span className="material-symbols-outlined">person</span>
              </Link>
              <Link to="/profile/wishlist" className="icon-btn responsive">
                <span className="material-symbols-outlined">favorite</span>
              </Link>
              <Link to="/logout" className="icon-btn logout-nav-btn responsive" title="Logout">
                <span className="material-symbols-outlined">logout</span>
              </Link>
            </>
          ) : (
            <>
              <Link to="/cart" className="icon-btn responsive">
                <span className="material-symbols-outlined">shopping_cart</span>
              </Link>
              <Link to="/login" className="icon-btn responsive">
                <span className="material-symbols-outlined">person</span>
              </Link>
              <Link to="/login" className="icon-btn responsive">
                <span className="material-symbols-outlined">favorite</span>
              </Link>
            </>
          )}
        </div>
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <Link to="/cart" className="icon-btn desktop">
                <span className="material-symbols-outlined">shopping_cart</span>
              </Link>
              <Link to="/profile" className="icon-btn desktop">
                <span className="material-symbols-outlined">person</span>
              </Link>
              <Link to="/profile/wishlist" className="icon-btn desktop">
                <span className="material-symbols-outlined">favorite</span>
              </Link>
              <Link to="/logout" className="icon-btn logout-nav-btn desktop" title="Logout">
                <span className="material-symbols-outlined">logout</span>
              </Link>
            </>
          ) : (
            <>
              <Link to="/cart" className="icon-btn desktop">
                <span className="material-symbols-outlined">shopping_cart</span>
              </Link>
              <Link to="/login" className="icon-btn desktop">
                <span className="material-symbols-outlined">person</span>
              </Link>
              <Link to="/login" className="icon-btn desktop">
                <span className="material-symbols-outlined ">favorite</span>
              </Link>
            </>
          )}
         
        </div>
         <button className="mobile-toggle" onClick={handleToggle}>
            <span className="material-symbols-outlined">
                {menuOpen ? 'close' : 'menu'}
            </span>
          </button>
      </nav>
    </header>
  );
};

export default Navbar;
