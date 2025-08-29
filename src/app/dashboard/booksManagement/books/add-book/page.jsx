"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import styles from "./addBook.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import PermissionGuard from "@/components/features/guard/PermissionGuard";

export default function AddBook() {
  const [formData, setFormData] = useState({
    title: { en: "", ar: "" },
    description: { en: "", ar: "" },
    authorId: "",
    authorName: "",
    categoryId: "",
    categoryName: "",
    sizeCategoryId: "",
    sizeCategoryName: "",
    countryId: "",
    countryName: "",
    publishDate: "",
    pages: "",
    points: "",
    summaryLinkEn: "",
    summaryLinkAr: "",
    bookFile: null,
    coverImage: null,
  });
  const [challengeData, setChallengeData] = useState({
    duration: "",
    points: "",
    description: { en: "", ar: "" },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [challengeFormEnabled, setChallengeFormEnabled] = useState(false);
  const [bookId, setBookId] = useState(null);
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [authorTyping, setAuthorTyping] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [categoryTyping, setCategoryTyping] = useState("");
  const [filteredSizeCategories, setFilteredSizeCategories] = useState([]);
  const [sizeCategoryTyping, setSizeCategoryTyping] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [countryTyping, setCountryTyping] = useState("");

  // ------------------- CHANGE HANDLERS -------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    if (keys.length === 2) {
      setFormData((prev) => ({
        ...prev,
        [keys[0]]: { ...prev[keys[0]], [keys[1]]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleChallengeChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    if (keys.length === 2) {
      setChallengeData((prev) => ({
        ...prev,
        [keys[0]]: { ...prev[keys[0]], [keys[1]]: value },
      }));
    } else {
      setChallengeData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  // ------------------- SEARCH EFFECTS -------------------
  useEffect(() => {
    if (!authorTyping.trim()) {
      setFilteredAuthors([]);
      return;
    }

    const fetchAuthors = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/author/search`,
          {
            params: { search: authorTyping },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFilteredAuthors(response.data.authors || []);
      } catch (error) {
        console.error(error);
      }
    };

    const timeoutId = setTimeout(fetchAuthors, 300);
    return () => clearTimeout(timeoutId);
  }, [authorTyping]);

  useEffect(() => {
    if (!categoryTyping.trim()) {
      setFilteredCategories([]);
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/category/search`,
          {
            params: { search: categoryTyping },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFilteredCategories(response.data.categories || []);
      } catch (error) {
        console.error(error);
      }
    };

    const timeoutId = setTimeout(fetchCategories, 300);
    return () => clearTimeout(timeoutId);
  }, [categoryTyping]);

  useEffect(() => {
    if (!sizeCategoryTyping.trim()) {
      setFilteredSizeCategories([]);
      return;
    }

    const fetchSizeCategories = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/size-category/search`,
          {
            params: { search: sizeCategoryTyping },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFilteredSizeCategories(response.data.size_categories || []);
      } catch (error) {
        console.error(error);
      }
    };

    const timeoutId = setTimeout(fetchSizeCategories, 300);
    return () => clearTimeout(timeoutId);
  }, [sizeCategoryTyping]);

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
      }catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong, please try agian!"
      );
    } 
    };

    const timeoutId = setTimeout(fetchCountries, 300);
    return () => clearTimeout(timeoutId);
  }, [countryTyping]);

  // ------------------- SUBMIT HANDLER -------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoading(true);

    try {
      const data = new FormData();

      data.append("title[en]", formData.title.en);
      data.append("title[ar]", formData.title.ar);
      data.append("description[en]", formData.description.en);
      data.append("description[ar]", formData.description.ar);
      data.append("author_id", formData.authorId);
      data.append("category_id", formData.categoryId);
      data.append("size_category_id", formData.sizeCategoryId);
      data.append("country_id", formData.countryId);
      data.append("cover_image", formData.coverImage);
      data.append("book_file", formData.bookFile);
      data.append("publish_date", formData.publishDate);
      data.append("number_of_pages", formData.pages);
      data.append("points", formData.points);
      data.append("summary[en]", formData.summaryLinkEn);
      data.append("summary[ar]", formData.summaryLinkAr);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/books",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newBookId = response.data.data.id;
      setBookId(newBookId);
      setChallengeFormEnabled(true);
      toast.success("Book added successfully! Please add the challenge now.");
      setFormData({
        title: { en: "", ar: "" },
        description: { en: "", ar: "" },
        authorId: "",
        authorName: "",
        categoryId: "",
        categoryName: "",
        sizeCategoryId: "",
        sizeCategoryName: "",
        countryId: "",
        countryName: "",
        publishDate: "",
        pages: "",
        points: "",
        summaryLinkEn: "",
        summaryLinkAr: "",
        bookFile: null,
        coverImage: null,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add book, please try agian!"
      );
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleSubmitChallenge = async (e) => {
    e.preventDefault();
    if (!bookId) {
      toast.error("Please add the book first.");
      return;
    }
    const challengeDataToSend = new FormData(); // 1. إنشاء كائن FormData جديد
    challengeDataToSend.append("book_id", bookId);
    challengeDataToSend.append("duration", challengeData.duration);
    challengeDataToSend.append("points", challengeData.points);
    challengeDataToSend.append("description[en]", challengeData.description.en);
    challengeDataToSend.append("description[ar]", challengeData.description.ar);

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/bookchallenge/create",
        challengeDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Book challenge added successfully!");
      setChallengeData({
        duration: "",
        points: "",
        description: { en: "", ar: "" },
      });
      setBookId(null);
      setChallengeFormEnabled(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to add book challenge, please try agian!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PermissionGuard allowedRoles={["super_admin","admin"]}  requiredPermissions={["read book","create book"]}>
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Book Information Section Card */}
        <div className={styles.card}>
          <div className={styles.sectionHeader}>
            <Icon
              icon="mdi:book-open-variant-outline"
              className={styles.sectionIcon}
            />
            <h2 className={styles.sectionTitle}>Book Information</h2>
          </div>

          <div className={styles.grid}>
            <div>
              <label className={styles.label}>
                Title <span className={styles.requiredStar}>*</span>
              </label>
              <input
                type="text"
                name="title.en"
                value={formData.title.en}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
            <div>
              <label className={`${styles.label} ${styles.rtlText}`}>
                عنوان الكتاب <span className={styles.requiredStar}>*</span>
              </label>
              <input
                type="text"
                name="title.ar"
                value={formData.title.ar}
                onChange={handleChange}
                required
                className={`${styles.input} ${styles.rtlInput}`}
              />
            </div>
          </div>

          <div className={styles.searchableContainer}>
            <label className={styles.label}>
              Author <span className={styles.requiredStar}>*</span>
            </label>
            <input
              type="text"
              value={formData.authorName}
              onChange={(e) => {
                setAuthorTyping(e.target.value);
                setFormData((prev) => ({
                  ...prev,
                  authorName: e.target.value,
                  authorId: "",
                }));
              }}
              required
              placeholder="Search for author..."
              className={styles.input}
            />
            {filteredAuthors.length > 0 && (
              <ul className={styles.searchResultsList}>
                {filteredAuthors.map((a) => (
                  <li
                    key={a.id}
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        authorId: a.id,
                        authorName: a.name,
                      }));
                      setFilteredAuthors([]);
                    }}
                    className={styles.searchResultItem}
                  >
                    {a.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.grid}>
            <div>
              <label htmlFor="description-en" className={styles.label}>
                Description <span className={styles.requiredStar}>*</span>
              </label>
              <textarea
                id="description-en"
                name="description.en"
                value={formData.description.en}
                onChange={handleChange}
                placeholder="Enter description in English"
                rows="4"
                required
                className={styles.input}
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="description-ar"
                className={`${styles.label} ${styles.rtlText}`}
              >
                وصف الكتاب <span className={styles.requiredStar}>*</span>
              </label>
              <textarea
                id="description-ar"
                name="description.ar"
                value={formData.description.ar}
                onChange={handleChange}
                placeholder="أدخل وصف الكتاب باللغة العربية"
                rows="4"
                required
                className={`${styles.input} ${styles.rtlInput}`}
              ></textarea>
            </div>
          </div>

          {/* Category Field with Search */}
          <div className={styles.searchableContainer}>
            <label htmlFor="category" className={styles.label}>
              Category <span className={styles.requiredStar}>*</span>
            </label>
            <input
              type="text"
              value={formData.categoryName}
              onChange={(e) => {
                setCategoryTyping(e.target.value);
                setFormData((prev) => ({
                  ...prev,
                  categoryName: e.target.value,
                  categoryId: "",
                }));
              }}
              required
              placeholder="Search for category..."
              className={styles.input}
            />
            {filteredCategories.length > 0 && (
              <ul className={styles.searchResultsList}>
                {filteredCategories.map((a) => (
                  <li
                    key={a.id}
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        categoryId: a.id,
                        categoryName: a.name,
                      }));
                      setFilteredCategories([]);
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

        {/* Publication Details Section Card */}
        <div className={styles.card}>
          <div className={styles.sectionHeader}>
            <Icon icon="tabler:list-details" className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Book Details</h2>
          </div>
          <p className={styles.sectionDescription}>
            Provide more details about the book.
          </p>
          <div className={`${styles.grid} ${styles.mdGridCols2}`}>
            <div>
              <label htmlFor="publishDate" className={styles.label}>
                Publish Date <span className={styles.requiredStar}>*</span>
              </label>
              <input
                type="date"
                id="publishDate"
                name="publishDate"
                value={formData.publishDate}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
            <div>
              <label htmlFor="pages" className={styles.label}>
                Number of Pages <span className={styles.requiredStar}>*</span>
              </label>
              <input
                type="number"
                id="pages"
                name="pages"
                value={formData.pages}
                onChange={handleChange}
                placeholder="e.g., 250"
                required
                className={styles.input}
              />
            </div>

            <div>
              <label htmlFor="points" className={styles.label}>
                Points <span className={styles.requiredStar}>*</span>
              </label>
              <input
                type="number"
                id="points"
                name="points"
                value={formData.points} // Correctly linked to formData.points
                onChange={handleChange}
                placeholder="e.g., 25"
                required
                className={styles.input}
              />
            </div>

            {/* Book Size Field with Search */}
            <div className={styles.searchableContainer}>
              <label htmlFor="bookSize" className={styles.label}>
                Size Category <span className={styles.requiredStar}>*</span>
              </label>
              <input
                type="text"
                value={formData.sizeCategoryName}
                onChange={(e) => {
                  setSizeCategoryTyping(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    sizeCategoryName: e.target.value,
                    sizeCategoryId: "",
                  }));
                }}
                required
                placeholder="Search for size category..."
                className={styles.input}
              />
              {filteredSizeCategories.length > 0 && (
                <ul className={styles.searchResultsList}>
                  {filteredSizeCategories.map((a) => (
                    <li
                      key={a.id}
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          sizeCategoryId: a.id,
                          sizeCategoryName: a.name,
                        }));
                        setFilteredSizeCategories([]);
                      }}
                      className={styles.searchResultItem}
                    >
                      {a.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label htmlFor="summaryLinkEn" className={styles.label}>
                English Summary Link
              </label>
              <input
                type="url"
                id="summaryLinkEn"
                name="summaryLinkEn"
                value={formData.summaryLinkEn}
                onChange={handleChange}
                placeholder="https://example.com/en-summary"
                className={styles.input}
              />
            </div>
            <div>
              <label
                htmlFor="summaryLinkAr"
                className={`${styles.label} ${styles.rtlText}`}
              >
                رابط الملخص العربي
              </label>
              <input
                type="url"
                id="summaryLinkAr"
                name="summaryLinkAr"
                value={formData.summaryLinkAr}
                onChange={handleChange}
                placeholder="https://example.com/ar-summary"
                className={`${styles.input} ${styles.rtlInput}`}
              />
            </div>
          </div>
        </div>

        {/* File Uploads Section Card */}
        <div className={styles.card}>
          <div className={styles.sectionHeader}>
            <Icon icon="uil:file-alt" className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>File Uploads</h2>
          </div>
          <p className={styles.sectionDescription}>
            Upload the book file and cover image.
          </p>
          <div className={`${styles.grid} ${styles.mdGridCols2}`}>
            <div>
              <label htmlFor="bookFile" className={styles.label}>
                Book File <span className={styles.requiredStar}>*</span>
              </label>
              <input
                type="file"
                id="bookFile"
                name="bookFile"
                onChange={handleFileChange}
                required
                className={styles.fileInput}
              />
            </div>
            <div>
              <label htmlFor="coverImage" className={styles.label}>
                Cover Image <span className={styles.requiredStar}>*</span>
              </label>
              <input
                type="file"
                id="coverImage"
                name="coverImage"
                onChange={handleFileChange}
                required
                className={styles.fileInput}
              />
            </div>
          </div>
        </div>

        {/* Location Information Section Card */}
        <div className={styles.card}>
          <div className={styles.sectionHeader}>
            <Icon
              icon="mdi:map-marker-outline"
              className={styles.sectionIcon}
            />
            <h2 className={styles.sectionTitle}>Location Information</h2>
          </div>
          <p className={styles.sectionDescription}>Specify the country.</p>

          {/* Country Field with Search */}
          <div className={styles.searchableContainer}>
            <label htmlFor="country" className={styles.label}>
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

        {/* Submit Button */}
        <div className={styles.submitButtonWrapper}>
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? "Adding..." : "Add Book"}
          </button>
        </div>
      </form>

      {challengeFormEnabled && (
        <form onSubmit={handleSubmitChallenge} className={styles.form}>
          <div className={styles.card}>

          <div className={styles.sectionHeader}>
            <Icon icon="mdi:trophy-outline" className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Book Challenge</h2>
          </div>

            <div className={styles.grid}>
              <div>
                <label htmlFor="description-en" className={styles.label}>
                  Description <span className={styles.requiredStar}>*</span>
                </label>
                <textarea
                  id="description-en"
                  name="description.en"
                  value={challengeData.description.en}
                  onChange={handleChallengeChange}
                  placeholder="Enter description in English"
                  rows="2"
                  required
                  className={styles.input}
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="description-ar"
                  className={`${styles.label} ${styles.rtlText}`}
                >
                  وصف التحدي <span className={styles.requiredStar}>*</span>
                </label>
                <textarea
                  id="description-ar"
                  name="description.ar"
                  value={challengeData.description.ar}
                  onChange={handleChallengeChange}
                  placeholder="أدخل وصف التحدي  باللغة العربية"
                  rows="2"
                  required
                  className={`${styles.input} ${styles.rtlInput}`}
                ></textarea>
              </div>
            </div>
            <div>
              <label htmlFor="points" className={styles.label}>
                Points <span className={styles.requiredStar}>*</span>
              </label>
              <input
                type="number"
                id="points"
                name="points"
                value={challengeData.points}
                onChange={handleChallengeChange}
                placeholder="e.g., 25"
                required
                className={styles.input}
              />
            </div>

            <div>
              <label htmlFor="duration" className={styles.label}>
                Duration <span className={styles.requiredStar}>*</span>
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={challengeData.duration}
                onChange={handleChallengeChange}
                placeholder="e.g., 8"
                required
                className={styles.input}
              />
            </div>
          </div>
          <div className={styles.submitButtonWrapper}>
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? "Adding..." : "Add Book Challenge"}
            </button>
          </div>
        </form>
      )}
    </div>
    </PermissionGuard>

  );
}
