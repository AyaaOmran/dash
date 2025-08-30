"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import PermissionGuard from "@/components/features/guard/PermissionGuard";
import FullPageLoader from "@/components/common/FullPageLoader";
import styles from "./editBook.module.css";
import { Icon } from "@iconify/react";

export default function EditBook() {
  const { bookId } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: { en: "", ar: "" },
    description: { en: "", ar: "" },
    summary: { en: "", ar: "" },
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
    bookFile: null,
    coverImage: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [authorTyping, setAuthorTyping] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [categoryTyping, setCategoryTyping] = useState("");
  const [filteredSizeCategories, setFilteredSizeCategories] = useState([]);
  const [sizeCategoryTyping, setSizeCategoryTyping] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [countryTyping, setCountryTyping] = useState("");

  // Fetch book data
  useEffect(() => {
    if (!bookId) return;

    const fetchBookData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://127.0.0.1:8000/api/books/${bookId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        const data = response.data.data;
        setFormData({
          title: { en: data.title?.en || "", ar: data.title?.ar || "" },
          description: { en: data.description?.en || "", ar: data.description?.ar || "" },
          summary: { en: data.summary?.en || "", ar: data.summary?.ar || "" },
          authorId: data.author_id || "",
          authorName: data.author_name || "",
          categoryId: data.category_id || "",
          categoryName: data.category_name || "",
          sizeCategoryId: data.size_category_id || "",
          sizeCategoryName: data.size_category_name || "",
          countryId: data.country_id || "",
          countryName: data.country_name || "",
          publishDate: data.publish_date || "",
          pages: data.number_of_pages || "",
          points: data.points || "",
          bookFile: null,
          coverImage: null,
        });
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookData();
  }, [bookId, router]);

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
  
const handleAuthorTypingChange = (e) => {
  const value = e.target.value;
  setAuthorTyping(value);
  setFormData((prev) => ({
    ...prev,
    authorName: value,
    authorId: "",
  }));
};

const handleCategoryTypingChange = (e) => {
  const value = e.target.value;
  setCategoryTyping(value);
  setFormData((prev) => ({
    ...prev,
    categoryName: value,
    categoryId: "",
  }));
};


  // Handle input change
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

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.authorId) {
      toast.error("Please select an author from the search results.");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append("title[en]", formData.title.en);
      data.append("title[ar]", formData.title.ar);
      data.append("description[en]", formData.description.en);
      data.append("description[ar]", formData.description.ar);
      data.append("summary[en]", formData.summary.en);
      data.append("summary[ar]", formData.summary.ar);
      data.append("author_id", formData.authorId);
      data.append("category_id", formData.categoryId);
      data.append("size_category_id", formData.sizeCategoryId);
      data.append("country_id", formData.countryId);
      data.append("publish_date", formData.publishDate);
      data.append("number_of_pages", formData.pages);
      data.append("points", formData.points);
      if (formData.bookFile) data.append("book_pdf", formData.bookFile);
      if (formData.coverImage) data.append("cover_image", formData.coverImage);

      await axios.post(`http://127.0.0.1:8000/api/book/update/${bookId}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Book updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update book.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <FullPageLoader />;

  return (
    <PermissionGuard
      allowedRoles={["super_admin", "admin"]}
      requiredPermissions={["read book", "update book"]}
    >
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* ---------------- Book Information Section ---------------- */}
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <Icon
                icon="mdi:book-open-variant-outline"
                className={styles.sectionIcon}
              />
              <h2 className={styles.sectionTitle}>Book Information</h2>
            </div>
            <p className={styles.sectionDescription}>
              Update the information for the book in both English and Arabic.
            </p>

            {/* Title */}
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
                  required
                  className={styles.input}
                />
              </div>
              <div>
                <label
                  htmlFor="title-ar"
                  className={`${styles.label} ${styles.rtlText}`}
                >
                  عنوان الكتاب <span className={styles.requiredStar}>*</span>
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

            {/* Author Search */}
            <div className={styles.searchableContainer}>
              <label className={styles.label}>
                Author <span className={styles.requiredStar}>*</span>
              </label>
              <input
                type="text"
                value={formData.authorName}
                onChange={handleAuthorTypingChange}
                required
                placeholder="Search for author..."
                className={styles.input}
              />
              {filteredAuthors.length > 0 && (
                <ul className={styles.searchResultsList}>
                  {filteredAuthors.map((a) => (
                    <li
                      key={a.id}
                      onClick={() => handleAuthorSelection(a)}
                      className={styles.searchResultItem}
                    >
                      {a.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Description */}
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
                  rows="4"
                  required
                  className={`${styles.input} ${styles.rtlInput}`}
                ></textarea>
              </div>
            </div>

            {/* Category Search */}
            <div className={styles.searchableContainer}>
              <label htmlFor="category" className={styles.label}>
                Category <span className={styles.requiredStar}>*</span>
              </label>
              <input
                type="text"
                value={formData.categoryName}
onChange={handleCategoryTypingChange}
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

          {/* ---------------- Book Details ---------------- */}
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <Icon icon="tabler:list-details" className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Book Details</h2>
            </div>

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
                  required
                  className={styles.input}
                />
              </div>
              <div>
                <label htmlFor="points" className={styles.label}>
                  Points
                </label>
                <input
                  type="number"
                  id="points"
                  name="points"
                  value={formData.points}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
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
                <label htmlFor="summary-en" className={styles.label}>
                  English Summary Link
                </label>
                <input
                  type="url"
                  id="summary-en"
                  name="summary.en" // تصحيح اسم الحقل
                  value={formData.summary.en}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
              <div>
                <label
                  htmlFor="summary-ar"
                  className={`${styles.label} ${styles.rtlText}`}
                >
                  رابط الملخص العربي
                </label>
                <input
                  type="url"
                  id="summary-ar"
                  name="summary.ar" // تصحيح اسم الحقل
                  value={formData.summary.ar}
                  onChange={handleChange}
                  className={`${styles.input} ${styles.rtlInput}`}
                />
              </div>
            </div>
          </div>

          {/* ---------------- File Uploads ---------------- */}
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <Icon icon="uil:file-alt" className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>File Uploads</h2>
            </div>
            <p className={styles.sectionDescription}>
              Upload new files only if you want to replace the existing ones.
            </p>
            <div className={`${styles.grid} ${styles.mdGridCols2}`}>
              <div>
                <label htmlFor="bookFile" className={styles.label}>
                  Book File
                </label>
                <input
                  type="file"
                  id="bookFile"
                  name="bookFile"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                  accept=".pdf,.epub,.mobi"
                />
              </div>
              <div>
                <label htmlFor="coverImage" className={styles.label}>
                  Cover Image
                </label>
                <input
                  type="file"
                  id="coverImage"
                  name="coverImage"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                  accept="image/*"
                />
              </div>
            </div>
          </div>

          {/* ---------------- Country ---------------- */}
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <Icon
                icon="mdi:map-marker-outline"
                className={styles.sectionIcon}
              />
              <h2 className={styles.sectionTitle}>Location Information</h2>
            </div>
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

          <div className={styles.submitButtonWrapper}>
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? "Updating..." : "Update Book"}
            </button>
          </div>
        </form>
      </div>
    </PermissionGuard>
  );
}
