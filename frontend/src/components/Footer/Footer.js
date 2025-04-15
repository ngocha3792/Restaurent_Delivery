import React from 'react';
import styles from './Footer.module.css'; 

function Footer() {
  return (
    <footer className={styles.footer}>
      <p>&copy; 2025 Hệ Thống Quản Lý Nhà Hàng. Phát triển bởi Nguyễn Văn Hoàng.</p>
      <p>Liên hệ: ngocha3792@gmail.com | Hotline: 0559.802.971</p>
    </footer>
  );
}

export default Footer;