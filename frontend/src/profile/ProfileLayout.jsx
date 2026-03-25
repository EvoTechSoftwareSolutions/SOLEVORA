import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import './ProfileLayout.css';

const ProfileLayout = () => {
    const location = useLocation();

    return (
        <div className="profile-layout-wrapper">
            <Navbar />
            
            <div className="profile-main-wrapper">
                {/* Sidebar */}
                <aside className="profile-sidebar">
                    <div className="profile-sidebar-content">
                        {/* Profile Section */}
                        <div className="sidebar-user-section">
                            <div className="sidebar-avatar-wrapper">
                                <img 
                                    className="sidebar-avatar-img" 
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" 
                                    alt="User Avatar" 
                                />
                                <div className="sidebar-status-check">
                                    <span className="material-symbols-outlined">check</span>
                                </div>
                            </div>
                            <div className="sidebar-user-info">
                                <h4>{(() => {
                                    const userStr = localStorage.getItem("user");
                                    if (userStr) return JSON.parse(userStr).name;
                                    return "Valued Customer";
                                })()}</h4>
                                <p className="sidebar-user-membership">Gold Member</p>
                            </div>
                        </div>

                        {/* Sidebar Links */}
                        <nav className="sidebar-nav">
                            <Link to="/profile/dashboard" className={`sidebar-link ${location.pathname === '/profile/dashboard' ? 'active' : ''}`}>
                                <span className="material-symbols-outlined">grid_view</span>
                                <span>Dashboard</span>
                            </Link>

                            <Link to="/profile/orders" className={`sidebar-link ${location.pathname === '/profile/orders' ? 'active' : ''}`}>
                                <span className="material-symbols-outlined">shopping_bag</span>
                                <span>My Orders</span>
                            </Link>

                            <Link to="/profile/wishlist" className={`sidebar-link ${location.pathname === '/profile/wishlist' ? 'active' : ''}`}>
                                <span className="material-symbols-outlined">favorite</span>
                                <span>Wishlist</span>
                            </Link>

                            <Link to="/profile/account" className={`sidebar-link ${location.pathname === '/profile/account' ? 'active' : ''}`}>
                                <span className="material-symbols-outlined">settings_applications</span>
                                <span>Account Settings</span>
                            </Link>

                            <Link to="/profile/addresses" className={`sidebar-link ${location.pathname === '/profile/addresses' ? 'active' : ''}`}>
                                <span className="material-symbols-outlined">location_on</span>
                                <span>Addresses</span>
                            </Link>
                        </nav>

                        <div className="sidebar-bottom-section">
                            <Link to="/logout" className="logout-link">
                                <span className="material-symbols-outlined">logout</span>
                                <span>Logout</span>
                            </Link>
                        </div>
                    </div>

                    {/* Exclusive Offer Card */}
                    <div className="sidebar-offer-card">
                        <div className="offer-card-inner">
                            <div className="offer-bg-icon">
                                <span className="material-symbols-outlined">local_offer</span>
                            </div>
                            <p className="offer-label">Exclusive Offer</p>
                            <h5 className="offer-title">20% Off New Releases</h5>
                            <p className="offer-desc">Use code <span className="offer-code">SOLEVORA20</span> at checkout.</p>
                            <button className="shop-now-btn">Shop Now</button>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="profile-content-area">
                    <Outlet />
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default ProfileLayout;
