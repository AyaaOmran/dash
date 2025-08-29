"use client";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import styles from "./reader.module.css";
import SearchBar from "@/components/common/SearchBar";
import FilterMenu from "@/components/common/FilterMenu";
import MembersTable from "@/components/common/MembersTable";
import Link from "next/link";
import FullPageLoader from "@/components/common/FullPageLoader";
import Pagination from "@/components/common/Pagination";
import axios from "axios";
import { toast } from "react-toastify";
import PermissionGuard from "@/components/features/guard/PermissionGuard";

export default function Readers() {
  const [readers, setReaders] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchSection, setSearchSection] = useState("");
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchReaders = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/readers?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = response.data;
      // console.log("Fetched readers:", data);
      // console.log("Token:", localStorage.getItem("token"));

      setReaders(data.data);
      setPaginationLinks(data.links);
      setCurrentPage(data.current_page);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReaders();
  }, []);

  const handleRowCheck = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const filteredMembers = readers.filter((reader) =>
    reader.name.toLowerCase().includes(searchSection.toLowerCase())
  );

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      const allIds = filteredMembers.map((reader) => reader.id);
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
          <FilterMenu
            options={["Name", "Newest", "Oldest"]}
            onSelect={(selected) => {}}
          />
        </div>
      </div>

      <MembersTable
        members={filteredMembers}
        selectedRows={selectedRows}
        onRowCheck={handleRowCheck}
        onSelectAll={handleSelectAll}
        loading={loading}
        actions={(reader) => (
          <>
            <Link
              href={`/dashboard/usersManagement/readers/${reader.id}/reader-profile`}
              title="profile"
            >
              <Icon icon="tabler:eye" className={styles.actionsIcon} />
            </Link>
          </>
        )}
        columns={[
          { label: "ID", key: "id" },
          {
            label: "Picture",
            render: (reader) => (
              <img
                src={reader.picture}
                alt={reader.name}
                className={styles.pic}

              />
            ),
          },
          { label: "Name", key: "name" },
          { label: "Email", key: "email" },
        ]}
      />
      <Pagination
        currentPage={currentPage}
        links={paginationLinks}
        onPageChange={(page) => fetchReaders(page)}
      />
    </div>
</PermissionGuard>

  );
}
