"use client";
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import styles from './addCategory.module.css';
import PermissionGuard from '@/components/features/guard/PermissionGuard';
import axios from 'axios';
import { toast } from "react-toastify"; // لازم تكوني مركبة react-toastify

export default function AddCategory() {
  const [formData, setFormData] = useState({
    name: { en: '', ar: '' },
    icon: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [main, sub] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [main]: {
          ...prev[main],
          [sub]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('name[en]', formData.name.en);
      data.append('name[ar]', formData.name.ar);
      if (formData.icon) data.append('icon', formData.icon);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/categories", // غيري الرابط حسب الـ endpoint عندك
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Category added successfully!");
      setFormData({ name: { en: '', ar: '' }, icon: null });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add category"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PermissionGuard
      allowedRoles={["super_admin", "admin"]}
      requiredPermissions={["read category", "create category"]}
    >
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Category Info */}
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <Icon icon="mdi:view-grid-outline" className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Category Information</h2>
            </div>
            <p className={styles.sectionDescription}>
              Enter the category information in both English and Arabic.
            </p>
            <div className={styles.grid}>
              <div>
                <label htmlFor="name-en" className={styles.label}>
                  Title (English) <span className={styles.requiredStar}>*</span>
                </label>
                <input
                  type="text"
                  id="name-en"
                  name="name.en"
                  value={formData.name.en}
                  onChange={handleChange}
                  placeholder="Enter title in English"
                  required
                  className={styles.input}
                />
              </div>
              <div>
                <label htmlFor="name-ar" className={`${styles.label} ${styles.rtlText}`}>
                  العنوان <span className={styles.requiredStar}>*</span>
                </label>
                <input
                  type="text"
                  id="name-ar"
                  name="name.ar"
                  value={formData.name.ar}
                  onChange={handleChange}
                  placeholder="أدخل العنوان بالعربية"
                  required
                  className={`${styles.input} ${styles.rtlInput}`}
                />
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <Icon icon="uil:file-alt" className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>File Upload</h2>
            </div>
            <p className={styles.sectionDescription}>Upload the category icon.</p>
            <div className={styles.grid}>
              <div>
                <label htmlFor="icon" className={styles.label}>
                  Category Icon <span className={styles.requiredStar}>*</span>
                </label>
                <input
                  type="file"
                  id="icon"
                  name="icon"
                  onChange={handleFileChange}
                  required
                  className={styles.fileInput}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className={styles.submitButtonWrapper}>
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? 'Adding...' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </PermissionGuard>
  );
}
