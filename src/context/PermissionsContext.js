"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const PermissionsContext = createContext();

export function PermissionsProvider({ children }) {
  const [permissions, setPermissions] = useState({});
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://127.0.0.1:8000/api/admin-permissions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPermissions(res.data.permissions || {});
        setRole(res.data.role || "");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load admin permissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  return (
    <PermissionsContext.Provider
      value={{ permissions, setPermissions, role, setRole, loading }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  return useContext(PermissionsContext);
}
