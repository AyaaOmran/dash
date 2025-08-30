"use client";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import styles from "./admin.module.css";
import SearchBar from "@/components/common/SearchBar";
import FilterMenu from "@/components/common/FilterMenu";
import AddNewBtn from "@/components/common/AddNewBtn";
import MembersTable from "@/components/common/MembersTable";
import Pagination from "@/components/common/Pagination";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";
import AddNewAdmin from "@/components/features/admins/AddNewAdmin";
import DeleteConfirmation from "@/components/common/DeleteConfirmation";
import PermissionGuard from "@/components/features/guard/PermissionGuard";
import FullPageLoader from "@/components/common/FullPageLoader";

export default function Admins() {
  const [admins, setAdmins] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchSection, setSearchSection] = useState("");
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [newAdminPopup, setNewAdminPopup] = useState(false);
  const [deletingAdmin, setDeletingAdmin] = useState(null);

  const fetchAdmins = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/admins?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { data } = response.data;

      setAdmins(data.data);
      setPaginationLinks(data.links);
      setCurrentPage(data.current_page);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleRowCheck = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const filteredMembers = admins.filter((admin) =>
    admin.name.toLowerCase().includes(searchSection.toLowerCase())
  );

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      const allIds = filteredMembers.map((admin) => admin.id);
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };

  return (
    <PermissionGuard allowedRoles={["super_admin"]}>
    <div className={styles.membersTableWrapper}>
      <div className={styles.tableControls}>
        <SearchBar value={searchSection} onChange={setSearchSection} />
        <div className={styles.buttonsGroup}>
          <AddNewBtn value="Admin" onClick={() => setNewAdminPopup(true)} />
          {newAdminPopup && (
            <AddNewAdmin
              onClose={() => setNewAdminPopup(false)}
              onSuccess={() => {
                setNewAdminPopup(false);
                refetchAdmins();
              }}
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
        actions={(admin) => (
          <>
            <Link
              href={`/dashboard/usersManagement/admins/${admin.id}/edit-administrator`}
              title="Edit"
              aria-label={`Edit ${admin.name}`}
              className={styles.iconButton}
            >
              <Icon icon="tabler:edit" className={styles.actionsIcon} />
            </Link>
            <button title="Delete" onClick={() => setDeletingAdmin(admin)}>
              <Icon icon="tabler:trash" className={styles.actionsIcon} />
            </button>
          </>
        )}
        columns={[
          { label: "ID", key: "id" },
          { label: "Name", key: "name" },
          { label: "Email", key: "email" },
        ]}
      />

      <Pagination
        currentPage={currentPage}
        links={paginationLinks}
        onPageChange={(page) => fetchAdmins(page)}
      />

      {newAdminPopup && (
        <AddNewAdmin
          onClose={() => setNewAdminPopup(false)}
          onSuccess={() => fetchAdmins()}
        />
      )}

      {deletingAdmin && (
        <DeleteConfirmation
          itemId={deletingAdmin.id}
          itemName={deletingAdmin.name}
          itemType="admin"
          apiUrl={"http://127.0.0.1:8000/api/admins"}
          onClose={() => setDeletingAdmin(null)}
          onSuccess={() => {
            setDeletingAdmin(null);
            fetchAdmins();
          }}
        />
      )}
    </div>
    </PermissionGuard>
  );
}
