"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { accountsService, Country } from "@/services/accounts-service";
import styles from "./register.module.css";
import CustomSelect from "@/components/admin/CustomSelect";

export default function AdminRegisterPage() {
  const router = useRouter();

  // State for form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [countryCode, setCountryCode] = useState<string | number>("");

  // UI States
  const [step, setStep] = useState<'register' | 'otp'>('register');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true);
        const data = await accountsService.getCountries();
        setCountries(data);
        console.log("COUNTRIES DATA SHAPE:", Array.isArray(data), "LENGTH:", data?.length, "DATA:", data);

        // Auto-select first country or country ID 1 if available
        if (data && data.length > 0) {
          const defaultCountry = data.find((c: any) => c.id === 1 || String(c.id) === "1") || data[0];
          setCountryCode(defaultCountry.id);
        } else {
          setCountryCode("1"); // Dynamic spec fallback
        }
      } catch (err: any) {
        console.error("Failed to load countries:", err);
        // Fallback option in case of offline/local sandbox
        setCountryCode("1");
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // 1. Basic validation
    if (!fullName || !email || !phoneNumber || !password || !confirmPassword || !countryCode) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    // 2. Submit payload
    setLoading(true);
    try {
      const response = await accountsService.register({
        full_name: fullName,
        email,
        phone_number: phoneNumber,
        password,
        confirm_password: confirmPassword,
        country_code: countryCode
      });

      setSuccess("Account created successfully! Please verify your OTP.");

      // Delay redirection so success card is read
      setTimeout(() => {
        setStep('otp');
        setSuccess("");
      }, 1500);

    } catch (err: any) {
      // Extract detailed server-side error messages
      const serverMessage = err.response?.data?.message || err.response?.data?.error || err.message;

      if (typeof serverMessage === "object") {
        // Handle field-level object errors (e.g. { email: ["Already exists"] })
        const keys = Object.keys(serverMessage);
        if (keys.length > 0) {
          setError(`${keys[0]}: ${serverMessage[keys[0]][0]}`);
        } else {
          setError("Failed to create account. Please check your credentials.");
        }
      } else {
        setError(serverMessage || "An unexpected error occurred during registration.");
      }
    } finally {
      setLoading(false);
    }
  };

  const submitOTP = async (otpCode: string) => {
    setError("");
    setSuccess("");

    if (!otpCode || otpCode.length < 6) {
      setError("Please enter a valid 6-digit OTP code");
      return;
    }

    setLoading(true);
    try {
      await accountsService.verifyOTP(otpCode);
      setSuccess("Account verified successfully! Redirecting to login...");

      setTimeout(() => {
        router.push("/admin/login");
      }, 2000);
    } catch (err: any) {
      const serverMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      setError(typeof serverMessage === 'string' ? serverMessage : "Invalid OTP code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitOTP(otp.join(''));
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
          <p className={styles.logoSub}>Admin Registration</p>
        </div>

        {/* Heading */}
        <div className={styles.heading}>
          <h1 className={styles.title}>{step === 'register' ? 'Create account' : 'Verify Account'}</h1>
          <p className={styles.subtitle}>
            {step === 'register' ? 'Get started managing your fleet with Drifully' : 'Enter the code sent to your device to continue'}
          </p>
        </div>

        {/* Success Card */}
        {success && (
          <div className={styles.success} role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            {success}
          </div>
        )}

        {/* Error Card */}
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

        {/* Dynamic Form Render */}
        {step === 'register' ? (
          <form onSubmit={handleSubmit} className={styles.form}>

            {/* Full Name */}
            <div className={styles.field}>
              <label htmlFor="reg-fullname" className={styles.label}>Full Name</label>
              <div className={styles.inputWrap}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={styles.inputIcon}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  id="reg-fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Prosperity Test"
                  className={styles.input}
                  required
                />
              </div>
            </div>

            {/* Email address */}
            <div className={styles.field}>
              <label htmlFor="reg-email" className={styles.label}>Email Address</label>
              <div className={styles.inputWrap}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={styles.inputIcon}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="edwardprosper002@gmail.com"
                  className={styles.input}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Phone Number with Country Code */}
            <div className={styles.field}>
              <label htmlFor="reg-phone" className={styles.label}>
                Phone Number<span style={{ color: '#868C98', fontWeight: 400 }}>(Optional)</span>
              </label>
              <div className={styles.phoneInputWrap}>
                <div className={styles.countrySelectWrap}>
                  <CustomSelect
                    name="countryCode"
                    value={String(countryCode)}
                    placeholder="+1"
                    options={countries.map((c) => ({
                      value: String(c.id),
                      label: `${c.iso_code ? c.iso_code.toLowerCase() : ''} ${c.dial_code}`
                    }))}
                    onChange={(_name: string, value: string) => setCountryCode(value)}
                    variant="minimal"
                  />
                </div>
                <div className={styles.phoneDivider}></div>
                <input
                  id="reg-phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="(555) 000-0000"
                  className={styles.phoneInput}
                />
              </div>
            </div>

            {/* Password */}
            <div className={styles.field}>
              <label htmlFor="reg-password" className={styles.label}>Password</label>
              <div className={styles.inputWrap}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={styles.inputIcon}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={styles.input}
                  required
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

            {/* Confirm Password */}
            <div className={styles.field}>
              <label htmlFor="reg-confirm-password" className={styles.label}>Confirm Password</label>
              <div className={styles.inputWrap}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={styles.inputIcon}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  id="reg-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={styles.input}
                  required
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
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

            {/* Submit Button */}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>OTP Code</label>
              <div className={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      if (!value && e.target.value !== '') return;

                      const newOtp = [...otp];

                      if (value.length > 1) {
                        const pasted = value.slice(0, 6).split('');
                        for (let i = 0; i < pasted.length; i++) {
                          if (index + i < 6) newOtp[index + i] = pasted[i];
                        }
                        setOtp(newOtp);

                        const nextIndex = Math.min(index + pasted.length, 5);
                        document.getElementById(`otp-${nextIndex}`)?.focus();

                        const resultingOtp = newOtp.join('');
                        if (resultingOtp.length === 6) {
                          submitOTP(resultingOtp);
                        }
                        return;
                      }

                      newOtp[index] = value;
                      setOtp(newOtp);

                      if (value) {
                        if (index < 5) {
                          document.getElementById(`otp-${index + 1}`)?.focus();
                        } else {
                          const resultingOtp = newOtp.join('');
                          if (resultingOtp.length === 6) {
                            submitOTP(resultingOtp);
                          }
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !digit && index > 0) {
                        document.getElementById(`otp-${index - 1}`)?.focus();
                      }
                    }}
                    className={styles.otpInput}
                    required
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                "Verify Account"
              )}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className={styles.footer}>
          <Link href="/admin/login" className={styles.backLink}>
            Already have an account? Sign In
          </Link>
          <Link href="/" className={styles.backLink}>
            ← Back to Drifully.com
          </Link>
        </div>
      </div>
    </div>
  );
}
