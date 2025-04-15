// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/LoginPage/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import ManageIngredientsPage from './pages/ManagerIngredientPage/ManagerIngredientPage'; 
import ManageInventoryLogsPage from './pages/ManagerInventoryLogPage/ManagerInventoryLogPage'; 
import NotFoundPage from './pages/NotFound/NotFound';
import AdminDashboardHome from './pages/AdminDashboardHome/AdminDashboardHome';

import './index.css';


function NavigateToCorrectRoute() {
  const auth = useAuth();
   if (auth.loading) {
      return <div>Loading...</div>; 
  }
  return auth.isAuthenticated ? <Navigate to="/admin" replace /> : <Navigate to="/login" replace />;
}

function App() {
  return (
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout /> 
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboardHome />} />
              <Route path="ingredients" element={<ManageIngredientsPage />} />
              <Route path="inventory-logs" element={<ManageInventoryLogsPage />} />
            </Route> 

            <Route path="/" element={<NavigateToCorrectRoute />} />
            <Route path="*" element={<NotFoundPage />} />

          </Routes>
        </AuthProvider>
      </BrowserRouter>
  );
}

export default App;