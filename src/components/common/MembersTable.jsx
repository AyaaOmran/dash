import { Icon } from "@iconify/react";
import FullPageLoader from "@/components/common/FullPageLoader";
import styles from '@/styles/membersTable.module.css';
import PermissionGuard from "../features/guard/PermissionGuard";

export default function MembersTable({
  members = [],
  selectedRows = [],
  onRowCheck = () => {},
  onSelectAll = () => {},
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
            <th>
              <input
                type="checkbox"
                onChange={(e) => onSelectAll(e.target.checked)}
                checked={
                  members.length > 0 && selectedRows.length === members.length
                }
              />
            </th>
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
                colSpan={columns.length + 2}
                style={{ textAlign: "center", padding: "2rem" }}
              >
                <FullPageLoader />
              </td>
            </tr>
          ) : (
            members.map((member) => (
              <tr
                key={member.id}
                className={
                  selectedRows.includes(member.id) ? styles.selectedRow : ""
                }
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(member.id)}
                    onChange={() => onRowCheck(member.id)}
                  />
                </td>
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
