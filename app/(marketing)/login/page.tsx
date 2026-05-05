"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Login.module.css';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/admin');
  };

  return (
    <main className={styles.login_page}>
      <div className={styles.login_container}>
        <div className={styles.login_form_wrapper}>
          {/* Logo */}
          <div className={styles.logo_wrapper}>
            <div className={styles.logo_icon}>
              <img src="/images/admin/admin-drifully-logo.svg" alt="Drifully Logo" />
            </div>
          </div>

          {/* Heading */}
          <h1 className={styles.heading}>Sign In To Continue</h1>
          <p className={styles.subheading}>Access all your tools in one place</p>

          {/* Form */}
          <form className={styles.form} onSubmit={handleLogin}>
            <div className={styles.form_group}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <div className={styles.input_wrapper}>
                <input
                  type="email"
                  id="email"
                  placeholder="e.g john@gmail.com"
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.form_group}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <div className={styles.input_wrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="•••••••••••"
                  className={`${styles.input} ${styles.password_input}`}
                />
                <button
                  type="button"
                  className={styles.password_toggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
              <Link href="/forgot-password" className={styles.forgot_password}>
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className={styles.signin_btn}>
              Sign In
            </button>
          </form>
        </div>
      </div>

      {/* Simplified Footer */}
      <footer className={styles.footer}>
        <p className={styles.copyright}>© 2026 Drifully. All rights reserved.</p>
        <div className={styles.socials}>
          <a href="#" className={styles.social_link} aria-label="X (Twitter)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a href="#" className={styles.social_link} aria-label="Facebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
          <a href="#" className={styles.social_link} aria-label="Instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
        </div>
      </footer>
    </main>
  );
}
