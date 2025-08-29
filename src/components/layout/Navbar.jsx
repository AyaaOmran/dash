'use client';

import { useState, useRef, useEffect } from 'react';
import '@/lib/fontawesome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '@/styles/navBar.module.css';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  const pathname = usePathname();
  const pathParts = pathname.split('/').filter(Boolean);
const currentSection = pathParts[pathParts.length - 1];

// استبدال الشرطة بمسافة
const cleanSection = currentSection.replace(/-/g, ' ');

// تحويل أول حرف من كل كلمة إلى حرف كبير
const formattedSection = cleanSection
  .split(' ')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');


  const adminData = {
    name: "Aya Omran",
    email: "ayaomran@emali.com",
    role: "super admin"
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.navbar}>
      <div className={styles.leftSection}>
        <h2 className={styles.pageTitle}>{formattedSection}</h2>
      </div>

      <div className={styles.rightSection}>


          <button className={styles.iconButton}>
            <FontAwesomeIcon icon={['far', 'bell']} className={styles.icon} />
          </button>



        <div className={styles.userMenuWrapper} ref={menuRef}>
          <button className={styles.iconButton} onClick={() => setMenuOpen(!menuOpen)}>
            <FontAwesomeIcon icon={['far', 'circle-user']} className={styles.icon} />
          </button>

          {menuOpen && (
            <div className={styles.dropdownMenu}>
              <div className={styles.profileInfo}>
                <div className={styles.profileLine}>
                  <FontAwesomeIcon icon={['far', 'user']} />
                  {adminData.name}
                </div>
                <div className={styles.profileLine}>
                  <FontAwesomeIcon icon={['far', 'envelope']} />
                  {adminData.email}
                </div>
                <div className={styles.profileLine}>
                  <FontAwesomeIcon icon={['far', 'address-card']} />
                  {adminData.role}
                </div>
              </div>
              <button className={styles.dropdownItem}>
                <FontAwesomeIcon icon={['far', 'pen-to-square']} style={{ marginRight: 8 }} />
                Edit Profile
              </button>
            </div>
          )}
        </div>

        <button className={`${styles.iconButton} ${styles.logoutIcon}`}>
          <FontAwesomeIcon icon={['fas', 'arrow-right-from-bracket']} className={styles.icon} />
        </button>

      </div>
    </div>
  );
}
