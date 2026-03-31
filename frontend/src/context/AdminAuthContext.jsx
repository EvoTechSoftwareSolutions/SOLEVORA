import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
    const [adminUser, setAdminUser] = useState(() => {
        try {
            const stored = localStorage.getItem('adminUser');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        if (adminUser?.id) {
            axios.defaults.headers.common['x-admin-id'] = adminUser.id;
        } else {
            delete axios.defaults.headers.common['x-admin-id'];
        }
    }, [adminUser]);

    const login = (userData) => {
        localStorage.setItem('adminUser', JSON.stringify(userData));
        setAdminUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('adminUser');
        setAdminUser(null);
    };

    const isAdmin        = adminUser?.role === 'admin';
    const isStoreManager = adminUser?.role === 'store_manager';
    const hasStoreAccess = isAdmin || isStoreManager;
    const roleName       = adminUser?.role === 'admin' ? 'System Admin' : adminUser?.role === 'store_manager' ? 'Store Manager' : null;

    return (
        <AdminAuthContext.Provider value={{ adminUser, login, logout, isAdmin, isStoreManager, hasStoreAccess, roleName }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => {
    const ctx = useContext(AdminAuthContext);
    if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
    return ctx;
};

export default AdminAuthContext;
