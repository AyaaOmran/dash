"use client";
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import styles from './addBadge.module.css';
import PermissionGuard from '@/components/features/guard/PermissionGuard';
import axios from 'axios';
import { toast } from "react-toastify"; // لازم تكوني مركبة react-toastify

export default function AddBadge() {
  const [formData, setFormData] = useState({
    title: { en: '', ar: '' },
    achievment:{ en: '', ar: '' },
    image: null,
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
      data.append('title[en]', formData.title.en);
      data.append('title[ar]', formData.title.ar);
      data.append('achievment[en]', formData.achievment.en);
      data.append('achievment[ar]', formData.achievment.ar);      
      if (formData.image) data.append('image', formData.image);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/badges", 
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Badge added successfully!");
      setFormData({ title: { en: '', ar: '' }, achievment: { en: '', ar: '' }, image: null });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add badge"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PermissionGuard
      allowedRoles={["super_admin", "admin"]}
      requiredPermissions={["read badge", "create badge"]}
    >
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* badge Info */}
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <Icon icon="mdi:medal-outline" className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Badge Information</h2>
            </div>
            <p className={styles.sectionDescription}>
              Enter the Badge information in both English and Arabic.
            </p>
            <div className={styles.grid}>
              <div>
                <label htmlFor="title-en" className={styles.label}>
                  Title <span className={styles.requiredStar}>*</span>
                </label>
                <input
                  type="text"
                  id="title-en"
                  name="title.en"
                  value={formData.title.en}
                  onChange={handleChange}
                  placeholder="Enter title in English"
                  required
                  className={styles.input}
                />
              </div>
              <div>
                <label htmlFor="title-ar" className={`${styles.label} ${styles.rtlText}`}>
                  العنوان <span className={styles.requiredStar}>*</span>
                </label>
                <input
                  type="text"
                  id="title-ar"
                  name="title.ar"
                  value={formData.title.ar}
                  onChange={handleChange}
                  placeholder="أدخل العنوان بالعربية"
                  required
                  className={`${styles.input} ${styles.rtlInput}`}
                />
              </div>
            </div>

          <div className={styles.grid}>
            <div>
              <label htmlFor="achievment-en" className={styles.label}>
                Achievment <span className={styles.requiredStar}>*</span>
              </label>
              <textarea
                id="achievment-en"
                name="achievment.en"
                value={formData.achievment.en}
                onChange={handleChange}
                placeholder="Enter the achievment in English"
                rows="3"
                required
                className={styles.input}
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="achievment-ar"
                className={`${styles.label} ${styles.rtlText}`}
              >
                الأنجاز <span className={styles.requiredStar}>*</span>
              </label>
              <textarea
                id="achievment-ar"
                name="achievment.ar"
                value={formData.achievment.ar}
                onChange={handleChange}
                placeholder="أدخل الأنجاز باللغة العربية"
                rows="3"
                required
                className={`${styles.input} ${styles.rtlInput}`}
              ></textarea>
            </div>
          </div>

          </div>

          {/* File Upload */}
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <Icon icon="uil:file-alt" className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>File Upload</h2>
            </div>
            <p className={styles.sectionDescription}>Upload the badge icon.</p>
            <div className={styles.grid}>
              <div>
                <label htmlFor="image" className={styles.label}>
                  badge Icon <span className={styles.requiredStar}>*</span>
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
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
              {isSubmitting ? 'Adding...' : 'Add Badge'}
            </button>
          </div>
        </form>
      </div>
    </PermissionGuard>
  );
}
