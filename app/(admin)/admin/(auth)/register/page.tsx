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
            <Image
              src="/images/logo.svg"
              alt="Drifully"
              width={120}
              height={36}
              priority
            />
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
