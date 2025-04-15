import React from 'react';
import styles from './MainContent.module.css';

function MainContent({ children, isSidebarVisible }) {

  const mainContentClasses = `
    ${styles.mainContentArea}
    ${isSidebarVisible ? styles.mainContentSidebarVisible : ''}
  `;

  return (
    <div className={mainContentClasses}> 
      {children ? children : (
        <>
          <h1>Chào mừng đến với Trang Quản Trị</h1>
          <p>Chọn một chức năng từ menu bên trái để bắt đầu.</p>
        </>
      )}
    </div>
  );
}

export default MainContent;