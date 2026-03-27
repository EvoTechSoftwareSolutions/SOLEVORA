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
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', minHeight: '60vh', gap: 12,
                fontFamily: 'Inter, sans-serif'
            }}>
                <div style={{ fontSize: 48 }}>🔒</div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', margin: 0 }}>Access Restricted</h2>
                <p style={{ fontSize: 14, color: '#888', margin: 0, textAlign: 'center', maxWidth: 320 }}>
                    This section is only accessible to <strong>System Admins</strong>.<br />
                    Contact your administrator if you need access.
                </p>
            </div>
        );
    }

    return children;
};

export default AdminRoute;
