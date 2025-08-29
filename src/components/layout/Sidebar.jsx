"use client";

import styles from '@/styles/sidebar.module.css';
import '@/lib/fontawesome';
import SidebarSection from "./SidebarSection";
import { usePermissions } from "@/context/PermissionsContext";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default function Sidebar() {
  const { role } = usePermissions();
  const [openSection, setOpenSection] = useState(null);
  const pathname = usePathname();
  const isDashboardActive = pathname === "/dashboard";
  return (
    <aside className={styles.sidebar}>
      <div className={styles.headingContainer}>
        <Icon
          icon="streamline-freehand:newspaper-read-man"
          className={styles.headingIcon}
        />
        <h1 className={styles.heading}>Huroof</h1>
      </div>
      <hr style={{ color: "gray", marginTop: "20px" }} />

      <div className={styles.menu}>
        <Link
          href="/dashboard"
          className={`${styles.item} ${isDashboardActive ? styles.active : ""}`}
        >
          <Icon icon="la:home" className={styles.menuIcon} />
          <span>Dashboard</span>
          {console.log("role=" + role)}
        </Link>

        {role === "super_admin" && (
          <SidebarSection
            title="Users Management"
            isOpen={openSection === "users"}
            onToggle={() =>
              setOpenSection(openSection === "users" ? null : "users")
            }
            items={[
              {
                icon: "mdi:account-cog-outline",
                label: "Admins",
                path: "/dashboard/usersManagement/admins",
              },
              {
                icon: "la:book-reader",
                label: "Readers",
                path: "/dashboard/usersManagement/readers",
              },
            ]}
          />
        )}

        <SidebarSection
          title="Books management"
          isOpen={openSection === "books"}
          onToggle={() =>
            setOpenSection(openSection === "books" ? null : "books")
          }
          items={[
            {
              icon: "mdi:book-open-variant-outline",
              label: "Books",
              path: "/dashboard/booksManagement/books",
              permissionKeys: [
                "create book",
                "read book",
                "update book",
                "delete book",
              ],
            },
            {
              icon: "mdi:view-grid-outline",
              label: "Categories",
              path: "/dashboard/booksManagement/categories",
              permissionKeys: [
                "create category",
                "read category",
                "update category",
                "delete category",
              ],
            },
            {
              icon: "mdi:account-edit-outline",
              label: "Authors",
              path: "/dashboard/booksManagement/authors",
              permissionKeys: [
                "create author",
                "read author",
                "update author",
                "delete author",
              ],
            },
          ]}
        />

        <SidebarSection
          title="Challenges management"
          isOpen={openSection === "challenges"}
          onToggle={() =>
            setOpenSection(openSection === "challenges" ? null : "challenges")
          }
          items={[
            {
              icon: "mdi:trophy-outline",
              label: "Challenges",
              path: "/dashboard/challengesManagement/challenges",
              permissionKeys: [
                "create challenge",
                "read challenge",
                "update challenge",
                "delete challenge",
              ],
            },
            {
              icon: "mdi:medal-outline",
              label: "Badges",
              path: "/dashboard/challengesManagement/badges",
              permissionKeys: [
                "create badge",
                "read badge",
                "update badge",
                "delete badge",
              ],
            },
          ]}
        />
      </div>
    </aside>
  );
}
