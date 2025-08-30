"use client";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import styles from "./suggestions.module.css";
import MembersTable from "@/components/common/MembersTable";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePermissions } from "@/context/PermissionsContext";
import PermissionGuard from "@/components/features/guard/PermissionGuard";

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [searchSection, setSearchSection] = useState("");
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const { permissions } = usePermissions();

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/suggestions`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = response.data;
      setSuggestions(data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const filteredSuggestions = suggestions.filter((s) =>
    s.book_title.toLowerCase().includes(searchSection.toLowerCase())
  );

  const handleAccept = async (suggestion) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/suggestion/Update/${suggestion.id}`,
        { status: "accept" },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success(`Accepted: ${suggestion.book_title}`);
      fetchSuggestions();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to accept suggestion"
      );
    }
  };

  const handleReject = async (suggestion) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/suggestion/Update/${suggestion.id}`,
        { status: "denied" },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      await axios.delete(
        `http://127.0.0.1:8000/api/suggestion/${suggestion.id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      toast.error(`Rejected & Deleted: ${suggestion.book_title}`);
      fetchSuggestions(); // إعادة تحديث الجدول
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to reject suggestion"
      );
    }
  };

  return (
    <PermissionGuard
      allowedRoles={["super_admin", "admin"]}
      requiredPermissions={["read book_suggestion"]}
    >
      <div className={styles.membersTableWrapper}>
        <div className={styles.tabs}>
          <Link
            href="/dashboard/feedbackManagement/suggestions"
            className={`${styles.tabButton} ${
              pathname.includes("suggestions") ? styles.active : ""
            }`}
          >
            Suggestions
          </Link>
          {permissions["read complaint"] && (
            <Link
              href="/dashboard/feedbackManagement/complaints"
              className={`${styles.tabButton} ${
                pathname.includes("complaints") ? styles.active : ""
              }`}
            >
              Complaints
            </Link>
          )}
        </div>

        <MembersTable
          members={filteredSuggestions}
          loading={loading}
          actions={
            permissions["update category"] || permissions["delete category"]
              ? (s) => (
                  <>
                  {permissions["accept book_suggestion"] && (
                    <button
                      title="Accept"
                      className={styles.iconButton}
                      onClick={() => handleAccept(s)}
                    >
                      <Icon
                        icon="tabler:check"
                        className={styles.actionsIcon}
                        style={{ color: "green" }}
                      />
                    </button>
                  )}
{permissions["delete book_suggestion"] && (
                    <button
                      title="Reject"
                      className={styles.iconButton}
                      onClick={() => handleReject(s)}
                    >
                      <Icon
                        icon="tabler:x"
                        className={styles.actionsIcon}
                        style={{ color: "red" }}
                      />
                    </button>
)}                    

                  </>
                )
              : null
          }
          columns={[
            { label: "Reader ID", key: "reader_id" },
            { label: "Title", key: "book_title" },
            { label: "Author", key: "author" },
            { label: "Suggestion Date", key: "date_of_suggestion" },
            { label: "Note", key: "note" }, // 👈 عمود جديد للنوت
          ]}
        />
      </div>
    </PermissionGuard>
  );
}
