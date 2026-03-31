import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  // Check if user is logged in (standardized across the app)
  const isAuthenticated = localStorage.getItem('user') !== null || 
                        localStorage.getItem('isAuthenticated') === 'true' || 
                        sessionStorage.getItem('isAuthenticated') === 'true';


  if (!isAuthenticated) {
    // Redirect to login page with a return URL
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;
