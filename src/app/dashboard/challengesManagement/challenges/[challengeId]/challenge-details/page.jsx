"use client";
import React, { useEffect, useState } from "react";
import styles from "./challengeDetails.module.css";
import { Icon } from "@iconify/react";
import PermissionGuard from "@/components/features/guard/PermissionGuard";
import axios from "axios";
import { toast } from "react-toastify";
import FullPageLoader from "@/components/common/FullPageLoader";
import { useParams } from "next/navigation";

export default function ChallengeDetails() {
    const { challengeId } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://127.0.0.1:8000/api/challenges/${challengeId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          const data = response.data.data;
          setChallenge({
            title: data.title || "Challenge Title",
            description: data.description?.en || "",
            points: data.points || 0,
            category: data.category?.en || "",
            sizeCategory: data.size_category?.en || "",
            duration: data.duration || "",
            participants: data.participants || 0,
            booksNumber: data.number_of_books || 0,
            books: data.books_pdfs || [],
          });
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenge();
  }, [challengeId]);

  if (isLoading) return <FullPageLoader/>;
  if (!challenge) return <p>No challenge data found.</p>;

  return (
    <PermissionGuard
      allowedRoles={["super_admin", "admin"]}
      requiredPermissions={["read challenge"]}
    >
      <div className={styles.container}>
        {/* Challenge Info */}
        <div className={styles.challengeInfo}>
          <Icon icon="mdi:trophy-outline" className={styles.headingIcon} />
          <h1 className={styles.challengeTitle}>{challenge.title}</h1>
          <div className={styles.descriptionCard}>
            <p>{challenge.description}</p>
          </div>
        </div>

        {/* Challenge Details */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Challenge Details</h2>
          <div className={styles.details}>
            <div className={styles.deItem}>
              <div className={styles.deIconContainer}>
                <Icon icon="mdi:view-grid-outline" className={styles.deIcon} />
              </div>
              <div className={styles.deText}>
                <div className={styles.deNum}>{challenge.category}</div>
                <div className={styles.deDetail}>Category</div>
              </div>
            </div>

            <div className={styles.deItem}>
              <div className={styles.deIconContainer}>
                <Icon icon="mingcute:time-line" className={styles.deIcon} />
              </div>
              <div className={styles.deText}>
                <div className={styles.deNum}>{challenge.duration}</div>
                <div className={styles.deDetail}>Duration</div>
              </div>
            </div>

            <div className={styles.deItem}>
              <div className={styles.deIconContainer}>
                <Icon icon="gg:size" className={styles.deIcon} />
              </div>
              <div className={styles.deText}>
                <div className={styles.deNum}>{challenge.sizeCategory}</div>
                <div className={styles.deDetail}>Size Category</div>
              </div>
            </div>

            <div className={styles.deItem}>
              <div className={styles.deIconContainer}>
                <Icon
                  icon="mdi:star-four-points-circle-outline"
                  className={styles.deIcon}
                />
              </div>
              <div className={styles.deText}>
                <div className={styles.deNum}>{challenge.points}</div>
                <div className={styles.deDetail}>Points</div>
              </div>
            </div>

            <div className={styles.deItem}>
              <div className={styles.deIconContainer}>
                <Icon icon="ph:users-three-bold" className={styles.deIcon} />
              </div>
              <div className={styles.deText}>
                <div className={styles.deNum}>{challenge.participants}</div>
                <div className={styles.deDetail}>Participants</div>
              </div>
            </div>

            <div className={styles.deItem}>
              <div className={styles.deIconContainer}>
                <Icon icon="ph:books-bold" className={styles.deIcon} />
              </div>
              <div className={styles.deText}>
                <div className={styles.deNum}>{challenge.booksNumber}</div>
                <div className={styles.deDetail}>Books</div>
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Books */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Challenge Books</h2>
          <div className={styles.booksGrid}>
            {challenge.books.length === 0 && <p>No books available</p>}
            {challenge.books.map((book, index) => (
              <div key={index} className={styles.bookItem}>
                <div className={styles.bookCoverContainer}>
                  <img
                    src={
                      book.cover ||
                      "https://placehold.co/64x96/E5E7EB/4B5563?text=Cover"
                    }
                    alt={book.title || "Book"}
                    className={styles.bookCover}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/64x96/E5E7EB/4B5563?text=Cover";
                    }}
                  />
                </div>
                <div className={styles.bookDetails}>
                  <h3 className={styles.bookTitle}>{book.title || "Book"}</h3>
                  <p className={styles.bookAuthor}>{book.author || ""}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
}
