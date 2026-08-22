"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { accountsService } from "@/services/accounts-service";
import styles from "./login.module.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isFormFilled = email.trim().length > 0 && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await accountsService.login({ email, password });

      // Store auth metadata
      localStorage.setItem("drifully_admin_role", response.user?.user_type || "Super Admin");
      localStorage.setItem("drifully_admin_user", JSON.stringify(response.user));

      setSuccess("Logged in successfully! Redirecting...");
      setTimeout(() => {
        window.location.href = "/admin";
      }, 1500);
    } catch (err: any) {
      const serverMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      setError(typeof serverMessage === "string" ? serverMessage : "Invalid credentials. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* ─── Main Form Section ─── */}
      <main className={styles.mainContent}>
        <div className={styles.card}>
          {/* Logo */}
          <div className={styles.logoArea}>
            <Link href="/admin" className={styles.logoLink}>
              <Image
                src="/REZARVA.svg"
                alt="REZARVA Logo"
                width={220}
                height={36}
                priority
                style={{ width: "auto", height: "36px" }}
              />
            </Link>
          </div>

          {/* Heading */}
          <div className={styles.heading}>
            <h1 className={styles.title}>Sign In  To Continue</h1>
            <p className={styles.subtitle}>Access all your tools in one place</p>
          </div>

          {/* Success message */}
          {success && (
            <div className={styles.success} role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              {success}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className={styles.error} role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Email Address */}
            <div className={styles.field}>
              <label htmlFor="admin-email" className={styles.label}>
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g john@gmail.com"
                className={styles.input}
                autoComplete="email"
                required
              />
            </div>

            {/* Password */}
            <div className={styles.field}>
              <label htmlFor="admin-password" className={styles.label}>
                Password
              </label>
              <div className={styles.passwordWrap}>
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className={styles.passwordInput}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon />
                </button>
              </div>
              <div className={styles.forgotRow}>
                <Link href="/admin/create-password" className={styles.forgotLink}>
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`${styles.submitBtn} ${isFormFilled ? styles.submitBtnActive : ""}`}
              disabled={loading}
              id="admin-login-btn"
            >
              {loading ? <span className={styles.spinner} /> : "Sign In"}
            </button>
          </form>
        </div>
      </main>

      {/* ─── Bottom Footer Bar ─── */}
      <footer className={styles.footerBar}>
        <p className={styles.copyright}>© 2026 Rezarva. All rights reserved.</p>
        <div className={styles.socials}>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="X (Twitter)">
            <XIcon />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
            <FacebookIcon />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
            <InstagramIcon />
          </a>
        </div>
      </footer>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
