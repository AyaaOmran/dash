"use client";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import styles from "./category.module.css";
import SearchBar from "@/components/common/SearchBar";
import FilterMenu from "@/components/common/FilterMenu";
import MembersTable from "@/components/common/MembersTable";
import Pagination from "@/components/common/Pagination";
import AddNewBtn from "@/components/common/AddNewBtn";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import DeleteConfirmation from "@/components/common/DeleteConfirmation";
import { usePermissions } from "@/context/PermissionsContext";
import PermissionGuard from "@/components/features/guard/PermissionGuard";

export default function Categories() {
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchSection, setSearchSection] = useState("");
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { permissions } = usePermissions();

  const fetchCategories = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/categories?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = response.data;

      setCategories(data.data);
      setPaginationLinks(data.links);
      setCurrentPage(data.current_page);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleRowCheck = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const filteredMembers = categories.filter((category) =>
    category.name.toLowerCase().includes(searchSection.toLowerCase())
  );

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      const allIds = filteredMembers.map((category) => category.id);
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };

  return (
    <PermissionGuard
      allowedRoles={["super_admin", "admin"]}
      requiredPermissions={["read category"]}
    >
      <div className={styles.membersTableWrapper}>
        <div className={styles.tableControls}>
          <SearchBar value={searchSection} onChange={setSearchSection} />
          <div className={styles.buttonsGroup}>
            {permissions["create category"] && (
              <AddNewBtn
                value="Category"
                to="/dashboard/booksManagement/categories/add-category"
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
            permissions["update category"] || permissions["delete category"]
              ? (category) => (
                  <>
                    {permissions["update category"] && (
                      <Link
                        href={`/dashboard/booksManagement/categories/${category.id}/edit-category`}
                        title="Edit"
                        className={styles.iconButton}
                      >
                        <Icon
                          icon="tabler:edit"
                          className={styles.actionsIcon}
                        />
                      </Link>
                    )}
                    {permissions["delete category"] && (
                      <button
                        title="Delete"
                        onClick={() => setDeletingCategory(category)}
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
            {
              label: "Icon",
              render: (category) => (
                <img
                  src={category.icon}
                  alt={category.name}
                  style={{ width: 25, height: 25, borderRadius: "50%" }}
                />
              ),
            },
            { label: "Name", key: "name" },
            { label: "N.Books", key: "number_of_books" },
          ]}
        />
        <Pagination
          currentPage={currentPage}
          links={paginationLinks}
          onPageChange={(page) => fetchCategories(page)}
        />

        {deletingCategory && (
          <DeleteConfirmation
            itemId={deletingCategory.id}
            itemName={deletingCategory.name}
            itemType="category"
            apiUrl={"http://127.0.0.1:8000/api/categories"}
            icon="tabler:book-off"
            onClose={() => setDeletingCategory(null)}
            onSuccess={() => {
              setDeletingCategory(null);
              fetchCategories();
            }}
          />
        )}
      </div>
    </PermissionGuard>
  );
}
