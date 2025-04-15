import React from 'react';
import { Link } from 'react-router-dom'; 
import styles from './NotFound.module.css'; 

function NotFoundPage() {
  return (
    <div className={styles.notFoundContainer}>
      <h1 className={styles.errorCode}>404</h1>
      <h2 className={styles.errorMessage}>Oops! Trang không tồn tại.</h2>
      <p className={styles.errorDescription}>
        Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
        Có thể địa chỉ URL bị sai hoặc trang đã bị xóa.
      </p>
      <Link to="/admin" className={styles.homeLink}>
        Quay lại Trang chủ Admin
      </Link>
    </div>
  );
}

export default NotFoundPage;