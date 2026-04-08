// Importing necessary libraries
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear user data from local storage
        localStorage.removeItem('user');
        localStorage.removeItem('solevora_wishlist');
        // Note: Cart data is retained for guest users, but session-related data is cleared

        // Redirect the user to the login page after clearing data
        navigate('/login');
    }, [navigate]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            {/* Display a message while the logout process is happening */}
            <h2>Logging you out...</h2>
        </div>
    );
};

export default Logout;
