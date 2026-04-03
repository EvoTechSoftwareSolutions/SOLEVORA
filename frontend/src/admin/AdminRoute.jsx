import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

/**
 * AdminRoute – wraps admin pages requiring authentication.
 * 
 * Props:
 *   children       – the page component to render
 *   adminOnly      – if true, only 'admin' role passes; store_manager gets 403
 */
const AdminRoute = ({ children, adminOnly = false }) => {
    const { adminUser, isAdmin } = useAdminAuth();
    const location = useLocation();

    // Not logged in → redirect to admin login
    if (!adminUser) {
        return <Navigate to="/admin-login" state={{ from: location }} replace />;
    }

    // Admin-only route but user is store_manager → show access denied
    if (adminOnly && !isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 font-inter">
                <div className="text-4xl">🔒</div>
                <h2 className="text-20 font-bold text-gray-900">Access Restricted</h2>
                <p className="text-14 text-gray-800">
                    This section is only accessible to <strong>System Admins</strong>.<br />
                    Contact your administrator if you need access.
                </p>
            </div>
        );
    }

    return children;
};

export default AdminRoute;
