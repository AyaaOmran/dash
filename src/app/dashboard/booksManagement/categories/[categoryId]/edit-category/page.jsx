"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import styles from "./editCategory.module.css";
import PermissionGuard from "@/components/features/guard/PermissionGuard";
import FullPageLoader from "@/components/common/FullPageLoader";

export default function EditCategory() {
  const params = useParams();
  const id = params.categoryId;

  const [formData, setFormData] = useState({
    name: { en: "", ar: "" },
    icon: null,
  });
  const [initialData, setInitialData] = useState(null); 
  const [previewIcon, setPreviewIcon] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const categoryData = {
          name: {
            en: res.data.data.name.en,
            ar: res.data.data.name.ar,
          },
          icon: null,
        };

        setFormData(categoryData);
        setInitialData({ ...categoryData, icon: res.data.data.icon }); 
        setPreviewIcon(res.data.data.icon);
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCategory();
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
      data.append("name[en]", formData.name.en);
      data.append("name[ar]", formData.name.ar);
      if (formData.icon) {
        data.append("icon", formData.icon);
      }

      await axios.post(
        `http://127.0.0.1:8000/api/category/update/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setInitialData({
        name: {
          en: formData.name.en,
          ar: formData.name.ar,
        },
        // إذا كان هناك أيقونة جديدة، استخدم رابط المعاينة، وإلا استخدم الأيقونة القديمة
        icon: formData.icon ? previewIcon : initialData.icon,
      });

      // ✅ إعادة تعيين أيقونة formData لتكون null لإعادة تعطيل الزر
      setFormData((prev) => ({ ...prev, icon: null }));

      toast.success("Category updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update category");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔍 تحقق إذا في تغيير
  const isChanged =
    initialData &&
    (formData.name.en !== initialData.name.en ||
      formData.name.ar !== initialData.name.ar ||
      formData.icon !== null); 

  if (loading) return <FullPageLoader />;

  return (
    <PermissionGuard
      allowedRoles={["super_admin", "admin"]}
      requiredPermissions={["update category"]}
    >
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Category Information */}
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <Icon icon="mdi:view-grid-outline" className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Category Information</h2>
            </div>
            <div className={styles.grid}>
              <div>
                <label htmlFor="name-en" className={styles.label}>
                  Name (English) 
                </label>
                <input
                  type="text"
                  id="name-en"
                  name="name.en"
                  value={formData.name.en}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>
              <div>
                <label
                  htmlFor="name-ar"
                  className={`${styles.label} ${styles.rtlText}`}
                >
                  الاسم 
                </label>
                <input
                  type="text"
                  id="name-ar"
                  name="name.ar"
                  value={formData.name.ar}
                  onChange={handleChange}
                  required
                  className={`${styles.input} ${styles.rtlInput}`}
                />
              </div>
            </div>
          </div>

          {/* Icon Upload */}
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <Icon icon="uil:file-alt" className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Category Icon</h2>
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
                id="icon"
                name="icon"
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
              {isSubmitting ? "Updating..." : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </PermissionGuard>
  );
}
