"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import styles from "./addChallenge.module.css";
import PermissionGuard from "@/components/features/guard/PermissionGuard";
import axios from "axios";
import FullPageLoader from "@/components/common/FullPageLoader";
import { toast } from "react-toastify";

export default function AddChallenge() {
  const [formData, setFormData] = useState({
    title: { en: "", ar: "" },
    description: { en: "", ar: "" },
    categoryId: "",
    categoryName: "",
    sizeCategoryId: "",
    sizeCategoryName: "",
    duration: "",
    number_of_books: "",
    points: "",
    booksIds: [],
    booksNames: [],
    bookFile: null,
    coverImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredSizeCategories, setFilteredSizeCategories] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [categoryTyping, setCategoryTyping] = useState("");
  const [sizeCategoryTyping, setSizeCategoryTyping] = useState("");
  const [bookTyping, setBookTyping] = useState("");

  // Fetch categories
  useEffect(() => {
    if (!categoryTyping.trim()) return setFilteredCategories([]);
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/category/search", {
          params: { search: categoryTyping },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setFilteredCategories(res.data.categories || []);
      } catch (err) {
        console.error(err);
      }
    };
    const timeout = setTimeout(fetchCategories, 300);
    return () => clearTimeout(timeout);
  }, [categoryTyping]);

  // Fetch size categories
  useEffect(() => {
    if (!sizeCategoryTyping.trim()) return setFilteredSizeCategories([]);
    const fetchSizeCategories = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/size-category/search", {
          params: { search: sizeCategoryTyping },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setFilteredSizeCategories(res.data.size_categories || []);
      } catch (err) {
        console.error(err);
      }
    };
    const timeout = setTimeout(fetchSizeCategories, 300);
    return () => clearTimeout(timeout);
  }, [sizeCategoryTyping]);

  // Fetch books
  useEffect(() => {
    if (!bookTyping.trim()) return setFilteredBooks([]);
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/book/search", {
          params: { search: bookTyping },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setFilteredBooks(res.data.books || []);
      } catch (err) {
        console.error(err);
      }
    };
    const timeout = setTimeout(fetchBooks, 300);
    return () => clearTimeout(timeout);
  }, [bookTyping]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [main, sub] = name.split(".");
      setFormData((prev) => ({ ...prev, [main]: { ...prev[main], [sub]: value } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectCategory = (id, name) => {
    setFormData((prev) => ({ ...prev, categoryId: id, categoryName: name }));
    setFilteredCategories([]);
  };

  const handleSelectSizeCategory = (id, name) => {
    setFormData((prev) => ({ ...prev, sizeCategoryId: id, sizeCategoryName: name }));
    setFilteredSizeCategories([]);
  };

  const handleSelectBook = (id, title) => {
    setFormData((prev) => ({
      ...prev,
      booksIds: [...prev.booksIds, id],
      booksNames: [...prev.booksNames, title],
    }));
    setBookTyping("");
    setFilteredBooks([]);
  };

  const handleRemoveBook = (index) => {
    setFormData((prev) => {
      const newIds = [...prev.booksIds];
      const newNames = [...prev.booksNames];
      newIds.splice(index, 1);
      newNames.splice(index, 1);
      return { ...prev, booksIds: newIds, booksNames: newNames };
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("title[en]", formData.title.en);
      data.append("title[ar]", formData.title.ar);
      data.append("description[en]", formData.description.en);
      data.append("description[ar]", formData.description.ar);
      data.append("category_id", formData.categoryId);
      data.append("size_category_id", formData.sizeCategoryId);
      data.append("duration", formData.duration);
      data.append("number_of_books", formData.number_of_books);
      data.append("points", formData.points);
      formData.booksIds.forEach((id) => data.append("books[]", id));
      if (formData.bookFile) data.append("book_file", formData.bookFile);
      if (formData.coverImage) data.append("cover_image", formData.coverImage);

      const res = await axios.post("http://127.0.0.1:8000/api/challenges", data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      toast.success("Challenge added successfully!");
      setFormData({
        title: { en: "", ar: "" },
        description: { en: "", ar: "" },
        categoryId: "",
        categoryName: "",
        sizeCategoryId: "",
        sizeCategoryName: "",
        duration: "",
        number_of_books: "",
        points: "",
        booksIds: [],
        booksNames: [],
        bookFile: null,
        coverImage: null,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add challenge.");
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <PermissionGuard allowedRoles={["super_admin", "admin"]} requiredPermissions={["read challenge","create challenge"]}>
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.form}>

          {/* Challenge Information */}
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <Icon icon="mdi:trophy-outline" className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Challenge Information</h2>
            </div>
            <div className={styles.grid}>
              <div>
                <label className={styles.label}>Title <span className={styles.requiredStar}>*</span></label>
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
                <label className={`${styles.label} ${styles.rtlText}`}>العنوان <span className={styles.requiredStar}>*</span></label>
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

            <div className={styles.grid}>
              <div>
                <label className={styles.label}>Description <span className={styles.requiredStar}>*</span></label>
                <textarea
                  name="description.en"
                  value={formData.description.en}
                  onChange={handleChange}
                  required
                  rows="4"
                  className={styles.input}
                ></textarea>
              </div>
              <div>
                <label className={`${styles.label} ${styles.rtlText}`}>الوصف <span className={styles.requiredStar}>*</span></label>
                <textarea
                  name="description.ar"
                  value={formData.description.ar}
                  onChange={handleChange}
                  required
                  rows="4"
                  className={`${styles.input} ${styles.rtlInput}`}
                ></textarea>
              </div>
            </div>

            {/* Category Search */}
            <div className={styles.searchableContainer}>
              <label className={styles.label}>Category</label>
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
                placeholder="Search category..."
                className={styles.input}
              />
              {filteredCategories.length > 0 && (
                <ul className={styles.searchResultsList}>
                  {filteredCategories.map((a) => (
                    <li
                      key={a.id}
                      onClick={() => handleSelectCategory(a.id, a.name)}
                      className={styles.searchResultItem}
                    >
                      {a.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Challenge Details */}
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <Icon icon="tabler:list-details" className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Challenge Details</h2>
            </div>
            <div className={`${styles.grid} ${styles.mdGridCols2}`}>
              <div>
                <label className={styles.label}>Duration</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>
              <div>
                <label className={styles.label}>Number of Books</label>
                <input
                  type="number"
                  name="number_of_books"
                  value={formData.number_of_books}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>
              <div className={styles.searchableContainer}>
                <label className={styles.label}>Size Category</label>
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
                  placeholder="Search size category..."
                  className={styles.input}
                />
                {filteredSizeCategories.length > 0 && (
                  <ul className={styles.searchResultsList}>
                    {filteredSizeCategories.map((a) => (
                      <li
                        key={a.id}
                        onClick={() => handleSelectSizeCategory(a.id, a.name)}
                        className={styles.searchResultItem}
                      >
                        {a.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <label className={styles.label}>Points</label>
                <input
                  type="number"
                  name="points"
                  value={formData.points}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Challenge Books */}
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <Icon icon="ph:books" className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Challenge Books</h2>
            </div>
            <div className={styles.searchableContainer}>
              <label className={styles.label}>Books</label>
              <input
                type="text"
                value={bookTyping}
                onChange={(e) => setBookTyping(e.target.value)}
                placeholder="Search for books..."
                className={styles.input}
              />
              {filteredBooks.length > 0 && (
                <ul className={styles.searchResultsList}>
                  {filteredBooks.map((book) => (
                    <li
                      key={book.id}
                      onClick={() => handleSelectBook(book.id, book.title)}
                      className={styles.searchResultItem}
                    >
                      {book.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {formData.booksNames.length > 0 && (
              <div className={styles.selectedItems}>
                <p>Selected Books:</p>
                <ul>
                  {formData.booksNames.map((title, i) => (
                    <li key={i} className={styles.selectedBookItem}>
                      {title}
                      <button
                        type="button"
                        className={styles.removeBookBtn}
                        onClick={() => handleRemoveBook(i)}
                      >
                        ❌
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className={styles.submitButtonWrapper}>
            <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
              {isSubmitting ? "Adding..." : "Add Challenge"}
            </button>
          </div>
        </form>
      </div>
    </PermissionGuard>
  );
}
