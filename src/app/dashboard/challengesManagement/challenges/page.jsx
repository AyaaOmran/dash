"use client";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import styles from "./challenge.module.css";
import SearchBar from "@/components/common/SearchBar";
import FilterMenu from "@/components/common/FilterMenu";
import MembersTable from "@/components/common/MembersTable";
import FullPageLoader from "@/components/common/FullPageLoader";
import DeleteConfirmation from "@/components/common/DeleteConfirmation";
import Pagination from "@/components/common/Pagination";
import AddNewBtn from "@/components/common/AddNewBtn";
import axios from "axios";
import Link from "next/link";
import PermissionGuard from "@/components/features/guard/PermissionGuard";
import { toast } from "react-toastify";
import { usePermissions } from "@/context/PermissionsContext";

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchSection, setSearchSection] = useState("");
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingChallenge, setDeletingChallenge] = useState(null);
  const [loading, setLoading] = useState(false);
  const { permissions } = usePermissions();

  const fetchChallenges = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/challenges?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = response.data;

      setChallenges(data.data);
      setPaginationLinks(data.links);
      setCurrentPage(data.current_page);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleRowCheck = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const filteredMembers = challenges.filter((challenge) =>
    challenge.title.toLowerCase().includes(searchSection.toLowerCase())
  );

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      const allIds = filteredMembers.map((challenge) => challenge.id);
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };

  return (
    <PermissionGuard
      allowedRoles={["super_admin", "admin"]}
      requiredPermissions={["read challenge"]}
    >
      <div className={styles.membersTableWrapper}>
        <div className={styles.tableControls}>
          <SearchBar value={searchSection} onChange={setSearchSection} />
          <div className={styles.buttonsGroup}>
            {permissions["create challenge"] && (
              <AddNewBtn
                value="Challenge"
                to="/dashboard/challengesManagement/challenges/add-challenge"
              />
            )}
          </div>
        </div>

        <MembersTable
          members={filteredMembers}
          selectedRows={selectedRows}
          onRowCheck={handleRowCheck}
          onSelectAll={handleSelectAll}
          loading={loading}
          actions={
            permissions["update challenge"] ||
            permissions["delete challenge"] ||
            permissions["read challenge"]
              ? (challenge) => (
                  <>
                  {permissions["read challenge"] && (
                    <Link
                      href={`/dashboard/challengesManagement/challenges/${challenge.id}/challenge-details`}
                      title="View"
                      className={styles.iconButton}
                    >
                      <Icon icon="tabler:eye" className={styles.actionsIcon} />
                    </Link>
                  )}
                  {permissions["update challenge"] && (
                    <Link
                      href={`/dashboard/challengesManagement/challenges/${challenge.id}/edit-challenge`}
                      title="Edit"
                      className={styles.iconButton}
                    >
                      <Icon icon="tabler:edit" className={styles.actionsIcon} />
                    </Link>
                  )}
                  {permissions["delete challenge"] && (
                    <button
                      title="Delete"
                      onClick={() => setDeletingChallenge(challenge)}
                    >
                      <Icon
                        icon="tabler:trash"
                        className={styles.actionsIcon}
                      />
                    </button>
                  )}
                  </>
                )
              : null
          }
          columns={[
            { label: "ID", key: "id" },
            { label: "Tilte", key: "title" },
            { label: "Points", key: "points" },
            { label: "Category", key: "category" },
            { label: "Size Category", key: "size_category" },
            { label: "Duration", key: "duration" },
            { label: "N.Participants", key: "number_of_participants" },
          ]}
        />
        <Pagination
          currentPage={currentPage}
          links={paginationLinks}
          onPageChange={(page) => fetchChallenges(page)}
        />

        {deletingChallenge && (
          <DeleteConfirmation
            itemId={deletingChallenge.id}
            itemName={deletingChallenge.title}
            itemType="challenge"
            apiUrl={"http://127.0.0.1:8000/api/challenges"}
            onClose={() => setDeletingChallenge(null)}
            onSuccess={() => {
              setDeletingChallenge(null);
              fetchChallenges();
            }}
          />
        )}
      </div>
    </PermissionGuard>
  );
}
