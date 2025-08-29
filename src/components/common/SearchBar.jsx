"use client";
import { Icon } from "@iconify/react";
import styles from '@/styles/searchBar.module.css';

export default function SearchBar({ value, onChange }) {
  return (
    <div className={styles.searchWrapper}>
      <Icon
        icon="material-symbols-light:search"
        className={styles.searchIcon}
      />
      <input
        type="text"
        placeholder="Search..."
        className={styles.searchInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
