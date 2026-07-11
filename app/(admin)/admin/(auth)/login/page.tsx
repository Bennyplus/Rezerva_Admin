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

      // Allow user to assume Super Admin role for now while BE user roles are tweaked
      localStorage.setItem("drifully_admin_role", response.user?.user_type || "Super Admin");
      localStorage.setItem("drifully_admin_user", JSON.stringify(response.user));

      setSuccess("Logged in successfully! Redirecting...");
      setTimeout(() => {
        window.location.href = "/admin";
      }, 1500);
    } catch (err: any) {
      const serverMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      setError(typeof serverMessage === 'string' ? serverMessage : "Invalid credentials. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Decorative background pattern */}
      <div className={styles.bgPattern} aria-hidden="true" />

      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoArea}>
          <Link href="/" className={styles.logoLink}>
            <svg width="199" height="62" viewBox="0 0 199 62" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.94922 30.6917L20.79 3.63037H179.198L195.039 30.6917L179.198 57.7531H20.79L4.94922 30.6917Z" fill="white" stroke="#111111" stroke-width="2.64013" />
              <path d="M45.0647 40.605H38.2006L41.3715 21.5048H48.1051C50.0263 21.5048 51.6211 21.8965 52.8894 22.6799C54.164 23.4633 55.0625 24.5856 55.5847 26.0467C56.107 27.5016 56.2003 29.2394 55.8645 31.2601C55.5412 33.2124 54.8977 34.888 53.934 36.2869C52.9703 37.6796 51.7361 38.7491 50.2314 39.4952C48.7268 40.235 47.0046 40.605 45.0647 40.605ZM42.8171 37.1449H45.2979C46.4978 37.1449 47.5486 36.9211 48.4501 36.4734C49.3579 36.0258 50.1009 35.3356 50.6791 34.403C51.2636 33.4704 51.677 32.2766 51.9195 30.8217C52.1495 29.4415 52.134 28.3223 51.8729 27.4643C51.618 26.6001 51.1237 25.969 50.39 25.5711C49.6563 25.1669 48.6926 24.9648 47.4989 24.9648H44.8409L42.8171 37.1449ZM57.3077 40.605L60.4787 21.5048H68.0143C69.4567 21.5048 70.6443 21.7597 71.5769 22.2696C72.5158 22.7794 73.1748 23.5037 73.5541 24.4426C73.9396 25.3752 74.0297 26.4757 73.8245 27.7441C73.6132 29.0124 73.1562 30.1005 72.4536 31.0083C71.7572 31.916 70.8495 32.6155 69.7303 33.1067C68.6174 33.5916 67.3273 33.8341 65.8599 33.8341H60.8144L61.374 30.5886H65.7573C66.5283 30.5886 67.1874 30.4829 67.7345 30.2715C68.2816 30.0601 68.7138 29.743 69.0309 29.3202C69.3542 28.8974 69.5656 28.372 69.665 27.7441C69.7707 27.1037 69.7334 26.569 69.5531 26.14C69.3728 25.7047 69.0464 25.3752 68.5739 25.1514C68.1013 24.9213 67.4796 24.8063 66.7086 24.8063H63.9853L61.346 40.605H57.3077ZM69.0588 31.9129L72.3697 40.605H67.9117L64.7035 31.9129H69.0588ZM81.9057 21.5048L78.7348 40.605H74.6965L77.8675 21.5048H81.9057ZM82.0573 40.605L85.2282 21.5048H97.8746L97.3151 24.8343H88.7069L87.9608 29.3855H95.7296L95.17 32.715H87.4012L86.0956 40.605H82.0573ZM112.389 21.5048H116.427L114.375 33.9087C114.145 35.3014 113.613 36.5201 112.78 37.5646C111.947 38.6092 110.887 39.4237 109.6 40.0081C108.313 40.5863 106.877 40.8754 105.291 40.8754C103.706 40.8754 102.369 40.5863 101.281 40.0081C100.193 39.4237 99.4065 38.6092 98.9215 37.5646C98.4365 36.5201 98.3091 35.3014 98.5391 33.9087L100.591 21.5048H104.629L102.624 33.5637C102.512 34.2911 102.568 34.9377 102.792 35.5035C103.022 36.0693 103.401 36.5139 103.93 36.8372C104.458 37.1605 105.111 37.3221 105.888 37.3221C106.672 37.3221 107.38 37.1605 108.015 36.8372C108.655 36.5139 109.18 36.0693 109.591 35.5035C110.007 34.9377 110.272 34.2911 110.383 33.5637L112.389 21.5048ZM116.578 40.605L119.749 21.5048H123.788L121.176 37.2755H129.365L128.805 40.605H116.578ZM131.479 40.605L134.65 21.5048H138.689L136.077 37.2755H144.266L143.706 40.605H131.479ZM145.996 21.5048H150.519L153.513 29.7306H153.718L159.416 21.5048H163.939L154.93 33.8528L153.802 40.605H149.792L150.92 33.8528L145.996 21.5048Z" fill="#111111" />
            </svg>
          </Link>
        </div>

        {/* Heading */}
        <div className={styles.heading}>
          <h1 className={styles.title}>Sign In To Continue</h1>
          <p className={styles.subtitle}>Access all your tools in one place</p>
        </div>

        {/* Success */}
        {success && (
          <div className={styles.success} role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            {success}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className={styles.error} role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="admin-email" className={styles.label}>Email address</label>
            <div className={styles.inputWrap}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={styles.inputIcon}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@drifully.com"
                className={styles.input}
                autoComplete="email"
              />
            </div>
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label htmlFor="admin-password" className={styles.label}>Password</label>
            </div>
            <div className={styles.inputWrap}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={styles.inputIcon}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={styles.input}
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            <button type="button" className={styles.forgotLink}>
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
            id="admin-login-btn"
          >
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className={styles.footer}>
          <Link href="/" className={styles.backLink}>
            ← Back to Drifully.com
          </Link>
        </p>
      </div>
    </div>
  );
}
