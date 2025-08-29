"use client";
import styles from '@/styles/filterMenu.module.css';
import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

export default function filterMenu({ options = [], onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutSide = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutSide);
    return () => document.removeEventListener("mousedown", handleClickOutSide);
  }, []);

  const handleOnSelect = (option) => {
    setIsOpen(false);
    onSelect?.(option);
  };
  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      <button className={styles.filterBtn} onClick={() => setIsOpen(!isOpen)}>
        <Icon icon="tabler:filter" />
        Filter
      </button>
      {isOpen && (
        <ul className={styles.filterMenu}>
          {options.map((opt) => (
            <li
              key={opt}
              onClick={() => handleOnSelect(opt)}
              className={styles.filterOption}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
