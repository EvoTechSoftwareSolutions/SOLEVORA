import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from '../../assets/logo.png';
import './Navbar.css';
import { useCart } from "../../context/CartContext"; 
import { useWishlist  } from "../../context/WishlistContext"; 

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    const { cartCount } = useCart(); 
    const { wishlistCount } = useWishlist();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const handleToggle = () => setMenuOpen(!menuOpen);

    // ✅ Logout function
    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token'); // remove auth token if used
        window.location.href = '/login'; // redirect to login
    };

    return (
        <header className="header-main">
            <nav className="nav-container container">
                {/* LOGO */}
                <Link to="/" className="nav-logo-link">
                    <img src={logo} alt="SoleVora Logo" className="nav-logo-img" />
                </Link>

                {/* MOBILE MENU */}
                <nav className={`nav-menu ${menuOpen ? 'mobile-active' : ''}`}>
                    <Link to="/" className={`nav-link ${location.pathname === '/' || location.pathname === '/home' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link to="/category" className={`nav-link ${location.pathname === '/category' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Category</Link>
                    <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>About</Link>
                    <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Contact</Link>

                    <div className="nav-actions">
                        <Link to="/cart" className="icon-btn responsive" onClick={() => setMenuOpen(false)}>
                            <span className="material-symbols-outlined">shopping_cart</span>
                            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        </Link>

                        <Link to={user ? "/profile" : "/login"} className="icon-btn responsive" onClick={() => setMenuOpen(false)}>
                            <span className="material-symbols-outlined">person</span>
                        </Link>

                        <Link to="/profile/wishlist" className="icon-btn responsive" onClick={() => setMenuOpen(false)}>
                            <span className="material-symbols-outlined">favorite</span>
                            {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}
                        </Link>

                        {user && (
                            <button className="icon-btn logout-nav-btn responsive" onClick={handleLogout}>
                                <span className="material-symbols-outlined">logout</span>
                            </button>
                        )}
                    </div>
                </nav>

                {/* DESKTOP MENU */}
                <div className="nav-actions">
                    <Link to="/cart" className="icon-btn desktop">
                        <span className="material-symbols-outlined">shopping_cart</span>
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </Link>

                    <Link to={user ? "/profile" : "/login"} className="icon-btn desktop">
                        <span className="material-symbols-outlined">person</span>
                    </Link>

                    <Link to={user ? "/profile/wishlist" : "/login"} className="icon-btn desktop">
                        <span className="material-symbols-outlined">favorite</span>
                        {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}
                    </Link>

                    {user && (
                        <button className="icon-btn logout-nav-btn desktop" onClick={handleLogout}>
                            <span className="material-symbols-outlined">logout</span>
                        </button>
                    )}
                </div>

                {/* MOBILE TOGGLE */}
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