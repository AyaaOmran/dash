"use client";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import styles from "./author.module.css";
import SearchBar from "@/components/common/SearchBar";
import FilterMenu from "@/components/common/FilterMenu";
import MembersTable from "@/components/common/MembersTable";
import FullPageLoader from "@/components/common/FullPageLoader";
import { usePermissions } from "@/context/PermissionsContext";
import PermissionGuard from "@/components/features/guard/PermissionGuard";
import Pagination from "@/components/common/Pagination";
import AddNewBtn from "@/components/common/AddNewBtn";
import axios from "axios";
import { toast } from "react-toastify";
import DeleteConfirmation from "@/components/common/DeleteConfirmation";
import Link from "next/link";

export default function Authors() {
  const [deletingAuthor, setDeletingAuthor] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchSection, setSearchSection] = useState("");
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { permissions} = usePermissions();

  const fetchAuthors = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/authors?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = response.data;

      setAuthors(data.data);
      setPaginationLinks(data.links);
      setCurrentPage(data.current_page);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleRowCheck = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const filteredMembers = authors.filter((author) =>
    author.name.toLowerCase().includes(searchSection.toLowerCase())
  );

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      const allIds = filteredMembers.map((author) => author.id);
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };

  return (
        <PermissionGuard allowedRoles={["super_admin","admin"]}  requiredPermissions={["read author"]}>
    <div className={styles.membersTableWrapper}>
      <div className={styles.tableControls}>
        <SearchBar value={searchSection} onChange={setSearchSection} />
        <div className={styles.buttonsGroup}>
          <FilterMenu
            options={["Name", "Newest", "Oldest"]}
            onSelect={(selected) => {}}
          />
          {permissions["create author"] &&(
            <AddNewBtn
              value="Author"
              to="/dashboard/booksManagement/authors/add-author"
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
    permissions["update author"] || permissions["delete author"]
      ? (author) => (
          <>
            {permissions["update author"] && (
              <Link
                href={`/dashboard/booksManagement/authors/${author.id}/edit-author`}
                title="Edit"
                className={styles.iconButton}
              >
                <Icon icon="tabler:edit" className={styles.actionsIcon} />
              </Link>
            )}

            {permissions["delete author"] && (
              <button title="Delete" onClick={() => setDeletingAuthor(author)}>
                <Icon icon="tabler:trash" className={styles.actionsIcon} />
              </button>
            )}
          </>
        )
      : null
  }
        columns={[
          {label:"ID",key:"id"},
          {
            label: "Picture",
            render: (author) => (
              <img
                src={author.image}
                alt={author.name}
                style={{ width: 25, height: 25, borderRadius: "50%" }}
              />
            ),
          },
          { label: "Name", key: "name" },
          { label: "Country", key: "country" },
          { label: "N.Books", key: "number_of_books" },
        ]}
      />
      <Pagination
        currentPage={currentPage}
        links={paginationLinks}
        onPageChange={(page) => fetchAuthors(page)}
      />

      {deletingAuthor && (
        <DeleteConfirmation
          itemId={deletingAuthor.id}
          itemName={deletingAuthor.name}
          itemType="author"
          apiUrl={"http://127.0.0.1:8000/api/authors"}
          icon="tabler:book-off"
          onClose={() => setDeletingAuthor(null)}
          onSuccess={() => {
            setDeletingAuthor(null);
            fetchAuthors();
          }}
        />
      )}
      
    </div>
        </PermissionGuard>

  );
}
