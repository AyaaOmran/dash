// components/common/AddNewBtn.jsx
"use client";
import Link from "next/link";
import styles from "@/styles/addNewBtn.module.css";
import { Icon } from "@iconify/react";

export default function AddNewBtn({ value, to, onClick = () => {} }) {
  // إذا في to => Link بشكل زر
  if (to) {
    return (
      <Link href={to} className={styles.addBtn} title={`Add New ${value}`}>
        <Icon icon="tabler:plus" />
        Add New {value}
      </Link>
    );
  }

  // إذا ما في to => زر عادي ينفّذ onClick
  return (
    <button className={styles.addBtn} onClick={onClick} title={`Add New ${value}`}>
      <Icon icon="tabler:plus" />
      Add New {value}
    </button>
  );
}
