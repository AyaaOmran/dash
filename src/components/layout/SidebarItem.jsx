'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import styles from '@/styles/sidebar.module.css';

export default function SidebarItem({ icon, label, path = '', disabled = false }) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(path);

  if (disabled) {
    return (
      <div className={`${styles.items} ${styles.disabled}`}>
        <Icon icon={icon} className={styles.itemIcon} />
        <span>{label}</span>
      </div>
    );
  }

  return (
    <Link href={path} className={`${styles.items} ${isActive ? styles.active : ''}`}>
      <Icon icon={icon} className={styles.itemIcon} />
      <span>{label}</span>
    </Link>
  );
}
