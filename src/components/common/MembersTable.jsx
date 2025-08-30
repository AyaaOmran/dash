import { Icon } from "@iconify/react";
import FullPageLoader from "@/components/common/FullPageLoader";
import styles from "@/styles/membersTable.module.css";
import PermissionGuard from "../features/guard/PermissionGuard";

export default function MembersTable({
  members = [],
  actions = null,
  columns = [],
  loading = false,
}) {
  const hasActions = typeof actions === "function";
  return (
    <div className={styles.tableContainer}>
      <table className={styles.membersTable}>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i}>{col.label}</th>
            ))}
            {hasActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr className={styles.loadingRow}>
              <td
                colSpan={columns.length + (hasActions ? 1 : 0)}
                style={{ textAlign: "center", padding: "2rem" }}
              >
                <FullPageLoader />
              </td>
            </tr>
          ) : (
            members.map((member) => (
              <tr key={member.id}>
                {columns.map((col, i) => (
                  <td key={i}>
                    {typeof col.render === "function"
                      ? col.render(member)
                      : member[col.key]}
                  </td>
                ))}
                {hasActions && (
                  <td className={styles.actions}>{actions(member)}</td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
