"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import styles from '../../../styles/addNewAdmin.module.css';
import { Icon } from "@iconify/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@/lib/fontawesome";

export default function AddNewAdmin({
  onClose = () => {},
  onSuccess = () => {},
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email format";
    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const clearError = (fieldName) => {
    setErrors((e) => {
      if (!e[fieldName]) return e;
      const newErrors = { ...e };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;
    setIsLoading(true);
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/admins",
        { name, email, password },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Admin added successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add admin, please try again"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    clearError("name");
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    clearError("email");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    clearError("password");
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <button className={styles.closeBtn} onClick={onClose}>
          <Icon icon="tabler:x" />
        </button>
        <div className={styles.header}>
          <div className={styles.iconContainer}>
            <Icon icon="tabler:user-plus" className={styles.userIcon} />
          </div>
          <h2>Add New Administrator</h2>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputs}>
            <label htmlFor="name">
              Full Name <span className={styles.requiredStar}>*</span>
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={handleNameChange}
              className={errors.name ? styles.inputError : ""}
            />
            {errors.name && <p className={styles.error}>{errors.name}</p>}
          </div>

          <div className={styles.inputs}>
            <label htmlFor="email">
              Email <span className={styles.requiredStar}>*</span>
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              className={errors.email ? styles.inputError : ""}
            />
            {errors.email && <p className={styles.error}>{errors.email}</p>}
          </div>

          <div className={styles.inputs}>
            <label htmlFor="password">
              Password <span className={styles.requiredStar}>*</span>
            </label>

            <div className={styles.passwordWrapper}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                className={errors.password ? styles.inputError : ""}
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
              />

              {password.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className={styles.passwordIcon}
                >
                  <Icon
                    icon={
                      showPassword
                        ? "heroicons-outline:eye-off"
                        : "heroicons-outline:eye"
                    }
                    width="20"
                    height="20"
                  />
                </button>
              )}
            </div>

            {errors.password && (
              <p id="password-error" className={styles.error}>
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FontAwesomeIcon icon={["fas", "spinner"]} spin /> Loading
              </>
            ) : (
              "Add Admin"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
