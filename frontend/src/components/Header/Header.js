import React from 'react';
import { FaBars, FaSignOutAlt } from 'react-icons/fa';
import styles from './Header.module.css'; 
import { useAuth } from '../../context/AuthContext'; 

function Header({ onToggleSidebar }) {
  const auth = useAuth();

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        auth.logout();
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button onClick={onToggleSidebar} className={styles.menuToggleBtn} aria-label="Toggle Menu">
          <FaBars />
        </button>
        <div className={styles.logo}>
          <img src="/placeholder-logo.png" alt="Logo Nhà Hàng" />
          <span>Quản Trị Nhà Hàng</span>
        </div>
      </div>
      <div className={styles.headerRight}>
         {auth.isAuthenticated && auth.user && (
             <>
                <span>Xin chào, {auth.user.name || auth.user.email}</span>
                <button onClick={handleLogout} className={styles.logoutButton} title="Đăng xuất">
                    <FaSignOutAlt />
                    <span className={styles.logoutText}>Đăng xuất</span>
                </button>
             </>
         )}
      </div>
    </header>
  );
}

export default Header;