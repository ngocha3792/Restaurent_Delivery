import React from 'react';
import SidebarItem from './SidebarItem';
import styles from './Sidebar.module.css'; 
import {
  FaHome, FaUsersCog, FaWarehouse, FaUtensils, FaCalendarCheck, FaTasks, FaFileContract, FaUserTie, FaMoneyCheckAlt, FaFileMedicalAlt, FaBoxOpen, FaPlusSquare
} from 'react-icons/fa'; 

const menuItemsData = [
  {
    label: 'Trang chủ',
    icon: <FaHome />,
    path: '/admin',
  },
    {
        label: 'Quản lý nhân viên',
        icon: <FaUsersCog />,
        subItems: [
          { label: 'Quản lý nhân sự', icon: <FaUserTie />, path: '*' },
          { label: 'Quản lý hợp đồng', icon: <FaFileContract />, path: '*' },
          { label: 'Tài khoản & Bảng lương', icon: <FaMoneyCheckAlt />, path: '*' }, 
          { label: 'Đơn xin nghỉ phép', icon: <FaFileMedicalAlt />, path: '*' }, 
        ]
      },
      {
        label: 'Quản lý kho',
        icon: <FaWarehouse />,
        subItems: [
          { label: 'Quản lý nguyên liệu', icon: <FaBoxOpen />, path: '/admin/ingredients' }, 
          { label: 'Quản lý nhập/xuất', icon: <FaPlusSquare/>, path: '/admin/inventory-logs' }, 
        ]
      },
      {
        label: 'Quản lý món ăn',
        icon: <FaUtensils />,
        path: '/admin/menu-items',
      },
      {
        label: 'Quản lý đặt bàn',
        icon: <FaCalendarCheck />,
        path: '/admin/reservations',
      },
      {
        label: 'Quản lý nhiệm vụ',
        icon: <FaTasks />,
        path: '/admin/tasks',
      },
];

function Sidebar({ isOpen }) {
  const sidebarClasses = `${styles.sidebar} ${isOpen ? styles.sidebarVisible : ''}`;

  return (
    <aside className={sidebarClasses}>
      <nav className={styles.sidebarNav}>
        <ul>
          {menuItemsData.map((item, index) => (
            <SidebarItem key={index} item={item} />
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;