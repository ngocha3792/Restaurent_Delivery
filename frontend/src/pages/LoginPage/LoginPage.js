// src/pages/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './LoginPage.module.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!auth.loading && auth.isAuthenticated) {
            const from = location.state?.from?.pathname || '/admin';
            if (from === '/login') {
                 navigate('/admin', { replace: true });
            } else {
                 navigate(from, { replace: true });
            }
        }
    }, [auth.loading, auth.isAuthenticated, navigate, location.state]);

    useEffect(() => {
        if (auth.authError) {
             auth.setAuthError(null);
        }
    }, [email, password, auth.setAuthError]); 

    const handleSubmit = async (event) => {
        event.preventDefault();
        await auth.login(email, password);
    };

    if (auth.loading && !auth.authError) {
        return <div className={styles.fullPageLoader}>Đang tải...</div>;
    }


    return (
         <div className={styles.loginPage}>
                <div className={styles.loginContainer}>
                    <h2>Đăng Nhập Trang Quản Trị</h2>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete='email'
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="password">Mật khẩu:</label>
                            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete='current-password'
                            />
                        </div>

                        {auth.authError && <p className={styles.errorMessage}>{auth.authError}</p>}

                        <button type="submit" className={styles.loginButton} disabled={auth.loading}>
                             {auth.loading ? 'Đang xử lý...' : 'Đăng nhập'}
                        </button>
                    </form>
                </div>
            </div>
    );
}

export default LoginPage;