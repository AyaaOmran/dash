"use client";

import FullPageLoader from "@/components/common/FullPageLoader";
import { usePermissions } from "@/context/PermissionsContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function PermissionGuard({
  children,
  allowedRoles = [],
  requiredPermissions = [],
  redirectTo = "/dashboard",
}) {
  const { role, permissions, loading } = usePermissions();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return; // ننتظر تحميل البيانات

    // إذا ما في دور (مثلاً المستخدم مش مسجل دخول)
    if (!role) {
      router.push("/login");
      return;
    }

    // شيك على allowedRoles
    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
     // toast.error("You are not allowed to reach this page");
      router.push(redirectTo);
      return;
    }

    // شيك على requiredPermissions
    if (requiredPermissions.length > 0) {
      const hasAll = requiredPermissions.every((perm) => permissions[perm]);
      if (!hasAll) {
        toast.error("You are not allowed to reach this page");
        router.push(redirectTo);
        return;
      }
    }

    // إذا كل الشيكات نجحت
    setAuthorized(true);
  }, [role, permissions, router, allowedRoles, requiredPermissions, redirectTo, loading]);

  // ما نعرض شي إلا لما نتأكد إنه authorized
  if (loading || !authorized) return <FullPageLoader/>;

  return <>{children}</>;
}
