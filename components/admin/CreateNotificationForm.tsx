"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import CustomSelect from "./CustomSelect";
import styles from "./CreateNotificationForm.module.css";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

interface CreateNotificationFormProps {
  onCancel: () => void;
  onSave: (data: any) => void;
}

export default function CreateNotificationForm({ onCancel, onSave }: CreateNotificationFormProps) {
  const [imagePreviews, setImagePreviews] = useState<{ url: string; name: string; size: number }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    cta: "",
    recipients: "",
    channel: "",
    date: "",
    schedule: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
      }));
      setImagePreviews((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const isFormValid = formData.title && formData.message && formData.recipients && formData.channel;

  const editorConfig = useMemo(() => ({
    readonly: false,
    placeholder: "Enter message content",
    toolbarAdaptive: false,
    buttons: ['bold', 'italic', 'underline', 'strikethrough', '|', 'ul', 'ol', '|', 'outdent', 'indent', '|', 'undo', 'redo'],
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    height: 200,
  }), []);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onCancel} aria-label="Go back">
          <BackIcon />
        </button>
        <div className={styles.headerActions}>
          <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
          <button
            className={`${styles.saveBtn} ${isFormValid ? styles.saveBtnActive : ""}`}
            disabled={!isFormValid}
            onClick={() => onSave(formData)}
          >
            Create & Send Notification
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {/* Form Card */}
        <div className={styles.formCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Create New Notification</h2>
            <p className={styles.cardSubtitle}>Placeholder text</p>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g Drifully Fun Fair"
                className={styles.input}
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Message Content</label>
              <div className={styles.editorContainer}>
                <JoditEditor
                  value={formData.message}
                  config={editorConfig}
                  onChange={(newContent) => setFormData((prev) => ({ ...prev, message: newContent }))}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Call To Action <span className={styles.labelOptional}>(Optional)</span>
              </label>
              <input
                type="text"
                name="cta"
                placeholder="e.g Join Now"
                className={styles.input}
                value={formData.cta}
                onChange={handleChange}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Recipients</label>
                <CustomSelect
                  name="recipients"
                  value={formData.recipients}
                  placeholder="e.g All Users"
                  options={[
                    { value: "all", label: "All Users" },
                    { value: "active", label: "Active Users" },
                    { value: "new", label: "New Users" },
                  ]}
                  onChange={handleSelectChange}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Delivery Channel</label>
                <CustomSelect
                  name="channel"
                  value={formData.channel}
                  placeholder="e.g Email"
                  options={[
                    { value: "email", label: "Email" },
                    { value: "push", label: "Push Notification" },
                    { value: "sms", label: "SMS" },
                  ]}
                  onChange={handleSelectChange}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Media Attachment</label>
              <div className={styles.imageSection}>
                {imagePreviews.length > 0 ? (
                  <div className={styles.fileList}>
                    {imagePreviews.map((img, idx) => (
                      <div key={idx} className={styles.fileCard}>
                        <div className={styles.fileCardLeft}>
                          <FileIcon />
                          <div className={styles.fileInfo}>
                            <p className={styles.fileName}>{img.name}</p>
                            <p className={styles.fileStatus}>
                              {formatFileSize(img.size)} • <span className={styles.statusSuccess}><CheckIconSmall /> Completed</span>
                            </p>
                          </div>
                        </div>
                        <button
                          className={styles.deleteFileBtn}
                          onClick={() => removeImage(idx)}
                          type="button"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    ))}
                    <div className={styles.fileListActions}>
                      <button
                        className={styles.addMoreInlineBtn}
                        onClick={() => fileInputRef.current?.click()}
                        type="button"
                      >
                        Add More
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.uploadZone} onClick={() => fileInputRef.current?.click()}>
                    <div className={styles.uploadContent}>
                      <UploadIcon />
                      <p className={styles.uploadText}>
                        <strong>Choose a file</strong> or drag & drop it here.
                      </p>
                      <p className={styles.uploadHint}>JPEG, PNG, and WebP formats, up to 50 MB.</p>
                      <button
                        className={styles.browseBtn}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                      >
                        Browse File
                      </button>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className={styles.scheduleToggle}>
              <div
                className={`${styles.toggle} ${formData.schedule ? styles.toggleActive : ""}`}
                onClick={() => setFormData(p => ({ ...p, schedule: !p.schedule }))}
              >
                <div className={styles.toggleDot} />
              </div>
              <span className={styles.toggleLabel}>Schedule Notification</span>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Date</label>
              <div className={styles.dateInputWrapper}>
                <input
                  type="text"
                  name="date"
                  placeholder="Select Date"
                  className={styles.input}
                  value={formData.date}
                  onChange={handleChange}
                />
                <div className={styles.dateIcon}>
                  <CalendarIcon />
                </div>
              </div>
            </div>

            <div className={styles.formFooter}>
              <button className={styles.secondaryBtn} onClick={() => onSave(formData)}>
                Create Notification
              </button>
              <button
                className={`${styles.saveBtn} ${isFormValid ? styles.saveBtnActive : ""}`}
                disabled={!isFormValid}
                onClick={() => onSave(formData)}
              >
                Create & Send Notification
              </button>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className={styles.previewSection}>
          <div className={styles.previewCard}>
            <div className={styles.previewHeader}>
              <span className={styles.previewLogo}>DRIFULLY</span>
            </div>
            <div className={styles.previewImageContainer}>
              <div className={styles.previewImage}>
                {imagePreviews.length > 0 ? (
                  <Image src={imagePreviews[0].url} alt="Preview" fill style={{ objectFit: "cover" }} />
                ) : (
                  <ImagePlaceholder />
                )}
              </div>
            </div>
            <div className={styles.previewBody}>
              <h3 className={styles.previewTitle}>
                {formData.title}
              </h3>

              <div className={styles.previewTextWrapper}>
                <p className={styles.previewSubtitle}></p>
                <div
                  className={styles.previewMainText}
                  dangerouslySetInnerHTML={{
                    __html: formData.message
                  }}
                />
              </div>

              <div className={styles.previewDetails}>
                <div className={styles.detailItem}></div>
                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}></span>
                  <span className={styles.detailLabel}></span>
                  <span className={styles.detailValue}></span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}></span>
                  <span className={styles.detailLabel}></span>
                  <span className={styles.detailValue}></span>
                </div>
              </div>
              {formData.cta && (
                <button className={styles.previewCTA}>{formData.cta}</button>
              )}
            </div>
            <div className={styles.previewFooter}>
              <p className={styles.footerBrand}>DRIFULLY</p>
              <p className={styles.footerText}>
                Wherever you're going, start with Drifully. Download the app and take control of your next journey.
              </p>
              <div className={styles.appStoreButtons}>
                <button className={`${styles.appBtn} ${styles.appBtnDark}`}>
                  <PlayStoreIcon />
                  <div className={styles.appBtnText}>
                    <span className={styles.appBtnSub}>Get it on</span>
                    <span className={styles.appBtnMain}>Google Play</span>
                  </div>
                </button>
                <button className={styles.appBtn}>
                  <AppleIcon />
                  <div className={styles.appBtnText}>
                    <span className={styles.appBtnSub}>Download on the</span>
                    <span className={styles.appBtnMain}>App Store</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Icons ─── */
function BackIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <div className={styles.uploadIconWrapper}>
      <Image
        src="/images/admin/cloud-plus.svg"
        alt="Upload"
        width={32}
        height={32}
      />
    </div>
  );
}

function TrashIcon() {
  return (
    <Image
      src="/images/admin/trash.svg"
      alt="Delete"
      width={20}
      height={20}
    />
  );
}

function FileIcon() {
  return (
    <div className={styles.fileIconBox}>
      <Image
        src="/images/admin/file-format.svg"
        alt="File Format"
        width={32}
        height={32}
      />
    </div>
  );
}

function CheckIconSmall() {
  return (
    <Image
      src="/images/admin/success-checkmark.svg"
      alt="Success"
      width={14}
      height={14}
    />
  );
}

function ImagePlaceholder() {
  return (
    <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="#E2E4E9" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function PlayStoreIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L18.66,16.19C19.45,16.63 19.45,17.78 18.66,18.22L15.31,20.14L14.69,13L16.81,15.12M14.69,11L15.31,3.86L18.66,5.78C19.45,6.22 19.45,7.37 18.66,7.81L16.81,8.88L14.69,11M13.69,12L4.69,2.85L13.69,12M4.69,21.15L13.69,12L4.69,21.15Z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}