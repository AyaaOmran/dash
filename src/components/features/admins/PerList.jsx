"use client";

import { useState } from "react";
import styles from "@/styles/acco.module.css";

export default function PerList({ title, permissions, onChange, saving }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.accordionGroup}>
      {/* العنوان */}
      <div
        className={styles.accordionHeader}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.accordionTitle}>
          {title.charAt(0).toUpperCase() + title.slice(1)}
        </span>
        <span className={styles.accordionIcon}>{isOpen ? "−" : "+"}</span>
      </div>

      {/* القائمة المنسدلة */}
      {isOpen && (
        <div className={styles.accordionBody}>
          <ul className={styles.permissionList}>
            {Object.entries(permissions).map(([key, value]) => (
              <li
                key={key}
                className={styles.permissionItem}
              >
                {/* الحل: نقلنا onChange إلى الـ input واستخدمنا الـ label لزيادة مساحة النقر */}
                <label>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => onChange(key, !value)} // هذه الدالة ستغير القيمة
                    disabled={saving}
                  />
                  <span className={styles.permissionLabel}>{key}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
