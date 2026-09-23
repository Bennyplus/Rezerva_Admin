"use client";

import { useState, useRef } from "react";
import styles from "./AddDriverModal.module.css";

interface AddDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDriver: (driverData: {
    name: string;
    email: string;
    phone: string;
    licenseNumber: string;
    files: {
      passportPhoto?: File | null;
      proofOfAddress?: File | null;
      driversLicense?: File | null;
      nin?: File | null;
    };
  }) => void;
}

export default function AddDriverModal({
  isOpen,
  onClose,
  onAddDriver,
}: AddDriverModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  const [passportPhoto, setPassportPhoto] = useState<File | null>(null);
  const [proofOfAddress, setProofOfAddress] = useState<File | null>(null);
  const [driversLicense, setDriversLicense] = useState<File | null>(null);
  const [nin, setNin] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // File input refs
  const passportInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const licenseInputRef = useRef<HTMLInputElement>(null);
  const ninInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleReset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setLicenseNumber("");
    setPassportPhoto(null);
    setProofOfAddress(null);
    setDriversLicense(null);
    setNin(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !licenseNumber.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddDriver({
        name,
        email,
        phone: phone.startsWith("+") ? phone : `+1 ${phone}`,
        licenseNumber,
        files: {
          passportPhoto,
          proofOfAddress,
          driversLicense,
          nin,
        },
      });
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    phone.trim().length > 0 &&
    licenseNumber.trim().length > 0;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Add New Driver</h2>
          <button
            className={styles.closeBtn}
            onClick={handleClose}
            aria-label="Close modal"
            id="close-add-driver-modal"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className={styles.body}>
          {/* Row 1: Name & Email */}
          <div className={styles.row2}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Name</label>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g Prosper Edward"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                id="driver-name-input"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                className={styles.input}
                placeholder="e.g Prosper@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                id="driver-email-input"
              />
            </div>
          </div>

          {/* Row 2: Phone Number */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Phone Number</label>
            <div className={styles.phoneWrapper}>
              <div className={styles.countrySelect}>
                <span>🇺🇸</span>
                <span>+1</span>
                <ChevronDownIcon />
              </div>
              <input
                type="tel"
                className={styles.phoneInput}
                placeholder="(555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                id="driver-phone-input"
              />
            </div>
          </div>

          {/* Row 3: License Number */}
          <div className={styles.formGroup}>
            <label className={styles.label}>License Number</label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g LGST1234-WRE-ERTYUI-2345678"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              required
              id="driver-license-input"
            />
          </div>

          {/* Row 4: 2x2 Upload Grid */}
          <div className={styles.uploadsGrid}>
            {/* 1. Passport Photo */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Upload Passport Photo</label>
              <div
                className={`${styles.uploadCard} ${passportPhoto ? styles.uploadCardActive : ""}`}
                onClick={() => passportInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={passportInputRef}
                  style={{ display: "none" }}
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    if (e.target.files?.[0]) setPassportPhoto(e.target.files[0]);
                  }}
                />
                {passportPhoto ? (
                  <div className={styles.selectedFileInfo}>
                    <span>✓ {passportPhoto.name}</span>
                    <button
                      type="button"
                      className={styles.removeFileBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPassportPhoto(null);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <p className={styles.uploadTitle}>
                      Choose a file or drag & drop it here.
                    </p>
                    <p className={styles.uploadSub}>
                      JPEG, PNG and WebP formats, up to 50 MB.
                    </p>
                    <button type="button" className={styles.browseBtn}>
                      Browse File
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* 2. Proof of Address */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Upload Proof Of Address</label>
              <div
                className={`${styles.uploadCard} ${proofOfAddress ? styles.uploadCardActive : ""}`}
                onClick={() => addressInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={addressInputRef}
                  style={{ display: "none" }}
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={(e) => {
                    if (e.target.files?.[0]) setProofOfAddress(e.target.files[0]);
                  }}
                />
                {proofOfAddress ? (
                  <div className={styles.selectedFileInfo}>
                    <span>✓ {proofOfAddress.name}</span>
                    <button
                      type="button"
                      className={styles.removeFileBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setProofOfAddress(null);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <p className={styles.uploadTitle}>
                      Choose a file or drag & drop it here.
                    </p>
                    <p className={styles.uploadSub}>
                      JPEG, PNG and WebP formats, up to 50 MB.
                    </p>
                    <button type="button" className={styles.browseBtn}>
                      Browse File
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* 3. Drivers License */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Upload Drivers License</label>
              <div
                className={`${styles.uploadCard} ${driversLicense ? styles.uploadCardActive : ""}`}
                onClick={() => licenseInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={licenseInputRef}
                  style={{ display: "none" }}
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={(e) => {
                    if (e.target.files?.[0]) setDriversLicense(e.target.files[0]);
                  }}
                />
                {driversLicense ? (
                  <div className={styles.selectedFileInfo}>
                    <span>✓ {driversLicense.name}</span>
                    <button
                      type="button"
                      className={styles.removeFileBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDriversLicense(null);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <p className={styles.uploadTitle}>
                      Choose a file or drag & drop it here.
                    </p>
                    <p className={styles.uploadSub}>
                      JPEG, PNG and WebP formats, up to 50 MB.
                    </p>
                    <button type="button" className={styles.browseBtn}>
                      Browse File
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* 4. NIN */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Upload NIN</label>
              <div
                className={`${styles.uploadCard} ${nin ? styles.uploadCardActive : ""}`}
                onClick={() => ninInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={ninInputRef}
                  style={{ display: "none" }}
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={(e) => {
                    if (e.target.files?.[0]) setNin(e.target.files[0]);
                  }}
                />
                {nin ? (
                  <div className={styles.selectedFileInfo}>
                    <span>✓ {nin.name}</span>
                    <button
                      type="button"
                      className={styles.removeFileBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setNin(null);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <p className={styles.uploadTitle}>
                      Choose a file or drag & drop it here.
                    </p>
                    <p className={styles.uploadSub}>
                      JPEG, PNG and WebP formats, up to 50 MB.
                    </p>
                    <button type="button" className={styles.browseBtn}>
                      Browse File
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={handleClose}
            id="cancel-add-driver-btn"
          >
            Cancel
          </button>
          <button
            type="button"
            className={`${styles.submitBtn} ${isFormValid ? styles.submitBtnActive : styles.submitBtnDisabled}`}
            disabled={!isFormValid || isSubmitting}
            onClick={handleSubmit}
            id="submit-add-driver-btn"
          >
            {isSubmitting ? "Adding..." : "Add Driver"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── SVG Icons ─── */
function CloseIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
