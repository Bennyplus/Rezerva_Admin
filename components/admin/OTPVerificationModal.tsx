"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./OTPVerificationModal.module.css";

interface OTPVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => Promise<void>;
}

export default function OTPVerificationModal({ isOpen, onClose, onVerify }: OTPVerificationModalProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [status, setStatus] = useState<"idle" | "verifying" | "success">("idle");
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  useEffect(() => {
    if (isOpen) {
      setOtp(Array(6).fill(""));
      setStatus("idle");
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return; // Only numeric input allowed

    const newOtp = [...otp];
    // Take the last character if multiple are pasted or typed
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move focus to next field after digit entry
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Backspace moves to previous field when empty
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").replace(/[^0-9]/g, "").slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    // Focus on the next empty field or the last field
    const nextFocusIndex = Math.min(pastedData.length, 5);
    if (inputRefs.current[nextFocusIndex]) {
      inputRefs.current[nextFocusIndex]?.focus();
    }
  };

  const isFilled = otp.every((digit) => digit !== "");

  const handleVerify = async () => {
    if (!isFilled || status === "verifying" || status === "success") return;
    
    setStatus("verifying");
    try {
      await onVerify(otp.join(""));
      setStatus("success");
    } catch (error) {
      setStatus("idle");
      // Intentionally not adding toast or visual error per strict rules,
      // but reverting state to idle allows retry.
    }
  };

  return (
    <div className={styles.backdrop} onClick={() => { /* Intentionally not closing on backdrop click to match strict modal behavior unless specified. But standard is to close */ onClose(); }}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>

        <h2 className={styles.title}>Enter Pickup OTP</h2>
        <p className={styles.description}>Ask the customer for the verification code sent to their phone.</p>

        <div className={styles.otpContainer}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={styles.otpInput}
              disabled={status === "verifying" || status === "success"}
            />
          ))}
        </div>

        <button
          className={`${styles.verifyBtn} ${isFilled ? styles.verifyBtnEnabled : styles.verifyBtnDisabled}`}
          disabled={!isFilled || status === "verifying" || status === "success"}
          onClick={handleVerify}
        >
          {status === "success" ? (
            <>
              Verified Successfully
              <div className={styles.successIcon}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
            </>
          ) : status === "verifying" ? (
            <>
              Verify OTP
              <div className={styles.spinner} />
            </>
          ) : (
            "Verify OTP"
          )}
        </button>
      </div>
    </div>
  );
}
