import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);
    const navigate = useNavigate();

    const fetchUserDetails = useCallback(async (token) => {
        if (!token) { setUser(null); setIsAuthenticated(false); return false; }
        try {
            const response = await axiosInstance.get('/users/me', { headers: { Authorization: `Bearer ${token}` } });
            if (response.data && response.data.role === 'admin') {
                setUser(response.data); setIsAuthenticated(true); setAuthError(null); return true;
            } else { throw new Error("User is not an admin or invalid data."); }
        } catch (error) {
            console.error("Auth fetch error:", error); setUser(null); setIsAuthenticated(false);
            localStorage.removeItem('authToken'); setAuthError("Phiên đăng nhập không hợp lệ."); return false;
        }
    }, []);

    useEffect(() => {
        const initializeAuth = async () => {
            setLoading(true); const token = localStorage.getItem('authToken');
            if (token) { await fetchUserDetails(token); }
            setLoading(false);
        };
        initializeAuth();
    }, [fetchUserDetails]);

    const login = async (email, password) => {
        setAuthError(null); setLoading(true);
        try {
            const response = await axiosInstance.post('/auth/login', { email, password });
            if (response.data && response.data.token && response.data.role === 'admin') {
                const { token } = response.data; localStorage.setItem('authToken', token);
                const fetchSuccess = await fetchUserDetails(token); setLoading(false);
                if(fetchSuccess) { navigate('/admin'); return true; }
                else { setAuthError("Đăng nhập thành công nhưng lỗi lấy thông tin."); logout(); return false; }
            } else { throw new Error("Invalid login response or user is not an admin."); }
        } catch (error) {
            setLoading(false);
            let displayMessage = "Đã có lỗi xảy ra. Vui lòng thử lại.";

            if (error.response) {
                console.error("Login API Error Response:", error.response.data);
                const status = error.response.status;
                if (status === 400 || status === 404) {
                    displayMessage = "Tài khoản hoặc mật khẩu không đúng.";
                } else if (status === 401 || status === 403) {
                    displayMessage = "Bạn không có quyền thực hiện hành động này.";
                } else if (status >= 500) {
                    displayMessage = "Lỗi hệ thống. Vui lòng thử lại sau.";
                }

            } else if (error.request) {
                console.error("Login API No Response:", error.request);
                displayMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng.";
            } else {
                console.error('Login Setup Error:', error.message);
                displayMessage = "Đã có lỗi xảy ra khi gửi yêu cầu đăng nhập.";
            }

            setAuthError(displayMessage); 
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('authToken'); 
            return false; 
        }
    };

    const logout = () => {
        setUser(null); setIsAuthenticated(false); localStorage.removeItem('authToken');
        setAuthError(null); navigate('/login');
    };

    const value = { user, isAuthenticated, loading, authError, login, logout, setAuthError };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};