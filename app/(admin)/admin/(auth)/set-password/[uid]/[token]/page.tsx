"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { accountsService } from "@/services/accounts-service";
import styles from "../../set-password.module.css";

export default function SetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const uid = params?.uid as string;
  const token = params?.token as string;

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const reqs = [
    { label: "8 characters", test: (p: string) => p.length >= 8 },
    { label: "Lower case", test: (p: string) => /[a-z]/.test(p) },
    { label: "Upper case", test: (p: string) => /[A-Z]/.test(p) },
    { label: "Number", test: (p: string) => /[0-9]/.test(p) },
    { label: "Special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
  ];

  const isValid = password.length > 0 && reqs.every(req => req.test(password));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !uid || !token) return;

    setSubmitting(true);
    try {
      await accountsService.setPassword(uid, token, {
        uid,
        token,
        password,
        confirm_password: password,
      });
      // Redirect after successful creation to the admin login page
      router.push("/admin/login");
    } catch (error) {
      console.error("Failed to set password:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.logo}>
            <Link href="/" className={styles.logoLink}>
              <svg width="199" height="62" viewBox="0 0 199 62" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.94922 30.6917L20.79 3.63037H179.198L195.039 30.6917L179.198 57.7531H20.79L4.94922 30.6917Z" fill="white" stroke="#111111" stroke-width="2.64013" />
                <path d="M45.0647 40.605H38.2006L41.3715 21.5048H48.1051C50.0263 21.5048 51.6211 21.8965 52.8894 22.6799C54.164 23.4633 55.0625 24.5856 55.5847 26.0467C56.107 27.5016 56.2003 29.2394 55.8645 31.2601C55.5412 33.2124 54.8977 34.888 53.934 36.2869C52.9703 37.6796 51.7361 38.7491 50.2314 39.4952C48.7268 40.235 47.0046 40.605 45.0647 40.605ZM42.8171 37.1449H45.2979C46.4978 37.1449 47.5486 36.9211 48.4501 36.4734C49.3579 36.0258 50.1009 35.3356 50.6791 34.403C51.2636 33.4704 51.677 32.2766 51.9195 30.8217C52.1495 29.4415 52.134 28.3223 51.8729 27.4643C51.618 26.6001 51.1237 25.969 50.39 25.5711C49.6563 25.1669 48.6926 24.9648 47.4989 24.9648H44.8409L42.8171 37.1449ZM57.3077 40.605L60.4787 21.5048H68.0143C69.4567 21.5048 70.6443 21.7597 71.5769 22.2696C72.5158 22.7794 73.1748 23.5037 73.5541 24.4426C73.9396 25.3752 74.0297 26.4757 73.8245 27.7441C73.6132 29.0124 73.1562 30.1005 72.4536 31.0083C71.7572 31.916 70.8495 32.6155 69.7303 33.1067C68.6174 33.5916 67.3273 33.8341 65.8599 33.8341H60.8144L61.374 30.5886H65.7573C66.5283 30.5886 67.1874 30.4829 67.7345 30.2715C68.2816 30.0601 68.7138 29.743 69.0309 29.3202C69.3542 28.8974 69.5656 28.372 69.665 27.7441C69.7707 27.1037 69.7334 26.569 69.5531 26.14C69.3728 25.7047 69.0464 25.3752 68.5739 25.1514C68.1013 24.9213 67.4796 24.8063 66.7086 24.8063H63.9853L61.346 40.605H57.3077ZM69.0588 31.9129L72.3697 40.605H67.9117L64.7035 31.9129H69.0588ZM81.9057 21.5048L78.7348 40.605H74.6965L77.8675 21.5048H81.9057ZM82.0573 40.605L85.2282 21.5048H97.8746L97.3151 24.8343H88.7069L87.9608 29.3855H95.7296L95.17 32.715H87.4012L86.0956 40.605H82.0573ZM112.389 21.5048H116.427L114.375 33.9087C114.145 35.3014 113.613 36.5201 112.78 37.5646C111.947 38.6092 110.887 39.4237 109.6 40.0081C108.313 40.5863 106.877 40.8754 105.291 40.8754C103.706 40.8754 102.369 40.5863 101.281 40.0081C100.193 39.4237 99.4065 38.6092 98.9215 37.5646C98.4365 36.5201 98.3091 35.3014 98.5391 33.9087L100.591 21.5048H104.629L102.624 33.5637C102.512 34.2911 102.568 34.9377 102.792 35.5035C103.022 36.0693 103.401 36.5139 103.93 36.8372C104.458 37.1605 105.111 37.3221 105.888 37.3221C106.672 37.3221 107.38 37.1605 108.015 36.8372C108.655 36.5139 109.18 36.0693 109.591 35.5035C110.007 34.9377 110.272 34.2911 110.383 33.5637L112.389 21.5048ZM116.578 40.605L119.749 21.5048H123.788L121.176 37.2755H129.365L128.805 40.605H116.578ZM131.479 40.605L134.65 21.5048H138.689L136.077 37.2755H144.266L143.706 40.605H131.479ZM145.996 21.5048H150.519L153.513 29.7306H153.718L159.416 21.5048H163.939L154.93 33.8528L153.802 40.605H149.792L150.92 33.8528L145.996 21.5048Z" fill="#111111" />
              </svg>
            </Link>
          </div>

          <h1 className={styles.title}>Hello</h1>
          <p className={styles.subtitle}>
            Please create a strong password to access the admin dashboard
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <div className={styles.inputWrap}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=".........."
                  className={styles.input}
                  disabled={submitting}
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
            </div>

            {password.length > 0 && (
              <div className={styles.requirements}>
                <p className={styles.requirementsTitle}>Password must contain at least:</p>
                <div className={styles.chips}>
                  {reqs.map((req) => {
                    const valid = req.test(password);
                    return (
                      <span key={req.label} className={`${styles.chip} ${valid ? styles.valid : ""}`}>
                        {req.label}
                        {valid ? (
                          <span className={styles.chipIcon}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6 11C8.75 11 11 8.75 11 6C11 3.25 8.75 1 6 1C3.25 1 1 3.25 1 6C1 8.75 3.25 11 6 11Z" stroke="#008236" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round" />
                              <path d="M3.875 5.99996L5.29 7.41496L8.125 4.58496" stroke="#008236" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </span>
                        ) : (
                          <span className={styles.chipIcon}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                            </svg>
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              type="submit"
              className={`${styles.submitBtn} ${submitting ? styles.submitting : ""}`}
              disabled={!isValid || submitting}
            >
              Create Password
              {submitting && <span className={styles.spinner}></span>}
            </button>
          </form>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.copyright}>
          © 2026 Drifully. All rights reserved.
        </div>
        <div className={styles.social}>
          <Link href="#" className={styles.socialLink} aria-label="X (Twitter)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
            </svg>
          </Link>
          <Link href="#" className={styles.socialLink} aria-label="Facebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </Link>
          <Link href="#" className={styles.socialLink} aria-label="Instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.956a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" />
            </svg>
          </Link>
        </div>
      </footer>
    </div>
  );
}
