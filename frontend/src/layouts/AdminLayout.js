import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom'; 
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import Footer from '../components/Footer/Footer';
import styles from './AdminLayout.module.css';

function AdminLayout() { 
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (window.innerWidth < 768) return true; 
    return localStorage.getItem('sidebarState') === 'toggled'; 
  });

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem('sidebarState', newState ? 'toggled' : 'visible');
  };

  const handleOverlayClick = () => {
    if (!isSidebarOpen && window.innerWidth < 768) {
       toggleSidebar();
    }
  };

  useEffect(() => {
      const handleResize = () => {
            const mobileView = window.innerWidth < 768;
            if (mobileView) {
                if (!isSidebarOpen) { setIsSidebarOpen(true); localStorage.setItem('sidebarState', 'toggled');}
            } else {
                const storedState = localStorage.getItem('sidebarState');
                if (storedState !== 'toggled') { setIsSidebarOpen(false); }
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);


    const contentWrapperClass = `${styles.adminLayoutContentWrapper} ${!isSidebarOpen ? styles.contentShifted : ''}`;
    const overlayClasses = `${styles.sidebarOverlay} ${!isSidebarOpen && window.innerWidth < 768 ? styles.sidebarOverlayVisible : ''}`;


  return (
    <div className={styles.adminLayout}>
      <Header onToggleSidebar={toggleSidebar} />
      <div className={styles.adminLayoutContent}> 
        <Sidebar isOpen={!isSidebarOpen} /> 
        <main className={contentWrapperClass}>
            <Outlet />
        </main>
      </div>
      <div className={overlayClasses} onClick={handleOverlayClick}></div>
      <Footer />
    </div>
  );
}

export default AdminLayout;