"use client";

import { useState } from "react";
import axios from "axios";
import styles from '@/styles/deleteConfirmation.module.css';
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@/lib/fontawesome";

export default function DeleteConfirmation({
  itemId,
  itemName,
  itemType="item",
  apiUrl,
  onClose = () => {},
  onSuccess = () => {},
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(
        `${apiUrl}/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(`${itemType[0].toUpperCase() + itemType.slice(1)} deleted successfully!`);
      onSuccess();
      onClose();
    } catch (error) {
              toast.error(
        error.response?.data?.message || `Failed to delete ${itemType}, please try again`
      );
    }finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.smallContent}>
        <button className={styles.closeBtn} onClick={onClose}>
          <Icon icon="tabler:x" />
        </button>
        <div className={styles.header}>
          <div className={styles.iconContainer}>
            <Icon icon="tabler:trash" className={styles.userIcon} style={{color:"#dc2626"}}/>
          </div>
          <h2>Delete {itemType[0].toUpperCase() + itemType.slice(1)}</h2>
        </div>
        <p className={styles.confirmText}>
          Are you sure you want to delete{" "}
          <strong className={styles.adminName}>{itemName}</strong>?<br />
        </p>

        <div className={styles.actionsRow}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className={styles.deleteBtn}
          >
            {isLoading ? (
              <>
                <FontAwesomeIcon icon={["fas", "spinner"]} spin /> Deleting
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
