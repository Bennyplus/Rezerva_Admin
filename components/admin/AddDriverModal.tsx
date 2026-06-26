"use client";

import { useState, useRef } from "react";
import styles from "./AddDriverModal.module.css";

interface UploadedFile {
  file: File;
  name: string;
  size: string;
}

interface AddDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    email: string;
    phone: string;
    licenseNumber: string;
    passportPhoto: File | null;
    proofOfAddress: File | null;
    driversLicense: File | null;
    nin: File | null;
  }) => Promise<void>;
}

const COUNTRY_CODES = [
  { code: "+1", flag: "🇺🇸", label: "US" },
  { code: "+44", flag: "🇬🇧", label: "UK" },
  { code: "+234", flag: "🇳🇬", label: "NG" },
  { code: "+254", flag: "🇰🇪", label: "KE" },
  { code: "+233", flag: "🇬🇭", label: "GH" },
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface UploadZoneProps {
  label: string;
  id: string;
  file: UploadedFile | null;
  onFile: (f: UploadedFile | null) => void;
  accept?: string;
}

function UploadZone({ label, id, file, onFile, accept = ".pdf,.jpg,.jpeg,.png,.webp" }: UploadZoneProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFile({ file: f, name: f.name, size: formatFileSize(f.size) });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onFile({ file: f, name: f.name, size: formatFileSize(f.size) });
  };

  return (
    <div className={styles.uploadField}>
      <label className={styles.label}>{label}</label>
      <div
        className={`${styles.dropZone} ${dragging ? styles.dragging : ""} ${file ? styles.hasFile : ""}`}
        onClick={() => ref.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        id={id}
      >
        {file ? (
          <div className={styles.filePreview}>
            <PdfIcon />
            <div className={styles.fileInfo}>
              <span className={styles.fileName}>{file.name}</span>
              <span className={styles.fileSize}>{file.size}</span>
            </div>
            <button
              className={styles.removeFile}
              onClick={(e) => { e.stopPropagation(); onFile(null); }}
              type="button"
              aria-label="Remove file"
            >
              <XSmall />
            </button>
          </div>
        ) : (
          <div className={styles.dropContent}>
            <p className={styles.dropText}>
              <strong>Choose a file or drag &amp; drop it here.</strong>
            </p>
            <p className={styles.dropHint}>JPEG, PNG and WebP formats, up to 50 MB.</p>
            <button
              className={styles.browseBtn}
              type="button"
              onClick={(e) => { e.stopPropagation(); ref.current?.click(); }}
            >
              Browse File
            </button>
          </div>
        )}
        <input
          type="file"
          accept={accept}
          className={styles.hiddenInput}
          ref={ref}
          onChange={handleChange}
          required
        />
      </div>
    </div>
  );
}

export default function AddDriverModal({ isOpen, onClose, onSubmit }: AddDriverModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [phone, setPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [passportPhoto, setPassportPhoto] = useState<UploadedFile | null>(null);
  const [proofOfAddress, setProofOfAddress] = useState<UploadedFile | null>(null);
  const [driversLicense, setDriversLicense] = useState<UploadedFile | null>(null);
  const [nin, setNin] = useState<UploadedFile | null>(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const isValid =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    phone.trim().length > 0 &&
    licenseNumber.trim().length > 0 &&
    passportPhoto !== null &&
    proofOfAddress !== null &&
    driversLicense !== null &&
    nin !== null;

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        name,
        email,
        phone: `${countryCode} ${phone}`,
        licenseNumber,
        passportPhoto: passportPhoto?.file ?? null,
        proofOfAddress: proofOfAddress?.file ?? null,
        driversLicense: driversLicense?.file ?? null,
        nin: nin?.file ?? null,
      });
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName("");
    setEmail("");
    setPhone("");
    setLicenseNumber("");
    setPassportPhoto(null);
    setProofOfAddress(null);
    setDriversLicense(null);
    setNin(null);
    onClose();
  };

  const selectedCountry = COUNTRY_CODES.find((c) => c.code === countryCode) ?? COUNTRY_CODES[0];

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Add New Driver</h2>
          <button className={styles.closeBtn} onClick={handleClose} aria-label="Close modal">
            <CloseIcon />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className={styles.body}>
          {/* Row 1: Name & Email */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Name</label>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g Prosper Edward"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                id="driver-name-input"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                className={styles.input}
                placeholder="e.g Prosper@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="driver-email-input"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className={styles.field}>
            <label className={styles.label}>Phone Number</label>
            <div className={styles.phoneRow}>
              {/* Country code picker */}
              <div className={styles.countryPickerWrap}>
                <button
                  type="button"
                  className={styles.countryPickerBtn}
                  onClick={() => setShowCountryDropdown((v) => !v)}
                  id="driver-country-code-btn"
                >
                  <span>{selectedCountry.flag}</span>
                  <span className={styles.countryCode}>{selectedCountry.code}</span>
                  <ChevronDown />
                </button>
                {showCountryDropdown && (
                  <div className={styles.countryDropdown}>
                    {COUNTRY_CODES.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        className={`${styles.countryOption} ${c.code === countryCode ? styles.countryOptionActive : ""}`}
                        onClick={() => { setCountryCode(c.code); setShowCountryDropdown(false); }}
                      >
                        <span>{c.flag}</span>
                        <span>{c.label}</span>
                        <span className={styles.countryOptionCode}>{c.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="tel"
                className={`${styles.input} ${styles.phoneInput}`}
                placeholder="(555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                id="driver-phone-input"
                required
              />
            </div>
          </div>

          {/* License Number */}
          <div className={styles.field}>
            <label className={styles.label}>License Number</label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g LGST1234-WRE-ERTYUI-2345678"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              id="driver-license-input"
              required
            />
          </div>

          {/* Upload Zones — 2 × 2 grid */}
          <div className={styles.uploadGrid}>
            <UploadZone
              label="Upload Passport Photo"
              id="upload-passport"
              file={passportPhoto}
              onFile={setPassportPhoto}
              accept="image/*"
            />
            <UploadZone
              label="Upload Proof Of Address"
              id="upload-proof-address"
              file={proofOfAddress}
              onFile={setProofOfAddress}
              accept="image/*"
            />
            <UploadZone
              label="Upload Drivers License"
              id="upload-drivers-license"
              file={driversLicense}
              onFile={setDriversLicense}
              accept="image/*"
            />
            <UploadZone
              label="Upload NIN"
              id="upload-nin"
              file={nin}
              onFile={setNin}
              accept="image/*"
            />
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={handleClose} id="add-driver-cancel">
            Cancel
          </button>
          <button
            className={styles.submitBtn}
            disabled={!isValid || isSubmitting}
            onClick={handleSubmit}
            id="add-driver-submit"
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <ButtonSpinner />
                Adding...
              </>
            ) : (
              "Add Driver"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Icons ─── */
function CloseIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function XSmall() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ButtonSpinner() {
  return (
    <svg
      width={15}
      height={15}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      style={{ animation: "spin 0.7s linear infinite", display: "inline-block", verticalAlign: "middle", marginRight: 6 }}
    >
      <style>{"@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }"}</style>
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}
