import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

// This acts as the master "shell" for the whole admin area
// It mounts the Sidebar ONCE, and displays the current page inside the main area.
const AdminLayout = () => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
            {/* The sidebar is rendered here and NEVER unmounts during navigation */}
            <Sidebar />

            {/* Outlet is where the current route's component gets injected automatically */}
            <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#f7f9fb' }}>
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
