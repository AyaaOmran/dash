"use client";

import { useRouter, useSearchParams } from "next/navigation";
import styles from "./error.module.css";

export default function ErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const getErrorMessage = (code) => {
    switch (code) {
      case "500":
        return "Internal Server Error.";
      case "502":
        return "The server is not responding.";
      default:
        return "Something went wrong.";
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        {code ? `Error ${code}` : "Error"} | {getErrorMessage(code)}
      </h2>
      <button
        onClick={() => router.push("/signin")}
        className={styles.btn}
      >
        Retry
      </button>
    </div>
  );
}

