import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const isTabActive = (pathName) => {
        if (currentPath === '/' && pathName === '/') return 'active';
        if (pathName !== '/' && currentPath.includes(pathName)) return 'active';
        return '';
    };

    return (
        <div className="app-sidebar">
            <div className="app-sidebar-logo">
                <img src={logo} alt="SoleVoro Logo" style={{ width: '100%', maxWidth: '130px', height: 'auto', display: 'block', margin: '0 auto', marginTop: '-15px' }} />
            </div>

            <div className="app-nav-items">
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <div className={`app-nav-item ${isTabActive('/')}`}>
                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                        Dashboard
                    </div>
                </Link>

                <Link to="/products" style={{ textDecoration: 'none' }}>
                    <div className={`app-nav-item ${isTabActive('/products')}`}>
                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 8H3V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8z"></path>
                            <path d="M22 8v-2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2"></path>
                            <path d="M10 12h4"></path>
                        </svg>
                        Products
                    </div>
                </Link>

                <Link to="/orders" style={{ textDecoration: 'none' }}>
                    <div className={`app-nav-item ${isTabActive('/orders')}`}>
                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        Orders
                    </div>
                </Link>

                <Link to="/customers" style={{ textDecoration: 'none' }}>
                    <div className={`app-nav-item ${isTabActive('/customers')}`}>
                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M9 21v-2a4 4 0 0 1 4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <circle cx="17" cy="7" r="3"></circle>
                        </svg>
                        Customers
                    </div>
                </Link>

                <Link to="/analytics" style={{ textDecoration: 'none' }}>
                    <div className={`app-nav-item ${isTabActive('/analytics')}`}>
                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="20" x2="18" y2="10"></line>
                            <line x1="12" y1="20" x2="12" y2="4"></line>
                            <line x1="6" y1="20" x2="6" y2="14"></line>
                            <path d="M4 22h16"></path>
                        </svg>
                        Analytics
                    </div>
                </Link>
            </div>

            <div className="app-system-label">SYSTEM</div>
            <div className="app-nav-items app-system-items">
                <Link to="/settings" style={{ textDecoration: 'none' }}>
                    <div className={`app-nav-item ${isTabActive('/settings')}`}>
                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                        Settings
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
