"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import FullPageLoader from "@/components/common/FullPageLoader";
import styles from "./editAdmin.module.css";
import PerList from "@/components/features/admins/PerList";
import { toast } from "react-toastify";
import PermissionGuard from "@/components/features/guard/PermissionGuard";

export default function EditAdmin() {
  const { adminId } = useParams();

  // Basic info states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [initialName, setInitialName] = useState("");
  const [initialEmail, setInitialEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingInfo, setSavingInfo] = useState(false);
  // حالة جديدة للتحقق من نجاح تحميل البيانات
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Permissions states
  const [permissions, setPermissions] = useState({});
  const [initialPermissions, setInitialPermissions] = useState({});
  const [savingPermissions, setSavingPermissions] = useState(false);

  // Validation & flags
  const isPermissionsChanged =
    JSON.stringify(permissions) !== JSON.stringify(initialPermissions);

  const isEmailValid =
    email.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isBasicInfoChanged =
    name !== initialName ||
    email !== initialEmail ||
    (password && password.length > 0);
  
  const canSaveInfo = isEmailValid && isBasicInfoChanged && !savingInfo;

  // دمج كل عمليات التحميل في دالة واحدة لضمان التنسيق الصحيح للحالات
  // هذا هو الحل الأبسط والأكثر موثوقية لمنع الأخطاء
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. جلب معلومات المسؤول
        const adminResponse = await axios.get(
          `http://127.0.0.1:8000/api/admins/${adminId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const admin = adminResponse.data.data || {};
        setName(admin.name || "");
        setEmail(admin.email || "");
        setInitialName(admin.name || "");
        setInitialEmail(admin.email || "");
        
        // 2. جلب الصلاحيات
        const permissionsResponse = await axios.get(
          `http://127.0.0.1:8000/api/admin-permissions/${adminId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const rawPermissions = permissionsResponse.data.permissions || {};
        setPermissions(rawPermissions);
        setInitialPermissions(rawPermissions);
        
        // عند نجاح كلتا العمليتين، قم بتعيين حالة التحميل بنجاح
        setIsDataLoaded(true);
        
      } catch (error) {
        // إذا فشل أي من الطلبين، أظهر رسالة خطأ وقم بتعيين حالة الفشل
        toast.error(error.response?.data?.message || "Failed to load admin data.");
        setIsDataLoaded(false);
      } finally {
        // يتم إخفاء شاشة التحميل دائماً
        setLoading(false);
      }
    };

    fetchData();
  }, [adminId]);

  // Save basic info
  const handleSavingInfo = async (e) => {
    e.preventDefault();
    if (!canSaveInfo) return;

    setSavingInfo(true);
    try {
      const updatedAdmin = {
        name: name.trim(),
        email: email.trim(),
        ...(password ? { password } : {}),
      };

      await axios.post(
        `http://127.0.0.1:8000/api/admin/update/${adminId}`,
        updatedAdmin,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Admin information updated successfully.");
      setInitialName(name);
      setInitialEmail(email);
      setPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSavingInfo(false);
    }
  };

  // Save permissions
  const handleSavingPermissions = async () => {
    if (!isPermissionsChanged || savingPermissions) return;

    setSavingPermissions(true);
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/admin-permissions/${adminId}`,
        { permissions },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Permissions updated successfully");
      setInitialPermissions(permissions);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update permissions"
      );
    } finally {
      setSavingPermissions(false);
    }
  };

  // دالة لتغيير حالة الصلاحيات
  const handlePermissionChange = (key, value) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const permissionsByGroup = {};
  for (let key in permissions) {
    const group = key.split(" ")[1] || "Other";
    if (!permissionsByGroup[group]) permissionsByGroup[group] = {};
    permissionsByGroup[group][key] = permissions[key];
  }

  return (
        <PermissionGuard allowedRoles={["super_admin"]}>
    <div className={styles.container}>
      <div className={styles.main}>
        {loading ? (
          <FullPageLoader />
        ) : isDataLoaded ? ( // عرض النموذج فقط إذا تم التحميل بنجاح
          <>
            {/* Basic Info Card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Basic Information</h2>
                {isBasicInfoChanged && (
                  <span className={styles.unsaved}>Unsaved changes</span>
                )}
              </div>
              <form onSubmit={handleSavingInfo} className={styles.cardBody}>
                <div className={styles.fields}>
                  {/* Name */}
                  <div className={styles.field}>
                    <label htmlFor="admin-name">Name</label>
                    <input
                      id="admin-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={savingInfo}
                      placeholder="Admin Name"
                    />
                  </div>
                  {/* Email */}
                  <div className={styles.field}>
                    <label htmlFor="admin-email">Email</label>
                    <input
                      id="admin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={savingInfo}
                      placeholder="email@example.com"
                    />
                    {/* عرض رسالة الخطأ هنا فقط إذا كان هناك نص في الحقل والنص غير صالح */}
                    {!isEmailValid && email.trim() !== "" && (
                      <div className={styles.errorText}>
                        Invalid email format.
                      </div>
                    )}
                  </div>
                  {/* Password */}
                  <div className={styles.field}>
                    <label htmlFor="admin-password">
                      Password{" "}
                      <span className={styles.optional}>
                        (leave blank to keep)
                      </span>
                    </label>
                    <input
                      id="admin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={savingInfo}
                    />
                  </div>
                </div>

                <div className={styles.buttonRow}>
                  <button
                    type="submit"
                    className={styles.primaryBtn}
                    disabled={!canSaveInfo}
                  >
                    {savingInfo ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
            {/* Permissions Card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Admin Permissions</h2>
                {isPermissionsChanged && (
                  <span className={styles.unsaved}>Unsaved changes</span>
                )}
              </div>
              <div className={styles.permissionsSection}>
                {Object.entries(permissionsByGroup).map(([group, perms]) => (
                  <PerList
                    key={group}
                    title={group}
                    permissions={perms}
                    onChange={handlePermissionChange}
                  />
                ))}
              </div>
              <div className={styles.buttonRow}>
                <button
                  type="button"
                  className={styles.primaryBtn}
                  disabled={!isPermissionsChanged || savingPermissions}
                  onClick={handleSavingPermissions}
                >
                  {savingPermissions ? "Saving..." : "Save Permissions"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.centeredMessage}>
            <h2>Admin Not Found</h2>
            <p>Please check the administrator ID and try again.</p>
          </div>
        )}
      </div>
    </div>
        </PermissionGuard>

  );
}
