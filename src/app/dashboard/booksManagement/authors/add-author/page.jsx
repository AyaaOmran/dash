"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import styles from "./addAuthor.module.css";
import PermissionGuard from "@/components/features/guard/PermissionGuard";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddAuthor() {
  const [formData, setFormData] = useState({
    name: { en: "", ar: "" },
    imageFile: null,
    countryId: "",
    countryName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [countryTyping, setCountryTyping] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

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
    setFormData((prev) => ({ ...prev, imageFile: file }));
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
  };

  useEffect(() => {
    if (!countryTyping.trim()) {
      setFilteredCountries([]);
      return;
    }

    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/country/searchCountry`,
          {
            params: { search: countryTyping },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFilteredCountries(response.data.countries || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Something went wrong, please try again!"
        );
      }
    };

    const timeoutId = setTimeout(fetchCountries, 300);
    return () => clearTimeout(timeoutId);
  }, [countryTyping]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("name[en]", formData.name.en);
      payload.append("name[ar]", formData.name.ar);
      payload.append("image", formData.imageFile);
      payload.append("country_id", formData.countryId);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/authors",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Author added successfully!");

      setFormData({
        name: { en: "", ar: "" },
        imageFile: null,
        countryId: "",
        countryName: "",
      });
      setPreviewImage(null);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong, please try again!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PermissionGuard
      allowedRoles={["super_admin", "admin"]}
      requiredPermissions={["create author", "read author"]}
    >
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Author Information Section */}
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <Icon
                icon="mdi:account-edit-outline"
                className={styles.sectionIcon}
              />
              <h2 className={styles.sectionTitle}>Author Information</h2>
            </div>
            <div className={styles.grid}>
              <div>
                <label className={styles.label}>
                  Name (English) <span className={styles.requiredStar}>*</span>
                </label>
                <input
                  type="text"
                  name="name.en"
                  value={formData.name.en}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>
              <div>
                <label className={`${styles.label} ${styles.rtlText}`}>
                  اسم الكاتب <span className={styles.requiredStar}>*</span>
                </label>
                <input
                  type="text"
                  name="name.ar"
                  value={formData.name.ar}
                  onChange={handleChange}
                  required
                  className={`${styles.input} ${styles.rtlInput}`}
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <Icon icon="uil:file-alt" className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Image Upload</h2>
            </div>

            {/* Display the image preview using the new state */}
            {previewImage && (
              <div className="flex items-center gap-4 mb-4">
                <span className={styles.label}>Current Image:</span>
                <img
                  src={previewImage}
                  alt="Current Author"
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
            )}

            <div>
              <label className={styles.label}>
                Author Image <span className={styles.requiredStar}>*</span>
              </label>
              <input
                type="file"
                name="imageFile"
                onChange={handleFileChange}
                required
                className={styles.fileInput}
              />
            </div>
          </div>

          {/* Country Search */}
          <div className={styles.card}>
            <div className={styles.searchableContainer}>
              <label className={styles.label}>
                Country <span className={styles.requiredStar}>*</span>
              </label>
              <input
                type="text"
                value={formData.countryName}
                onChange={(e) => {
                  setCountryTyping(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    countryName: e.target.value,
                    countryId: "",
                  }));
                }}
                required
                placeholder="Search for country..."
                className={styles.input}
              />
              {filteredCountries.length > 0 && (
                <ul className={styles.searchResultsList}>
                  {filteredCountries.map((a) => (
                    <li
                      key={a.id}
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          countryId: a.id,
                          countryName: a.name,
                        }));
                        setFilteredCountries([]);
                      }}
                      className={styles.searchResultItem}
                    >
                      {a.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className={styles.submitButtonWrapper}>
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? "Adding..." : "Add Author"}
            </button>
          </div>
        </form>
      </div>
    </PermissionGuard>
  );
}
