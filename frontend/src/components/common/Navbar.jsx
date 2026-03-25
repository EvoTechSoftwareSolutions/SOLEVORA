import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from '../../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    const handleToggle = () => setMenuOpen(!menuOpen);

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    return (
        <header className="header-main">
            <nav className="nav-container container">
                <Link to="/" className="nav-logo-link">
                    <img src={logo} alt="SoleVora Logo" className="nav-logo-img" />
                </Link>

                <nav className={`nav-menu ${menuOpen ? 'mobile-active' : ''}`}>
                    <Link 
                        to="/" 
                        className={`nav-link ${location.pathname === '/' || location.pathname === '/home' ? 'active' : ''}`} 
                        onClick={() => setMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link 
                        to="/category" 
                        className={`nav-link ${location.pathname === '/category' ? 'active' : ''}`} 
                        onClick={() => setMenuOpen(false)}
                    >
                        Category
                    </Link>
                    <Link 
                        to="/about" 
                        className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`} 
                        onClick={() => setMenuOpen(false)}
                    >
                        About
                    </Link>
                    <Link 
                        to="/contact" 
                        className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`} 
                        onClick={() => setMenuOpen(false)}
                    >
                        Contact
                    </Link>
                </nav>

                <div className="nav-actions">
                    <Link to="/cart" className="icon-btn">
                        <span className="material-symbols-outlined">shopping_cart</span>
                    </Link>
                    
                    {user ? (
                        <>
                            <Link to="/profile/wishlist" className="icon-btn">
                                <span className="material-symbols-outlined">favorite</span>
                            </Link>
                            <Link to="/profile" className="icon-btn profile-btn-active">
                                <span className="material-symbols-outlined">person</span>
                                <span className="user-name-abbr">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </span>
                            </Link>
                            <Link to="/logout" className="icon-btn logout-nav-btn" title="Logout">
                                <span className="material-symbols-outlined">logout</span>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="login-nav-link">Login</Link>
                            <Link to="/register" className="register-nav-btn">Sign Up</Link>
                        </>
                    )}
                    
                    <button className="mobile-toggle" onClick={handleToggle} aria-label="Toggle Menu">
                        <span className="material-symbols-outlined">
                            {menuOpen ? 'close' : 'menu'}
                        </span>
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
