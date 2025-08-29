import React from "react";
import styles from "@/styles/searchField.module.css";

export default function SearchField  ({
  label,
  value,
  onInputChange,
  onSelect,
  options,
  required = false,
  placeholder = "Search...",
  rtl = false,
  loading = false,
  error = null
}){
  return (
    <div className={styles.searchableContainer}>
      <label className={`${styles.label} ${rtl ? styles.rtlText : ""}`}>
        {label} {required && <span className={styles.requiredStar}>*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onInputChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className={`${styles.input} ${rtl ? styles.rtlInput : ""}`}
      />
      
      {loading && <div className={styles.loading}>Searching...</div>}
      {error && <div className={styles.error}>{error}</div>}
      
      {options.length > 0 && (
        <ul className={styles.searchResultsList}>
          {options.map((option) => (
            <li
              key={option.id}
              onClick={() => onSelect(option)}
              className={styles.searchResultItem}
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
