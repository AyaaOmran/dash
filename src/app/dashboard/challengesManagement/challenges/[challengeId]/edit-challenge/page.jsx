"use client"
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import styles from './editChallenge.module.css';
import { useParams, useRouter } from 'next/navigation';
import PermissionGuard from '@/components/features/guard/PermissionGuard';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function EditChallenge() {
  const { challengeId } = useParams();
  const router = useRouter();

  // -------------------- States --------------------
  const [categoryTyping, setCategoryTyping] = useState("");
  const [sizeCategoryTyping, setSizeCategoryTyping] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredSizeCategories, setFilteredSizeCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: { en: '', ar: '' },
    description: { en: '', ar: '' },
    points: '',
    duration: '',
    number_of_books: '',
    category_id: "",
    size_category_id: "",
    booksNames: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // -------------------- Fetch challenge details --------------------
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/challenges/${challengeId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = res.data.data;

        setFormData({
          title: data.title || { en: '', ar: '' },
          description: data.description || { en: '', ar: '' },
          points: data.points || '',
          duration: data.duration || '',
          number_of_books: data.number_of_books || '',
          category_id: data.category_id || "",
          size_category_id: data.size_category_id || "",
          booksNames: data.books?.map(b => b.title_book.en) || [],
        });

        setCategoryTyping(data.category_name?.en || '');
        setSizeCategoryTyping(data.size_category_name?.en || '');
      } catch (err) {
        toast.error('Failed to fetch challenge details');
      }
    };
    fetchChallenge();
  }, [challengeId, router]);

  // -------------------- Debounced search --------------------
  useEffect(() => {
    if (typeof categoryTyping !== "string" || !categoryTyping.trim()) {
      setFilteredCategories([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/category/search", {
          params: { search: categoryTyping },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setFilteredCategories(res.data.categories || []);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [categoryTyping]);

  useEffect(() => {
    if (typeof sizeCategoryTyping !== "string" || !sizeCategoryTyping.trim()) {
      setFilteredSizeCategories([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/size-category/search", {
          params: { search: sizeCategoryTyping },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setFilteredSizeCategories(res.data.size_categories || []);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [sizeCategoryTyping]);

  // -------------------- Handlers --------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [main, sub] = name.split('.');
      setFormData(prev => ({ ...prev, [main]: { ...prev[main], [sub]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCategorySelect = (cat) => {
    setFormData(prev => ({ ...prev, category_id: cat.id }));
    setCategoryTyping(cat.en);
    setFilteredCategories([]);
  };

  const handleSizeCategorySelect = (cat) => {
    setFormData(prev => ({ ...prev, size_category_id: cat.id }));
    setSizeCategoryTyping(cat.en);
    setFilteredSizeCategories([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        points: formData.points,
        duration: formData.duration,
        number_of_books: formData.number_of_books,
        category_id: formData.category_id,
        size_category_id: formData.size_category_id,
      };

      await axios.post(
        `http://127.0.0.1:8000/api/challenge/update/${challengeId}`,
        payload,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      toast.success('Challenge updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update challenge');
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------- Render --------------------
  return (
    <PermissionGuard allowedRoles={["super_admin","admin"]} requiredPermissions={["read challenge","update challenge"]}>
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.form}>

          {/* Title & Description */}
          <div className={styles.card}>
            <div className={styles.grid}>
              <div>
                <label className={styles.label}>Title (EN)</label>
                <input type="text" name="title.en" value={formData.title.en} onChange={handleChange} className={styles.input} />
              </div>
              <div>
                <label className={styles.label}>Title (AR)</label>
                <input type="text" name="title.ar" value={formData.title.ar} onChange={handleChange} className={styles.input} />
              </div>
            </div>

            <div className={styles.grid}>
              <div>
                <label className={styles.label}>Description (EN)</label>
                <textarea name="description.en" value={formData.description.en} onChange={handleChange} className={styles.input} rows={4} />
              </div>
              <div>
                <label className={styles.label}>Description (AR)</label>
                <textarea name="description.ar" value={formData.description.ar} onChange={handleChange} className={styles.input} rows={4} />
              </div>
            </div>

            <div className={styles.grid}>
              <div>
                <label className={styles.label}>Points</label>
                <input type="number" name="points" value={formData.points} onChange={handleChange} className={styles.input} />
              </div>
              <div>
                <label className={styles.label}>Duration (days)</label>
                <input type="number" name="duration" value={formData.duration} onChange={handleChange} className={styles.input} />
              </div>
              <div>
                <label className={styles.label}>Number of Books</label>
                <input type="number" name="number_of_books" value={formData.number_of_books} onChange={handleChange} className={styles.input} />
              </div>
            </div>

            {/* Category & Size Category with search */}
            <div className={styles.grid}>
              <div>
                <label className={styles.label}>Category</label>
                <input type="text" value={categoryTyping} onChange={(e) => setCategoryTyping(e.target.value)} className={styles.input} />
                {filteredCategories.length > 0 && (
                  <ul className={styles.searchResultsList}>
                    {filteredCategories.map(cat => (
                      <li key={cat.id} className={styles.searchResultItem} onClick={() => handleCategorySelect(cat)}>
                        {cat.en} / {cat.ar}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <label className={styles.label}>Size Category</label>
                <input type="text" value={sizeCategoryTyping} onChange={(e) => setSizeCategoryTyping(e.target.value)} className={styles.input} />
                {filteredSizeCategories.length > 0 && (
                  <ul className={styles.searchResultsList}>
                    {filteredSizeCategories.map(cat => (
                      <li key={cat.id} className={styles.searchResultItem} onClick={() => handleSizeCategorySelect(cat)}>
                        {cat.en} / {cat.ar}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Selected Books (Read-only) */}
          {formData.booksNames.length > 0 && (
            <div className={styles.card}>
              <p>Books in Challenge:</p>
              <ul>
                {formData.booksNames.map((title, i) => (
                  <li key={i}>{title}</li>
                ))}
              </ul>
            </div>
          )}

          <div className={styles.submitButtonWrapper}>
            <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
              {isSubmitting ? 'Updating...' : 'Update Challenge'}
            </button>
          </div>
        </form>
      </div>
    </PermissionGuard>
  );
}
