"use client";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import styles from "./book.module.css";
import SearchBar from "@/components/common/SearchBar";
import FilterMenu from "@/components/common/FilterMenu";
import MembersTable from "@/components/common/MembersTable";
import FullPageLoader from "@/components/common/FullPageLoader";
import Pagination from "@/components/common/Pagination";
import AddNewBtn from "@/components/common/AddNewBtn";
import axios from "axios";
import { usePermissions } from "@/context/PermissionsContext";
import Link from "next/link";
import { toast } from "react-toastify";
import DeleteConfirmation from "@/components/common/DeleteConfirmation";
import PermissionGuard from "@/components/features/guard/PermissionGuard";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchSection, setSearchSection] = useState("");
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingBook, setDeletingBook] = useState(null);
  const [loading, setLoading] = useState(false);
    const { permissions} = usePermissions();

  const fetchBooks = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/books?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = response.data;

      setBooks(data.data);
      setPaginationLinks(data.links);
      setCurrentPage(data.current_page);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleRowCheck = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const filteredMembers = books.filter((book) =>
    book.title.toLowerCase().includes(searchSection.toLowerCase())
  );

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      const allIds = filteredMembers.map((book) => book.id);
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };

  return (
    <PermissionGuard allowedRoles={["super_admin","admin"]}  requiredPermissions={["read book"]}>
    <div className={styles.membersTableWrapper}>
      <div className={styles.tableControls}>
        <SearchBar value={searchSection} onChange={setSearchSection} />
        <div className={styles.buttonsGroup}>
          <FilterMenu
            options={["Name", "Newest", "Oldest"]}
            onSelect={(selected) => {}}
          />
          {permissions["create book"] &&(
          <AddNewBtn
            value="Book"
            to="/dashboard/booksManagement/books/add-book"
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
    permissions["update book"] || permissions["delete book"] || permissions["read book"]
      ?(book) => (
          <>
          {permissions["read book"] && (
            <Link
              href={`/dashboard/booksManagement/books/${book.id}/book-details`}
              title="View"
              className={styles.iconButton}
            >
              <Icon icon="tabler:eye" className={styles.actionsIcon} />
            </Link>            
          )}
            {permissions["update book"] && (
            <Link
              href={`/dashboard/booksManagement/books/${book.id}/edit-book`}
              title="Edit"
              className={styles.iconButton}
            >
              <Icon icon="tabler:edit" className={styles.actionsIcon} />
            </Link>
            )}
            {permissions["delete book"] && (
            <button title="Delete" onClick={() => setDeletingBook(book)}>
              <Icon icon="tabler:trash" className={styles.actionsIcon} />
            </button>
            )}

          </>
        ): null
        }
        columns={[
          { label: "Id", key: "id" },
          { label: "Title", key: "title" },
          { label: "Author", key: "author_name" },
          { label: "Category", key: "category" },
          { label: "P.Date", key: "publish_date" },
          { label: "Rate", key: "star_rate" },
          { label: "N.Readers", key: "number_of_readers" },
        ]}
      />
      <Pagination
        currentPage={currentPage}
        links={paginationLinks}
        onPageChange={(page) => fetchBooks(page)}
      />
      {deletingBook && (
        <DeleteConfirmation
          itemId={deletingBook.id}
          itemName={deletingBook.title}
          itemType="book"
          apiUrl={"http://127.0.0.1:8000/api/books"}
          icon="tabler:book-off"
          onClose={() => setDeletingBook(null)}
          onSuccess={() => {
            setDeletingBook(null);
            fetchBooks();
          }}
        />
      )}
    </div>      
    </PermissionGuard>

  );
}
