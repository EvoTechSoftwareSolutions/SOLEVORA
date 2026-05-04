import React, { useEffect, useState, useMemo } from 'react';

import { MdGridView, MdLogout, MdOutlineShoppingBag, MdFavoriteBorder, MdOutlineSettings, MdOutlineLocationOn } from "react-icons/md";
import { Link, Outlet, useLocation } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import './ProfileLayout.css';

const ProfileLayout = () => {
    const location = useLocation();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const displayName = useMemo(() => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) return JSON.parse(userStr).name;
        } catch (_) { /* ignore */ }
        return 'Valued Customer';
    }, [location.pathname]);

    useEffect(() => {
        setDrawerOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (drawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [drawerOpen]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') setDrawerOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    useEffect(() => {
        const mq = window.matchMedia('(min-width: 769px)');
        const closeIfDesktop = () => {
            if (mq.matches) setDrawerOpen(false);
        };
        mq.addEventListener('change', closeIfDesktop);
        closeIfDesktop();
        return () => mq.removeEventListener('change', closeIfDesktop);
    }, []);

    return (
        <div className="profile-layout-wrapper">
            <Navbar />
            
            <div className="profile-main-wrapper">
                <header className="profile-mobile-top-bar" aria-label="Profile navigation">
                    <div className="container profile-mobile-top-inner">
                        <button
                            type="button"
                            className={`profile-drawer-toggle ${drawerOpen ? 'is-active' : ''}`}
                            aria-expanded={drawerOpen}
                            aria-controls="profile-sidebar-drawer"
                            aria-label={drawerOpen ? 'Close profile menu' : 'Open profile menu'}
                            onClick={() => setDrawerOpen((o) => !o)}
                        >
                            <span className="material-symbols-outlined" aria-hidden="true">
                                {drawerOpen ? 'close' : 'person'}
                            </span>
                        </button>
                        <div className="profile-mobile-top-user">
                            <div className="profile-mobile-top-avatar" aria-hidden="true">
                                <img
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus"
                                    alt=""
                                />
                            </div>
                            <div className="profile-mobile-top-names">
                                <span className="profile-mobile-top-name">{displayName}</span>
                                <span className="profile-mobile-top-tier">Gold member</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div
                    className={`profile-drawer-backdrop ${drawerOpen ? 'is-visible' : ''}`}
                    onClick={() => setDrawerOpen(false)}
                    aria-hidden={!drawerOpen}
                />

                {/* Sidebar / drawer */}
                <aside
                    id="profile-sidebar-drawer"
                    className={`profile-sidebar ${drawerOpen ? 'is-drawer-open' : ''}`}
                >
                    <div className="profile-drawer-panel-header">
                        <span className="profile-drawer-panel-title">My account</span>
                        <button
                            type="button"
                            className="profile-drawer-close"
                            onClick={() => setDrawerOpen(false)}
                            aria-label="Close menu"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
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
                                <h4>{displayName}</h4>
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
                            <Link to="/category" className="shop-now-btn">Shop Now</Link>
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
