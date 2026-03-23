import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './AdminLayout.css';

// This acts as the master "shell" for the whole admin area
const AdminLayout = () => {
    return (
        <div className="admin-layout-container">
            {/* The sidebar is rendered here and NEVER unmounts during navigation */}
            <Sidebar />

            <div className="admin-main-wrapper">
                {/* Extracted Shared Header (Proper Navigation) */}
                <header className="admin-top-header">
                    <div className="admin-header-left">
                        <div className="admin-header-search">
                            <svg className="admin-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input type="text" placeholder="Search orders, customers, products..." />
                        </div>
                    </div>

                    <div className="admin-header-right">
                        <button className="admin-icon-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                        </button>
                        <div className="admin-user-info">
                            <div className="admin-user-text">
                                <div className="admin-user-name">Marcus Veridi</div>
                                <div className="admin-user-role">Store Admin</div>
                            </div>
                            <div className="admin-user-avatar">
                                <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="User Avatar" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content Container */}
                <main className="admin-page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
