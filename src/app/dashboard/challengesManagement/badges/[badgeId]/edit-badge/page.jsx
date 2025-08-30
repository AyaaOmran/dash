"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import styles from "./editBadge.module.css";
import PermissionGuard from "@/components/features/guard/PermissionGuard";
import FullPageLoader from "@/components/common/FullPageLoader";

export default function EditBadge() {
  const params = useParams();
  const id = params.badgeId;

  const [formData, setFormData] = useState({
    title: { en: '', ar: '' },
    achievment:{ en: '', ar: '' },
    image: null,
  });

  const [initialData, setInitialData] = useState(null); 
  const [previewIcon, setPreviewIcon] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadge = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/badges/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const badgeData = {
          title: {
            en: res.data.data.title.en,
            ar: res.data.data.title.ar,
          },
          achievment: {
            en: res.data.data.achievment.en,
            ar: res.data.data.achievment.ar,
          },
          image: null,
        };

        setFormData(badgeData);
        setInitialData({ ...badgeData, image: res.data.data.image }); 
        setPreviewIcon(res.data.data.image);
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBadge();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [main, sub] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [main]: {
          ...prev[main],
          [sub]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, icon: file }));
    if (file) {
      setPreviewIcon(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("title[en]", formData.title.en);
      data.append("title[ar]", formData.title.ar);
      data.append("achievment[en]", formData.achievment.en);
      data.append("achievment[ar]", formData.achievment.ar);      
      if (formData.image) {
        data.append("image", formData.image);
      }

      await axios.post(
        `http://127.0.0.1:8000/api/badge/update/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setInitialData({
        title: {
          en: formData.title.en,
          ar: formData.title.ar,
        },
        achievment: {
          en: formData.achievment.en,
          ar: formData.achievment.ar,
        },        
        image: formData.image ? previewIcon : initialData.image,
      });
      setFormData((prev) => ({ ...prev, image: null }));

      toast.success("Badge updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update badge");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isChanged =
    initialData &&
    (formData.title.en !== initialData.title.en ||
      formData.title.ar !== initialData.title.ar ||
      formData.achievment.en !== initialData.achievment.en ||
      formData.achievment.ar !== initialData.achievment.ar ||
      formData.image !== null); 

  if (loading) return <FullPageLoader />;

  return (
    <PermissionGuard
      allowedRoles={["super_admin", "admin"]}
      requiredPermissions={["update badge"]}
    >
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* badge Information */}
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <Icon icon="mdi:medal-outline" className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Badge Information</h2>
            </div>
            <div className={styles.grid}>
              <div>
                <label htmlFor="title-en" className={styles.label}>
                  Title 
                </label>
                <input
                  type="text"
                  id="title-en"
                  name="title.en"
                  value={formData.title.en}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>
              <div>
                <label
                  htmlFor="title-ar"
                  className={`${styles.label} ${styles.rtlText}`}
                >
                  العنوان
                </label>
                <input
                  type="text"
                  id="title-ar"
                  name="title.ar"
                  value={formData.title.ar}
                  onChange={handleChange}
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
                rows="3"
                required
                className={`${styles.input} ${styles.rtlInput}`}
              ></textarea>
            </div>
          </div>

          </div>

          {/* Icon Upload */}
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <Icon icon="uil:file-alt" className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Badge Icon</h2>
            </div>
            <div>
              {previewIcon && (
                <div className="flex items-center gap-4 mb-4">
                  <span className={styles.label}>Current Icon:</span>
                  <img
                    src={previewIcon}
                    alt="Current Category"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>
              )}

              <input
                type="file"
                id="image"
                name="image"
                onChange={handleFileChange}
                className={styles.fileInput}
              />
            </div>
          </div>

          {/* Submit */}
          <div className={styles.submitButtonWrapper}>
            <button
              type="submit"
              disabled={isSubmitting || !isChanged}
              className={`${styles.submitButton} ${
                (!isChanged || isSubmitting) && styles.disabledButton
              }`}
            >
              {isSubmitting ? "Updating..." : "Update Badge"}
            </button>
          </div>
        </form>
      </div>
    </PermissionGuard>
  );
}
