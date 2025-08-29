"use client";
import React, { useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import styles from './editChallenge.module.css';
import { useParams } from 'next/navigation';
import PermissionGuard from '@/components/features/guard/PermissionGuard';

// Mock data for search functionality
const categories = [
  'Fiction', 'Science', 'History', 'Fantasy', 'Biography',
  'Technology', 'Health', 'Cooking', 'Art', 'Travel', 'Self-Help'
];

const bookSizes = [
  'large', 'medium', 'small',
];

const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'Spain', 'Italy', 'Japan', 'China', 'Brazil',
  'Egypt', 'Saudi Arabia', 'United Arab Emirates'
];

// Main component for the Add Book form
export default function EditChallenge() {
  const [formData, setFormData] = useState({
    title: { en: '', ar: '' },
    author: { en: '', ar: '' },
    description: { en: '', ar: '' },
    category: '',
    publishDate: '',
    pages: '',
    bookSize: '',
    summaryLink: '',
    bookFile: null,
    coverImage: null,
    country: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  
  // State for search results
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredBookSizes, setFilteredBookSizes] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);

  // Handle form input changes and search filtering
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data state
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
    
    // Filter search results based on input
    if (name === 'category') {
      const results = categories.filter(item =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCategories(results);
    } else if (name === 'bookSize') {
      const results = bookSizes.filter(item =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredBookSizes(results);
    } else if (name === 'country') {
      const results = countries.filter(item =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCountries(results);
    }
  };

  // Handle selection from search results list
  const handleSelect = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear search results after selection
    if (name === 'category') setFilteredCategories([]);
    if (name === 'bookSize') setFilteredBookSizes([]);
    if (name === 'country') setFilteredCountries([]);
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    
    // Simulate API call
    try {
      console.log('Form Data Submitted:', formData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMessage('Book added successfully!');
      // Clear form after successful submission
      setFormData({
        title: { en: '', ar: '' },
        author: { en: '', ar: '' },
        description: { en: '', ar: '' },
        category: '',
        publishDate: '',
        pages: '',
        bookSize: '',
        summaryLink: '',
        bookFile: null,
        coverImage: null,
        country: '',
      });
    } catch (error) {
      console.error('Submission failed:', error);
      setMessage('Failed to add book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
            <PermissionGuard
              allowedRoles={["super_admin", "admin"]}
              requiredPermissions={["read challenge","update challenge"]}
            >
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Book Information Section Card */}
        <div className={styles.card}>
          <div className={styles.sectionHeader}>
            <Icon icon="mdi:trophy-outline" className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Challenge Information</h2>
          </div>
          <p className={styles.sectionDescription}>
            Update the basic information about the challenge in both English and Arabic.
          </p>
          
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
                placeholder="Enter title in English"
                required
                className={styles.input}
              />
            </div>
            <div>
              <label htmlFor="title-ar" className={`${styles.label} ${styles.rtlText}`}>
                عنوان التحدي 
              </label>
              <input
                type="text"
                id="title-ar"
                name="title.ar"
                value={formData.title.ar}
                onChange={handleChange}
                placeholder="أدخل عنوان التحدي باللغة العربية"
                required
                className={`${styles.input} ${styles.rtlInput}`}
              />
            </div>
          </div>
          
          <div className={styles.grid}>
            <div>
              <label htmlFor="description-en" className={styles.label}>
                Description 
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
              <label htmlFor="description-ar" className={`${styles.label} ${styles.rtlText}`}>
                وصف التحدي 
              </label>
              <textarea
                id="description-ar"
                name="description.ar"
                value={formData.description.ar}
                onChange={handleChange}
                placeholder="أدخل وصف التحدي باللغة العربية"
                rows="4"
                required
                className={`${styles.input} ${styles.rtlInput}`}
              ></textarea>
            </div>
          </div>
          
          {/* Category Field with Search */}
          <div className={styles.searchableContainer}>
            <label htmlFor="category" className={styles.label}>
              Category 
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Fiction, Science, History"
              required
              className={styles.input}
            />
            {filteredCategories.length > 0 && formData.category && (
              <ul className={styles.searchResultsList}>
                {filteredCategories.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelect('category', item)}
                    className={styles.searchResultItem}
                  >
                    {item}
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
            <h2 className={styles.sectionTitle}>Challegne Details</h2>
          </div>
          <p className={styles.sectionDescription}>
            Update challenge details.
          </p>
          <div className={`${styles.grid} ${styles.mdGridCols2}`}>
            <div>
              <label htmlFor="duration" className={styles.label}>
                Duration 
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.publishDate}
                onChange={handleChange}
                placeholder="e.g., 12"
                required
                className={styles.input}
              />
            </div>
            <div>
              <label htmlFor="books" className={styles.label}>
                Number of Books 
              </label>
              <input
                type="number"
                id="books"
                name="books"
                value={formData.pages}
                onChange={handleChange}
                placeholder="e.g., 8"
                required
                className={styles.input}
              />
            </div>
            
            {/* Book Size Field with Search */}
            <div className={styles.searchableContainer}>
              <label htmlFor="bookSize" className={styles.label}>
                Size Category 
              </label>
              <input
                type="text"
                id="bookSize"
                name="bookSize"
                value={formData.bookSize}
                onChange={handleChange}
                placeholder="e.g., large"
                className={styles.input}
              />
              {filteredBookSizes.length > 0 && formData.bookSize && (
                <ul className={styles.searchResultsList}>
                  {filteredBookSizes.map((item, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelect('bookSize', item)}
                      className={styles.searchResultItem}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            
            </div>
            
            <div>
              <label htmlFor="pionts" className={styles.label}>
                Points 
              </label>
              <input
                type="number"
                id="points"
                name="poinst"
                value={formData.summaryLink}
                onChange={handleChange}
                placeholder="e.g., 25"
                className={styles.input}
              />
            </div>
          </div>
        </div>
        
        {/* Location Information Section Card */}
        <div className={styles.card}>
          <div className={styles.sectionHeader}>
            <Icon icon="ph:books" className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Challegne Books</h2>
          </div>
          <p className={styles.sectionDescription}>
            Update choosen books.
          </p>
          
          {/* Country Field with Search */}
          <div className={styles.searchableContainer}>
            <label htmlFor="books" className={styles.label}>
              Books 
            </label>
            <input
              type="text"
              id="books"
              name="books"
              value={formData.country}
              onChange={handleChange}
              placeholder="e.g., Harry Potter"
              required
              className={styles.input}
            />
            {filteredCountries.length > 0 && formData.country && (
              <ul className={styles.searchResultsList}>
                {filteredCountries.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelect('country', item)}
                    className={styles.searchResultItem}
                  >
                    {item}
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
            {isSubmitting ? 'Updating...' : 'Update Challenge'}
          </button>
        </div>

        {/* Message display */}
        {message && (
          <div className={`${styles.message} ${message.includes('successfully') ? styles.successMessage : styles.errorMessage}`}>
            {message}
          </div>
        )}
      </form>
    </div>
            </PermissionGuard>

  );
}
