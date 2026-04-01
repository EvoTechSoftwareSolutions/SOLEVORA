import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear logout data
        localStorage.removeItem('user');
        localStorage.removeItem('solevora_wishlist');
        // We might want to keep the cart for Guest mode, but usually logout clears session-related data
        // Redirect to login
        navigate('/login');
    }, [navigate]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <h2>Logging you out...</h2>
        </div>
    );
};

export default Logout;
