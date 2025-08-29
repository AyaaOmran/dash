"use client";

import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { redirect, useParams, } from "next/navigation";
import { Icon } from "@iconify/react";
import styles from "./profile.module.css";
import { toast } from "react-toastify";
import PermissionGuard from "@/components/features/guard/PermissionGuard";
import FullPageLoader from "@/components/common/FullPageLoader";
import { usePermissions } from "@/context/PermissionsContext"; 

export default function ReaderProfile() {
  const [reader, setReader] = useState(null);
  const [loading, setLoading] = useState(true);
  const { readerId } = useParams();
  const { role } = usePermissions();

  const fetchReaderInfo = async () => {
    
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/readers/${readerId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = response.data.data;
      if (!data) {
  toast.error("Reader not found");
  router.push("/dashboard/usersManagement/readers"); 
  return;
}
      setReader({
        name: data.name,
        nickname: data.nickname,
        avatarUrl: data.picture || "https://via.placeholder.com/150",
        quote: data.quote,
        bio: data.bio,
        points: data.total_points,
        booksRead: data.number_of_books,
        challengesCompleted: data.number_of_challenges,
        countriesVisited: data.number_of_countries,
        badgesEarned: data.number_of_badges,
      });
    } catch (error) {

        toast.error(error.response?.data?.message || "Something went wrong");
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!readerId) return;
    fetchReaderInfo();
  }, [readerId]);

  if (loading) {
    return <FullPageLoader />;
  }

if (!reader) {
  if (role === "admin") {
    redirect("/dashboard");
  }

  if (role === "super_admin") {
    return (
      <div className="text-center mt-10">
          <div className={styles.centeredMessage}>
            <h2>Reader Not Found</h2>
          </div>
      </div>
    );
  }
 return null;
}

  const {
    name,
    nickname,
    avatarUrl,
    quote,
    bio,
    points,
    booksRead,
    challengesCompleted,
    countriesVisited,
    badgesEarned,
  } = reader;

  const safeAvatar =
    avatarUrl && avatarUrl.trim() !== ""
      ? avatarUrl
      : "https://via.placeholder.com/150";
  const safeName = name || "Reader";

  return (
    <PermissionGuard allowedRoles={["super_admin"]}>
      <div className={styles.container}>
        <div className={styles.headerCard}>
          <div className={styles.headerLeft}>
            <img
              src={safeAvatar}
              alt={safeName}
              className={styles.pic}
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/150";
              }}
            />
          </div>

          <div className={styles.headerRight}>
            <div className={styles.nameContainer}>
              <h1 className={styles.name}>{name}</h1>
              {nickname && <span className={styles.nickname}>@{nickname}</span>}
            </div>

            {quote && (
              <blockquote className={styles.quote}>
                <span className={styles.quoteMark}>“</span>
                <span>{quote}</span>
              </blockquote>
            )}
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Bio</h2>
          <p className={styles.bioText}>{bio || "No bio available."}</p>
        </div>

        <div className={styles.readStats}>
          <div className={`${styles.statCard} ${styles.leftBorder}`}>
            <div className={styles.statTop}>
              <Icon
                icon="mdi:book-open-page-variant"
                className={styles.statIcon}
              />
              <span className={styles.statHeading}>Books Read</span>
            </div>
            <div className={styles.statValue}>{booksRead}</div>
          </div>

          <div className={`${styles.statCard} ${styles.leftBorder}`}>
            <div className={styles.statTop}>
              <Icon icon="mdi:star-circle" className={styles.statIcon} />
              <span className={styles.statHeading}>Total Points</span>
            </div>
            <div className={styles.statValue}>{points}</div>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Achievements</h2>
          <div className={styles.achievements}>
            <div className={styles.achItem}>
              <div className={styles.achIconContainer}>
                <Icon icon="mdi:trophy-outline" className={styles.achIcon} />
              </div>
              <div className={styles.achText}>
                <div className={styles.achNum}>{challengesCompleted}</div>
                <div className={styles.achDetail}>Challenges Completed</div>
              </div>
            </div>

            <div className={styles.achItem}>
              <div className={styles.achIconContainer}>
                <Icon icon="mdi:earth" className={styles.achIcon} />
              </div>
              <div className={styles.achText}>
                <div className={styles.achNum}>{countriesVisited}</div>
                <div className={styles.achDetail}>Countries Visited</div>
              </div>
            </div>

            <div className={styles.achItem}>
              <div className={styles.achIconContainer}>
                <Icon icon="mdi:medal-outline" className={styles.achIcon} />
              </div>
              <div className={styles.achText}>
                <div className={styles.achNum}>{badgesEarned}</div>
                <div className={styles.achDetail}>Badges Earned</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
}
