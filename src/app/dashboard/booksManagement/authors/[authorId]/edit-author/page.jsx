"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import styles from "./editAuthor.module.css";
import PermissionGuard from "@/components/features/guard/PermissionGuard";
import axios from "axios";
import { toast } from "react-toastify";
import { redirect, useParams, useRouter } from "next/navigation";
import FullPageLoader from "@/components/common/FullPageLoader";

export default function EditAuthor() {
  const { authorId } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: { en: "", ar: "" },
    imageFile: null,
    countryId: "",
    countryName: "",
  });

  // State to hold the original data for comparison
  const [initialData, setInitialData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [countryTyping, setCountryTyping] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch author by id
  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/authors/${authorId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const author = response.data.data;
        const fetchedCountryId = author.country?.id || "";

        setFormData({
          name: {
            en: author.name.en || "",
            ar: author.name.ar || "",
          },
          imageFile: null,
          countryId: fetchedCountryId,
          countryName: author.country?.en || "",
        });
        
        setInitialData({
          name: {
            en: author.name.en || "",
            ar: author.name.ar || "",
          },
          image: author.image,
          countryId: fetchedCountryId,
        });

        setPreviewImage(author.image);
      } catch (error) {
        toast.error("Failed to fetch author details!");
        router.push("/authors"); 
      } finally {
        setIsLoading(false);
      }
    };

    if (authorId) {
      fetchAuthor();
    }
  }, [authorId, router]);

  // Handle input changes
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

  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, imageFile: file }));
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
  };

  // Fetch countries
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
        toast.error("Failed to fetch countries!");
      }
    };

    const timeoutId = setTimeout(fetchCountries, 300);
    return () => clearTimeout(timeoutId);
  }, [countryTyping]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("name[en]", formData.name.en);
      payload.append("name[ar]", formData.name.ar);
      if (formData.imageFile) {
        payload.append("image", formData.imageFile);
      }
      if (formData.countryId) {
        payload.append("country_id", formData.countryId);
      }

      await axios.post(
        `http://127.0.0.1:8000/api/author/update/${authorId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update initial data after successful submission
      setInitialData({
        name: { en: formData.name.en, ar: formData.name.ar },
        image: formData.imageFile ? previewImage : initialData.image,
        countryId: formData.countryId,
      });

      // Reset the image file state to disable the button
      setFormData((prev) => ({ ...prev, imageFile: null }));

      toast.success("Author updated successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong, please try again!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isChanged = initialData && (
    formData.name.en !== initialData.name.en ||
    formData.name.ar !== initialData.name.ar ||
    formData.countryId !== initialData.countryId ||
    formData.imageFile !== null
  );

  if (isLoading) return <FullPageLoader />;

  return (
    <PermissionGuard
      allowedRoles={["super_admin", "admin"]}
      requiredPermissions={["update author", "read author"]}
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
              <h2 className={styles.sectionTitle}>Edit Author</h2>
            </div>
            <div className={styles.grid}>
              <div>
                <label className={styles.label}>
                  Name (English) 
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
                  اسم الكاتب 
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

            {previewImage && (
              <div className="flex items-center gap-4 mb-4">
                <span className={styles.label}>Current Image:</span>
                <img
                  src={previewImage}
                  alt="Author"
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
            )}

            <div>
              <label className={styles.label}>Change Author Image</label>
              <input
                type="file"
                name="imageFile"
                onChange={handleFileChange}
                className={styles.fileInput}
              />
            </div>
          </div>

          {/* Country Search */}
          <div className={styles.card}>
            <div className={styles.searchableContainer}>
              <label className={styles.label}>
                Country 
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
              disabled={isSubmitting || !isChanged}
              className={`${styles.submitButton} ${
                (!isChanged || isSubmitting) && styles.disabledButton
              }`}
            >
              {isSubmitting ? "Updating..." : "Update Author"}
            </button>
          </div>
        </form>
      </div>
    </PermissionGuard>
  );
}