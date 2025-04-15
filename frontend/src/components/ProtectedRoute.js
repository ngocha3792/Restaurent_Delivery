import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
    const auth = useAuth();
    const location = useLocation();

    if (auth.loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Đang kiểm tra xác thực...</div>;
    }

    if (!auth.isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (!auth.user || auth.user.role !== 'admin') {
        console.warn("Access Denied: User is not an admin.");
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
}

export default ProtectedRoute;