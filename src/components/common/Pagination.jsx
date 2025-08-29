import styles from '@/styles/pagination.module.css';

export default function Pagination({ currentPage, links = [], onPageChange }) {
  const handleClick = (link) => {
    if (link.url && !link.active) {
      const url = new URL(link.url);
      const page = url.searchParams.get("page");
      onPageChange(Number(page));
    }
  };

return (
  <div className={styles.paginationContainer}>
    <button
      className={styles.pageButton}
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
    >
      {"<< "}Previous
    </button>

    <span className={`${styles.pageButton} ${styles.active}`}>
      {currentPage}
    </span>

    <button
      className={styles.pageButton}
      onClick={() => onPageChange(currentPage + 1)}
      disabled={!links.find((l) => l.label == currentPage + 1)?.url}
    >
      Next{" >>"}
    </button>
  </div>
);

}
