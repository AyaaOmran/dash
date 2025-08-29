"use client";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import styles from "./badge.module.css";
import SearchBar from "@/components/common/SearchBar";
import FilterMenu from "@/components/common/FilterMenu";
import MembersTable from "@/components/common/MembersTable";
import FullPageLoader from "@/components/common/FullPageLoader";
import Pagination from "@/components/common/Pagination";
import AddNewBtn from "@/components/common/AddNewBtn";
import axios from "axios";
import { toast } from "react-toastify";
import DeleteConfirmation from "@/components/common/DeleteConfirmation";
import PermissionGuard from "@/components/features/guard/PermissionGuard";

export default function Badges() {
  const [badges, setBadges] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchSection, setSearchSection] = useState("");
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingBadge, setDeletingBadge] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBadges = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/badges?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = response.data;

      setBadges(data.data);
      setPaginationLinks(data.links);
      setCurrentPage(data.current_page);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  const handleRowCheck = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const filteredMembers = badges.filter((badge) =>
    badge.title.toLowerCase().includes(searchSection.toLowerCase())
  );

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      const allIds = filteredMembers.map((badge) => badge.id);
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
          <FilterMenu
            options={["Name", "Newest", "Oldest"]}
            onSelect={(selected) => {}}
          />
          <AddNewBtn value="Badge" />
        </div>
      </div>

      <MembersTable
        members={filteredMembers}
        selectedRows={selectedRows}
        onRowCheck={handleRowCheck}
        onSelectAll={handleSelectAll}
        loading={loading}
        actions={(badge) => (
          <>
            <button title="Edit">
              <Icon icon="tabler:edit" className={styles.actionsIcon} />
            </button>
            <button title="Delete" onClick={() => setDeletingBadge(badge)}>
              <Icon icon="tabler:trash" className={styles.actionsIcon} />
            </button>
          </>
        )}
        columns={[
          { label: "ID", key: "id" },
          {
            label: "Icon",
            render: (badge) => (
              <img
                src={badge.image}
                alt={badge.name}
                style={{ width: 25, height: 25, borderRadius: "50%" }}
              />
            ),
          },
          { label: "Title", key: "title" },
          { label: "Description", key: "description" },
          { label: "N.Earners", key: "number_of_earners" },
        ]}
      />
      <Pagination
        currentPage={currentPage}
        links={paginationLinks}
        onPageChange={(page) => fetchBadges(page)}
      />

      {deletingBadge && (
        <DeleteConfirmation
          itemId={deletingBadge.id}
          itemName={deletingBadge.title}
          itemType="badge"
          apiUrl={"http://127.0.0.1:8000/api/badges"}
          onClose={() => setDeletingBadge(null)}
          onSuccess={() => {
            setDeletingBadge(null);
            fetchBadges();
          }}
        />
      )}
    </div>
        </PermissionGuard>

  );
}
