import styles from '@/styles/dashboardCard.module.css';
import { Icon } from "@iconify/react";

export default function DashboardCard({ icon, title, number }) {
  return (
<div className= {`${styles.card} ${styles.leftBorder}`}>
  <div className={styles.topRow}>
    <div className={styles.iconWrapper}>
       <Icon icon={icon} className={styles.icon} />
    </div>
    <h3 className={styles.title}>{title}</h3>
  </div>
  <p className={styles.number}>{number}</p>
</div>
  );
}