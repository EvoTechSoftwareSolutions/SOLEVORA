import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAdminAuth } from '../context/AdminAuthContext';
import './AdminLayout.css';

// This acts as the master "shell" for the whole admin area
const AdminLayout = () => {
    const { adminUser, roleName } = useAdminAuth();
console.log('role value:', adminUser?.role);
    // Generate initials for avatar fallback
      if (!adminUser) {
        return <Navigate to="/admin-login" replace />;
    }
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
                    </div>


                    <div className="admin-header-right">
                        <div className="admin-user-info">
                            <div className="admin-user-text">
                                <div className="admin-user-name">{adminUser?.name || 'Admin'}</div>
                                <div className={`admin-user-role ${adminUser?.role === 'admin' ? 'admin' : 'store_manager'}`}>
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
