import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAdminAuth } from '../context/AdminAuthContext';
import './AdminLayout.css';

// This acts as the master "shell" for the whole admin area
const AdminLayout = () => {
    const { adminUser, roleName } = useAdminAuth();

    // Generate initials for avatar fallback
    const initials = adminUser?.name
        ? adminUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'AD';

    return (
        <div className="admin-layout-container">
            {/* The sidebar is rendered here and NEVER unmounts during navigation */}
            <Sidebar />

            <div className="admin-main-wrapper">
                {/* Extracted Shared Header */}
                <header className="admin-top-header">
                    <div className="admin-header-left">
                        <div className="admin-header-search">
                            <svg className="admin-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input type="text" placeholder="Search orders, customers, products..." />
                        </div>
                    </div>

                    <div className="admin-header-right">
                        <div className="admin-user-info">
                            <div className="admin-user-text">
                                <div className="admin-user-name">{adminUser?.name || 'Admin'}</div>
                                <div className={`admin-user-role ${adminUser?.role === 'admin' ? 'role-admin' : 'role-manager'}`}>
                                    {roleName || 'Staff'}
                                </div>
                            </div>
                            <div className="admin-user-avatar">
                                <div className="admin-avatar-initials">{initials}</div>
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
