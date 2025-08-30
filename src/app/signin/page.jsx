"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./signin.module.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@/styles/globals.css";
import "@/lib/fontawesome";
import RequiredStar from "@/components/common/RequiredStar";
import { usePermissions } from "@/context/PermissionsContext";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setPermissions, setRole } = usePermissions();

  // form validation
  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Please enter your email address";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email format";

    if (!password.trim()) newErrors.password = "Please enter your password";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // clear the form errors
  const clearError = (fieldName) => {
    setErrors((e) => {
      if (!e[fieldName]) return e;
      const newErrors = { ...e };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/dashboard/login",
        { email, password }
      );

      const data = response.data;

      localStorage.setItem("token", data.token);
      setPermissions(data.permissions);
      setRole(data.role);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.message;

        console.error("Server Response Error:", status, message);
        if (status === 401) {
          setErrors({ form: "Invalid email or password." });
        } else {
          router.push(`/error?code=${status}`);
        }
      } else {
        setErrors({ form: "Network error. Please check your connection." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // set the new email value, clear error messages
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    clearError("email");
    clearError("form");
  };

  // set the new password value, clear error messages
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    clearError("password");
    clearError("form");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div className={styles.imageContainer}>
        <img
          src="/images/Dashboard-amico.svg"
          alt="Dashboard"
          className={styles.floating}
          style={{ maxWidth: "90%", maxHeight: "90%" }}
        />
      </div>

      <div className={styles.form}>
        <form className={styles.textForm} onSubmit={handleSubmit}>
          <h2 className={styles.heading}>Sign in to continue</h2>

          <div className={styles.inputs}>
            <RequiredStar />
            <FontAwesomeIcon icon={["fas", "user"]} className={styles.icon} />
            <input
              type="email"
              placeholder="Your email address"
              className={styles.inputText}
              value={email}
              onChange={handleEmailChange}
            />
            <div className={styles.line}></div>
          </div>
          {errors.email && <p className={styles.error}>{errors.email}</p>}

          <div className={styles.inputs}>
            <RequiredStar />
            <FontAwesomeIcon icon={["fas", "lock"]} className={styles.icon} />
            {password.length > 0 && (
              <FontAwesomeIcon
                icon={showPassword ? ["fas", "eye-slash"] : ["fas", "eye"]}
                className={styles.passwordIcon}
                onClick={() => setShowPassword(!showPassword)}
              />
            )}
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Your password"
              className={styles.inputText}
              value={password}
              onChange={handlePasswordChange}
            />
            <div className={styles.line}></div>
          </div>
          {errors.password && <p className={styles.error}>{errors.password}</p>}

          {errors.form && <p className={styles.error}>{errors.form}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className={styles.signInButton}
          >
            {isLoading ? (
              <>
                <FontAwesomeIcon icon={["fas", "spinner"]} spin /> Loading
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
