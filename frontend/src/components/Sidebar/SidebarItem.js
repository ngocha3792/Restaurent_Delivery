import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import styles from './Sidebar.module.css'; 

function SidebarItem({ item }) {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const hasSubmenu = item.subItems && item.subItems.length > 0;

  const handleToggleSubmenu = (e) => {
     if (hasSubmenu) {
         e.preventDefault();
         setIsSubmenuOpen(!isSubmenuOpen);
     } else {
       console.log('Navigate to:', item.path || '#');
     }
  };

  const linkHref = item.path || '#';
 

  return (
    <li className={styles.menuItem}>
        {!hasSubmenu && (
             <a href={linkHref} className={styles.menuItemLink} onClick={handleToggleSubmenu}>
                {item.icon && <span className={styles.menuIcon}>{item.icon}</span>}
                <span>{item.label}</span>
            </a>
        )}
        {hasSubmenu && (
             <div className={styles.menuItemLink} onClick={handleToggleSubmenu} role="button" tabIndex="0" aria-expanded={isSubmenuOpen}>
                {item.icon && <span className={styles.menuIcon}>{item.icon}</span>}
                <span>{item.label}</span>
                <FaChevronDown className={`${styles.submenuArrow} ${isSubmenuOpen ? styles.submenuArrowOpen : ''}`} />
             </div>
        )}


      {hasSubmenu && (
        <ul className={`${styles.submenu} ${isSubmenuOpen ? styles.submenuOpen : ''}`}>
          {item.subItems.map((subItem, index) => (
            <li key={index} className={styles.submenuItem}>
              <a href={subItem.path || '#'}>
                {subItem.icon && <span className={styles.menuIcon}>{subItem.icon}</span>} 
                {subItem.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default SidebarItem;