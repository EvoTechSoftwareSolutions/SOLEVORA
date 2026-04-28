import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAdminAuth } from '../context/AdminAuthContext';
import logo from '../assets/logo.png';
import './Sidebar.css';
import { API_URL, BASE_URL, getImageUrl } from '../config/api';

const Sidebar = () => {
    // current route info
    const { permissions } = useAdminAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { isAdmin, logout } = useAdminAuth();
    const currentPath = location.pathname;
    // unread messages count
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const response = await axios.get(`${API_URL}/contact/unread`);
                setUnreadCount(response.data.count);
            } catch (error) {
                console.error("Error fetching unread messages count:", error);
            }
        };
        fetchUnreadCount();
        
        // Polling every 5 seconds for new messages
        const interval = setInterval(fetchUnreadCount, 5000);
        return () => clearInterval(interval);
    }, []);

    const isTabActive = (pathName) => {
        if (currentPath === '/admin' && pathName === '/admin') return 'active';
        if (pathName !== '/admin' && currentPath === pathName) return 'active';
        return '';
    };
// logout function
    const handleLogout = () => {
        logout();
        navigate('/admin-login', { replace: true });
    };

    return (
        <div className="app-sidebar">
            <div className="app-sidebar-logo">
                <img src={logo} alt="SoleVora Logo" style={{ width: '100%', maxWidth: '130px', height: 'auto', display: 'block', margin: '0 auto', marginTop: '-15px' }} />
            </div>
           {/* main navigation */}
            <div className="app-nav-items">
              {permissions.canViewDashboard && (
                 <Link to="/admin" style={{ textDecoration: 'none' }}>
                     <div className={`app-nav-item ${isTabActive('/admin')}`}>
                         <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                             <rect x="3" y="3" width="7" height="7"></rect>
                             <rect x="14" y="3" width="7" height="7"></rect>
                             <rect x="14" y="14" width="7" height="7"></rect>
                             <rect x="3" y="14" width="7" height="7"></rect>
                         </svg>
                         Dashboard
                     </div>
                 </Link>
             )}
            {/* products */}
                <Link to="/admin/products" style={{ textDecoration: 'none' }}>
                    <div className={`app-nav-item ${isTabActive('/admin/products')}`}>
                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 8H3V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8z"></path>
                            <path d="M22 8v-2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2"></path>
                            <path d="M10 12h4"></path>
                        </svg>
                        Products
                    </div>
                </Link>
                {/* stock batches */}
                <Link to="/admin/batches" style={{ textDecoration: 'none' }}>
                    <div className={`app-nav-item ${isTabActive('/admin/batches')}`}>
                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2v10m0 0l-4-4m4 4l4-4"></path>
                            <path d="M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"></path>
                        </svg>
                        Stock Batches
                    </div>
                </Link>
               {/* orders */}
                <Link to="/admin/orders" style={{ textDecoration: 'none' }}>
                    <div className={`app-nav-item ${isTabActive('/admin/orders')}`}>
                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        Orders
                    </div>
                </Link>
                {/* customers */}
                <Link to="/admin/customers" style={{ textDecoration: 'none' }}>
                    <div className={`app-nav-item ${isTabActive('/admin/customers')}`}>
                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M9 21v-2a4 4 0 0 1 4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <circle cx="17" cy="7" r="3"></circle>
                        </svg>
                        Customers
                    </div>
                </Link>
                {/* messages with unread badge */}
                <Link to="/admin/messages" style={{ textDecoration: 'none' }}>
                    <div className={`app-nav-item ${isTabActive('/admin/messages')}`} style={{ position: 'relative' }}>
                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        Messages
                        {unreadCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                right: '15px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                backgroundColor: '#f66d3b',
                                color: 'white',
                                borderRadius: '50%',
                                padding: '2px 8px',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}>
                                {unreadCount}
                            </span>
                        )}
                    </div>
                </Link>
                {/* newsletter */}
                <Link to="/admin/newsletter" style={{ textDecoration: 'none' }}>
                    <div className={`app-nav-item ${isTabActive('/admin/newsletter')}`}>
                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        Newsletter
                    </div>
                </Link>
               {/* promo codes */}
             {permissions.canManagePromoCodes && (
                 <Link to="/admin/promo-codes" style={{ textDecoration: 'none' }}>
                     <div className={`app-nav-item ${isTabActive('/admin/promo-codes')}`}>
                         <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                             <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                             <line x1="7" y1="7" x2="7.01" y2="7"></line>
                         </svg>
                         Promo Codes
                     </div>
                 </Link>
             )}
                {/* inventory report */}
             {permissions.canViewInventory && (
                 <Link to="/admin/inventory-report" style={{ textDecoration: 'none' }}>
                     <div className={`app-nav-item ${isTabActive('/admin/inventory-report')}`}>
                         <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                             <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                             <polyline points="14 2 14 8 20 8"></polyline>
                             <line x1="16" y1="13" x2="8" y2="13"></line>
                             <line x1="16" y1="17" x2="8" y2="17"></line>
                             <polyline points="10 9 9 9 8 9"></polyline>
                         </svg>
                         Inventory Report
                     </div>
                 </Link>
             )}
               {/* analytics */}
             {permissions.canViewAnalytics && (
                 <Link to="/admin/analytics" style={{ textDecoration: 'none' }}>
                     <div className={`app-nav-item ${isTabActive('/admin/analytics')}`}>
                         <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                             <line x1="18" y1="20" x2="18" y2="10"></line>
                             <line x1="12" y1="20" x2="12" y2="4"></line>
                             <line x1="6" y1="20" x2="6" y2="14"></line>
                             <path d="M4 22h16"></path>
                         </svg>
                         Analytics
                     </div>
                 </Link>
             )}
            </div>

            {/* SYSTEM section — Settings only for admin, Security for all */}
            <div className="app-system-label">SYSTEM</div>
            <div className="app-nav-items app-system-items">
                 {permissions.canManageSettings && (
                     <Link to="/admin/settings" style={{ textDecoration: 'none' }}>
                         <div className={`app-nav-item ${isTabActive('/admin/settings')}`}>
                             <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                 <circle cx="12" cy="12" r="3"></circle>
                                 <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                             </svg>
                             Settings
                         </div>
                     </Link>
                 )}

                {/* Security — visible to all roles */}
                <Link to="/admin/security" style={{ textDecoration: 'none' }}>
                    <div className={`app-nav-item ${isTabActive('/admin/security')}`}>
                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        Security
                    </div>
                </Link>

                {/* Logout */}
                <div className="app-nav-item app-nav-logout" onClick={handleLogout}>
                    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Logout
                </div>
            </div>

        </div>
    );
};

export default Sidebar;
