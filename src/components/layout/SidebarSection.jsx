"use client";

import SidebarItem from "./SidebarItem";
import styles from "@/styles/sidebar.module.css";
import { Icon } from "@iconify/react";
import { usePermissions } from "@/context/PermissionsContext";

export default function SidebarSection({ title, items, isOpen, onToggle }) {
  const { permissions } = usePermissions();

  const hasPermission = (item) => {
    if (!item.permissionKeys || item.permissionKeys.length === 0) return true;

    const readKey = item.permissionKeys.find((key) => key.startsWith("read "));
    if (!readKey) return true;

    return permissions[readKey];
  };

  return (
    <div>
      <div className={styles.sectionTitle} onClick={onToggle}>
        {title}
        <Icon
          icon="mdi:chevron-down"
          className={`${styles.arrowIcon} ${isOpen ? styles.rotated : ""}`}
        />
      </div>

      <div className={`${styles.subItemsWrapper} ${isOpen ? styles.open : ""}`}>
        <div className={styles.subItems}>
          {items.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              disabled={!hasPermission(item)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
