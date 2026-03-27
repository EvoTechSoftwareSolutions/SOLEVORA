import React from 'react';
import { useState } from 'react';

import { MdGridView,MdLogout , MdOutlineShoppingBag , MdFavoriteBorder , MdOutlineSettings , MdOutlineLocationOn, MdPerson  } from "react-icons/md";
import { Link, Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import './ProfileLayout.css';

const ProfileLayout = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
        <MdGridView className="sidebar-icon" />
        <span className='sidebar-text'>Dashboard</span>
    </Link>

    <Link to="/profile/orders" className={`sidebar-link ${location.pathname === '/profile/orders' ? 'active' : ''}`}>
        <MdOutlineShoppingBag  className="sidebar-icon" />
        <span className='sidebar-text'>My Orders</span>
    </Link>
  <Link to="/profile/wishlist" className={`sidebar-link ${location.pathname === '/profile/wishlist' ? 'active' : ''}`}>
        <MdFavoriteBorder  className="sidebar-icon" />
<span className='sidebar-text'>Wishlist</span>   
 </Link>

      
    <Link to="/profile/account" className={`sidebar-link ${location.pathname === '/profile/account' ? 'active' : ''}`}>
        <MdOutlineSettings  className="sidebar-icon" />
        <span className='sidebar-text'>Account Settings</span>
    </Link>

    <Link to="/profile/addresses" className={`sidebar-link ${location.pathname === '/profile/addresses' ? 'active' : ''}`}>
        <MdOutlineLocationOn  className="sidebar-icon" />
        <span className='sidebar-text'>Addresses</span>
    </Link>
   
</nav>

                        <div className="sidebar-bottom-section bottom">
                            <Link to="/logout" className="logout-link">
                                 <MdLogout   className="sidebar-icon" />
                                <span className='sidebar-text'>Logout</span>
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

           
        </div>
    );
};

export default ProfileLayout;
