import React from 'react';
import { useAuth } from '../../context/AuthContext'; 
import { Link } from 'react-router-dom'; 
import styles from './AdminDashboardHome.module.css'; 
import {
    FaShoppingCart, FaDollarSign, FaCalendarCheck, FaClipboardList,
    FaPlus, FaChartBar, FaUsers, FaBoxOpen 
} from 'react-icons/fa';

function AdminDashboardHome() {
    const auth = useAuth(); 
    
    const stats = [
        { title: "Doanh thu hôm nay", value: "Tạm thời chưa làm", icon: <FaDollarSign />, color: "#28a745", link: "/admin/reports/sales" }, // Thêm link ví dụ
        { title: "Đặt bàn hôm nay", value: "Tạm thời chưa làm", icon: <FaCalendarCheck />, color: "#ffc107", link: "/admin/reservations" },
        { title: "Nguyên liệu sắp hết", value: "Tạm thời chưa làm", icon: <FaBoxOpen />, color: "#dc3545", link: "/admin/ingredients?status=low" }, // Link tới trang NL lọc sẵn
    ];

    return (
        <div className={styles.dashboardHome}>
            <h1 className={styles.welcomeMessage}>
                Chào mừng trở lại, {auth.user?.name || 'Admin'}!
            </h1>
            <p className={styles.welcomeSubtext}>Tổng quan nhanh về hoạt động của nhà hàng.</p>

            <section className={styles.statsGrid}>
                {stats.map((stat, index) => (
                     <Link key={index} to={stat.link || '#'} className={styles.statCardLink}>
                         <div className={styles.statCard}>
                             <div className={styles.statIcon} style={{ backgroundColor: stat.color }}>
                                 {stat.icon}
                             </div>
                             <div className={styles.statInfo}>
                                 <span className={styles.statValue}>{stat.value}</span>
                                 <span className={styles.statTitle}>{stat.title}</span>
                             </div>
                         </div>
                    </Link>
                ))}
            </section>

             <section className={styles.quickActions}>
                 <h2>Hành động nhanh</h2>
                 <div className={styles.actionButtons}>
                     <Link to="/admin/inventory-logs/" className={`${styles.actionButton} ${styles.btnSuccess}`}>
                         <FaPlus /> Xem Phiếu Kho
                     </Link>
                     <Link to="/admin/ingredients/" className={`${styles.actionButton} ${styles.btnPrimary}`}>
                         <FaPlus /> Xem Nguyên liệu
                     </Link>
                     <Link to="/admin/reservations" className={`${styles.actionButton} ${styles.btnInfo}`}>
                         <FaCalendarCheck /> Xem Đặt bàn
                     </Link>
                 </div>
             </section>

            <section className={styles.reportsSection}>
                <h2>Báo cáo & Thống kê</h2>
                <div className={styles.chartsGrid}>
                     <div className={styles.chartPlaceholder}>
                        <FaChartBar />
                        <p>Biểu đồ doanh thu...</p>
                     </div>
                     <div className={styles.chartPlaceholder}>
                         <FaShoppingCart />
                         <p>Biểu đồ món bán chạy...</p>
                    </div>
                 </div>
            </section>

        </div>
    );
}

export default AdminDashboardHome;