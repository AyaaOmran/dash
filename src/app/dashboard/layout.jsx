import styles from './dashboardLayout.module.css';
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className={styles.layoutContainer}>
      <Sidebar />
      <main className={styles.main}>
        <Navbar />
        <div className={styles.mainContent}>
          {children}
        </div>
      </main>
    </div>
  );
}
