"use client";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import styles from "./complaints.module.css";
import SearchBar from "@/components/common/SearchBar";
import FilterMenu from "@/components/common/FilterMenu";
import MembersTable from "@/components/common/MembersTable";
import FullPageLoader from "@/components/common/FullPageLoader";
import Pagination from "@/components/common/Pagination";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Suggestions() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
    const [searchSection, setSearchSection] = useState("");

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/complaint/getComplaints`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = response.data;
      setComplaints(data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter((s) =>
    s.complaint.toLowerCase().includes(searchSection.toLowerCase())
  );  

  return (
    <div className={styles.membersTableWrapper}>

      <div className={styles.tabs}>
        <Link
          href="/dashboard/feedbackManagement/suggestions"
          className={`${styles.tabButton} ${pathname.includes("suggestions") ? styles.active : ""}`}
        >
          Suggestions
        </Link>
        <Link
          href="/dashboard/feedbackManagement/complaints"
          className={`${styles.tabButton} ${pathname.includes("complaints") ? styles.active : ""}`}
        >
          Complaints
        </Link>
      </div>

      <MembersTable
        members={filteredComplaints}
        loading={loading}
        columns={[
          { label: "Reader ID", key: "reader_id" },
          { label: "Reader Name", key: "reader_name" },
          { label: "Complaint", key: "complaint" },
          { label: "Complaint Date", key: "date" },
        ]}
      />
    </div>
  );
}
