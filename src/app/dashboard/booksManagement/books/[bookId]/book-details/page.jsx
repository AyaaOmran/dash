"use client";
import { useState, useEffect } from "react";
import styles from "./bookDetails.module.css";
import { Icon } from "@iconify/react";
import { useParams } from "next/navigation";
import FullPageLoader from "@/components/common/FullPageLoader";
import axios from "axios";
import PermissionGuard from "@/components/features/guard/PermissionGuard";
import { toast } from "react-toastify";

export default function BookDetails() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBookInfo = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/books/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = response.data.data;
      setBook({
        id: bookId,
        title: data.title.en, // 👈 English only
        author: data.author_name,
        cover: data.cover_image,
        description: data.description.en, // 👈 English only
        sizeCategory: data.size_category_name,
        category: data.category_name,
        rating: data.rate,
        readersCount: data.total_readers,
        publishDate: data.publish_date,
        pages: data.number_of_pages,
        summaryLink: data.summary.en, // 👈 English only
        bookPdf: data.book_pdf,
        challenge: {
          duration: `${data.book_challenge.duration} days`,
          points: data.book_challenge.points,
          participants: data.book_challenge_participants,
        },
        comments: data.comments,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!bookId) return;
    fetchBookInfo();
  }, [bookId]);

  if (loading) {
    return <FullPageLoader />;
  }

  if (!book) {
    return <div className={styles.notFoundMessage}>Book not found</div>;
  }

  return (
    <PermissionGuard
      allowedRoles={["super_admin", "admin"]}
      requiredPermissions={["read book"]}
    >
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.bookInfoHeader}>
          <div className={styles.coverWrapper}>
            <img src={book.cover} alt={book.title} className={styles.cover} />
          </div>
          <div className={styles.info}>
            <h1 className={styles.bookTitle}>{book.title}</h1>
            <h3 className={styles.authorName}>by {book.author}</h3>
            <div className={styles.descriptionCard}>
              <p>{book.description}</p>
            </div>
            <div className={styles.buttonContainer}>
              <a
                href={book.summaryLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button
                  className={`${styles.actionButton} ${styles.summaryButton}`}
                >
                  Summary
                </button>
              </a>
              <a href={book.bookPdf} target="_blank" rel="noopener noreferrer">
                <button
                  className={`${styles.actionButton} ${styles.readButton}`}
                >
                  Read
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* Meta & Details */}
        <div className={styles.mainContent}>
          <div className={styles.metaCard}>
            <h2 className={styles.sectionTitle}>About the Book</h2>
            <div className={styles.metaContainer}>
              <div className={styles.metaColumn}>
                <span className={styles.metaItem}>
                  <Icon icon="line-md:star" className={styles.icon} />
                  Rate: {book.rating} / 5
                </span>
                <span className={styles.metaItem}>
                  <Icon icon="bx:book-reader" className={styles.icon} />
                  Readers: {book.readersCount}
                </span>
              </div>
              <div className={styles.metaColumn}>
                <span className={styles.metaItem}>
                  <Icon icon="uiw:date" className={styles.icon} />
                  Published: {book.publishDate}
                </span>
                <span className={styles.metaItem}>
                  <Icon icon="iconoir:page" className={styles.icon} />
                  Pages: {book.pages}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.detailsGrid}>
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>Challenge</h2>
              <p>
                <strong>Participants:</strong> {book.challenge.participants}
              </p>
              <p>
                <strong>Points:</strong> {book.challenge.points}
              </p>
              <p>
                <strong>Duration:</strong> {book.challenge.duration}
              </p>
            </div>
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>Details</h2>
              <p>
                <strong>Size:</strong> {book.sizeCategory}
              </p>
              <p>
                <strong>Category:</strong> {book.category}
              </p>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className={styles.commentsCard}>
          <h2 className={styles.sectionTitle}>Comments</h2>
          <div className={styles.commentsList}>
            {book.comments.length ? (
              book.comments.map((comment, index) => (
                <div key={index} className={styles.commentWrapper}>
                  <div className={styles.comment}>
                    <img
                      src={comment.image}
                      alt={comment.full_name}
                      className={styles.avatar}
                    />
                    <div className={styles.commentContent}>
                      <div className={styles.commentHeader}>
                        <a
                          href={`#/profile/${comment.full_name}`}
                          className={styles.readerName}
                        >
                          {comment.full_name}
                        </a>
                        <span className={styles.badge}>{comment.nickname}</span>
                      </div>
                      <p>{comment.comment}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: "#5A5A5A" }}>No comments yet.</p>
            )}
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
}
