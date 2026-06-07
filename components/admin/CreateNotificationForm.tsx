"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import CustomSelect from "./CustomSelect";
import CustomDateTimePicker from "./CustomDateTimePicker";
import styles from "./CreateNotificationForm.module.css";
import {
  useNotificationForm,
  formatFileSize,
  ACCEPTED_EXTENSIONS,
  MAX_FILE_SIZE_MB,
} from "./useNotificationForm";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const EDITOR_CONFIG = {
  readonly: false,
  placeholder: "Enter message content",
  toolbarAdaptive: false,
  buttons: ["bold", "italic", "underline", "strikethrough", "|", "ul", "ol", "|", "outdent", "indent", "|", "undo", "redo"],
  showCharsCounter: false,
  showWordsCounter: false,
  showXPathInStatusbar: false,
  height: 200,
};

const PREVIEW_PLACEHOLDER_HTML = `Something exciting is coming your way! <br /><br />
Join us at the Drifully Fun Fair for a day packed with fun, entertainment, exclusive offers, and unforgettable experiences.
Whether you're a loyal customer or discovering Drifully for the first time, this is the perfect opportunity to connect, celebrate, and enjoy everything we have in store.
Expect exciting activities, amazing giveaways, special discounts, live entertainment, and a chance to explore our premium fleet up close.<br/><br/>
📍 Venue: [Event Location]<br/>📅 Date: [Event Date]<br/>⏰ Time: [Event Time]<br/><br/>
Bring your friends and family—there's something for everyone.<br/>We can't wait to see you there!<br/>Best regards,<br/>The Drifully Team`;

interface CreateNotificationFormProps {
  onCancel: () => void;
  onSave: (data: FormData) => void;
  initialData?: any;
}

export default function CreateNotificationForm({ onCancel, onSave, initialData }: CreateNotificationFormProps) {
  const form = useNotificationForm({ onSave, initialData });

  const isEditing = !!initialData;

  return (
    <div className={styles.container}>

      {/* ─── Header ─── */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onCancel} disabled={form.isSubmitting} aria-label="Go back">
          <BackIcon />
        </button>
        <div className={styles.headerActions}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel} disabled={form.isSubmitting}>
            Cancel
          </button>
          <button
            type="button"
            className={`${styles.saveBtn} ${form.isFormValid ? styles.saveBtnActive : ""}`}
            disabled={!form.isFormValid || form.isSubmitting}
            onClick={form.handleSaveClick}
            aria-busy={form.isSubmitting}
          >
            {form.isSubmitting ? "Saving…" : isEditing ? "Update Notification" : "Create & Send Notification"}
          </button>
        </div>
      </div>

      <div className={styles.content}>

        {/* ─── Form Card ─── */}
        <div className={styles.formCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>{isEditing ? "Edit Notification" : "Create New Notification"}</h2>
            <p className={styles.cardSubtitle}>
              {isEditing ? "Update the details of your notification." : "Fill in the details to compose and send your notification."}
            </p>
          </div>

          <div className={styles.formGrid}>

            {/* Title */}
            <div className={styles.fieldGroup}>
              <label htmlFor="notif-title" className={styles.label}>Title <RequiredMark /></label>
              <input
                id="notif-title"
                type="text"
                name="title"
                placeholder="e.g Drifully Fun Fair"
                className={`${styles.input} ${form.errors.title ? styles.inputError : ""}`}
                value={form.formData.title}
                onChange={form.handleChange}
                onBlur={() => form.markTouched("title")}
                aria-invalid={!!form.errors.title}
                aria-describedby={form.errors.title ? "title-error" : undefined}
                disabled={form.isSubmitting}
              />
              {form.errors.title && <p id="title-error" className={styles.fieldError} role="alert">{form.errors.title}</p>}
            </div>

            {/* Message */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Message Content <RequiredMark /></label>
              <div className={`${styles.editorContainer} ${form.errors.message ? styles.editorError : ""}`}>
                <JoditEditor value={form.formData.message} config={EDITOR_CONFIG} onChange={form.handleMessageChange} />
              </div>
              {form.errors.message && <p className={styles.fieldError} role="alert">{form.errors.message}</p>}
            </div>

            {/* CTA */}
            <div className={styles.fieldGroup}>
              <label htmlFor="notif-cta" className={styles.label}>
                Call To Action <span className={styles.labelOptional}>(Optional)</span>
              </label>
              <input
                id="notif-cta"
                type="text"
                name="cta"
                placeholder="e.g Join Now"
                className={styles.input}
                value={form.formData.cta}
                onChange={form.handleChange}
                disabled={form.isSubmitting}
              />
            </div>

            {/* Recipients + Channel */}
            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Recipients <RequiredMark /></label>
                {form.recipientTypesError ? (
                  <FetchError onRetry={form.fetchRecipientTypes} />
                ) : (
                  <CustomSelect
                    name="recipients"
                    value={form.formData.recipients}
                    placeholder={form.recipientTypesLoading ? "Loading…" : "e.g All Users"}
                    options={form.recipientTypes}
                    onChange={form.handleSelectChange}
                  />
                )}
                {form.errors.recipients && <p className={styles.fieldError} role="alert">{form.errors.recipients}</p>}
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Delivery Channel <RequiredMark /></label>
                {form.deliveryChannelsError ? (
                  <FetchError onRetry={form.fetchDeliveryChannels} />
                ) : (
                  <CustomSelect
                    name="channel"
                    value={form.formData.channel}
                    placeholder={form.deliveryChannelsLoading ? "Loading…" : "e.g Email"}
                    options={form.deliveryChannels}
                    onChange={form.handleSelectChange}
                  />
                )}
                {form.errors.channel && <p className={styles.fieldError} role="alert">{form.errors.channel}</p>}
              </div>
            </div>

            {/* Specific Users — conditional */}
            {form.formData.recipients === "specific" && (
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Users <RequiredMark /></label>
                {form.usersError ? (
                  <FetchError message="Failed to load users." onRetry={form.fetchUsers} />
                ) : (
                  <CustomSelect
                    name="userEmails"
                    value={form.formData.userEmails}
                    placeholder={form.usersLoading ? "Loading users…" : form.availableUsers.length === 0 ? "No users found" : "Select users"}
                    options={form.availableUsers}
                    onChange={form.handleSelectChange}
                    showSearch
                    multiple
                  />
                )}
                {form.errors.userEmails && <p className={styles.fieldError} role="alert">{form.errors.userEmails}</p>}
              </div>
            )}

            {/* Media Attachment */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Media Attachment</label>
              <div className={styles.imageSection}>
                {form.imagePreviews.length > 0 ? (
                  <div className={styles.fileList}>
                    {form.imagePreviews.map((img, idx) => (
                      <div key={`${img.name}-${img.size}-${idx}`} className={styles.fileCard}>
                        <div className={styles.fileCardLeft}>
                          <FileIcon />
                          <div className={styles.fileInfo}>
                            <p className={styles.fileName}>{img.name}</p>
                            <p className={styles.fileStatus}>
                              {formatFileSize(img.size)} •{" "}
                              <span className={styles.statusSuccess}><CheckIconSmall /> Completed</span>
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          className={styles.deleteFileBtn}
                          onClick={() => form.removeImage(idx)}
                          aria-label={`Remove ${img.name}`}
                          disabled={form.isSubmitting}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    ))}
                    <div className={styles.fileListActions}>
                      <button type="button" className={styles.addMoreInlineBtn} onClick={() => form.fileInputRef.current?.click()} disabled={form.isSubmitting}>
                        Add More
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={styles.uploadZone}
                    onClick={() => !form.isSubmitting && form.fileInputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    aria-label={`Upload attachment — JPEG, PNG, WebP up to ${MAX_FILE_SIZE_MB} MB`}
                    onKeyDown={(e) => e.key === "Enter" && form.fileInputRef.current?.click()}
                  >
                    <div className={styles.uploadContent}>
                      <UploadIcon />
                      <p className={styles.uploadText}><strong>Choose a file</strong> or drag &amp; drop it here.</p>
                      <p className={styles.uploadHint}>JPEG, PNG, and WebP formats, up to {MAX_FILE_SIZE_MB} MB.</p>
                      <button type="button" className={styles.browseBtn} disabled={form.isSubmitting}
                        onClick={(e) => { e.stopPropagation(); form.fileInputRef.current?.click(); }}>
                        Browse File
                      </button>
                    </div>
                  </div>
                )}
                {form.fileError && <p className={styles.fieldError} role="alert">{form.fileError}</p>}
                <input
                  type="file" multiple accept={ACCEPTED_EXTENSIONS}
                  style={{ display: "none" }} ref={form.fileInputRef}
                  onChange={form.handleFileChange} aria-hidden="true" tabIndex={-1}
                />
              </div>
            </div>

            {/* Schedule Toggle */}
            <div className={styles.scheduleToggle}>
              <div
                role="switch" aria-checked={form.formData.schedule} aria-label="Schedule notification"
                tabIndex={0}
                className={`${styles.toggle} ${form.formData.schedule ? styles.toggleActive : ""}`}
                onClick={form.toggleSchedule}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); form.toggleSchedule(); } }}
              >
                <div className={styles.toggleDot} />
              </div>
              <span className={styles.toggleLabel}>Schedule Notification</span>
            </div>

            {/* Date — only shown when scheduling enabled */}
            {form.formData.schedule && (
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Scheduled Date &amp; Time <RequiredMark /></label>
                <CustomDateTimePicker
                  value={form.formData.date ? new Date(form.formData.date) : new Date()}
                  onChange={form.handleDateChange}
                />
                {form.errors.date && <p className={styles.fieldError} role="alert">{form.errors.date}</p>}
              </div>
            )}

            {/* Footer */}
            <div className={styles.formFooter}>
              <button type="button" className={styles.secondaryBtn} onClick={form.handleSaveClick} disabled={form.isSubmitting}>
                {form.isSubmitting ? "Saving…" : isEditing ? "Save Changes" : "Create Notification"}
              </button>
              <button
                type="button"
                className={`${styles.saveBtn} ${form.isFormValid ? styles.saveBtnActive : ""}`}
                disabled={!form.isFormValid || form.isSubmitting}
                onClick={form.handleSaveClick}
                aria-busy={form.isSubmitting}
              >
                {form.isSubmitting ? "Saving…" : isEditing ? "Update Notification" : "Create & Send Notification"}
              </button>
            </div>

          </div>
        </div>

        {/* ─── Preview ─── */}
        <div className={styles.previewSection}>
          <div className={styles.previewCard}>
            <div className={styles.previewHeader}>
              <span className={styles.previewLogo}>DRIFULLY</span>
            </div>
            <div className={styles.previewImageContainer}>
              <div className={styles.previewImage}>
                {form.imagePreviews.length > 0
                  ? <Image src={form.imagePreviews[0].url} alt="Notification preview" fill style={{ objectFit: "cover" }} />
                  : <ImagePlaceholder />}
              </div>
            </div>
            <div className={styles.previewBody}>
              <h3 className={`${styles.previewTitle} ${!form.formData.title ? styles.previewPlaceholder : ""}`}>
                {form.formData.title || "You're Invited: Drifully Fun Fair Is Here!"}
              </h3>
              <div className={styles.previewTextWrapper}>
                <p className={styles.previewSubtitle} />
                {/* Safe: admin-authored content via Jodit editor */}
                <div
                  className={`${styles.previewMainText} ${!form.formData.message ? styles.previewPlaceholder : ""}`}
                  dangerouslySetInnerHTML={{ __html: form.formData.message || PREVIEW_PLACEHOLDER_HTML }}
                />
              </div>
              {form.formData.cta && <button className={styles.previewCTA}>{form.formData.cta}</button>}
            </div>
            <div className={styles.previewFooter}>
              <p className={styles.footerBrand}>DRIFULLY</p>
              <p className={styles.footerText}>
                Wherever you're going, start with Drifully.<br />
                Download the app and take control of your next journey.
              </p>
              <div className={styles.appStoreButtons}>
                <button className={`${styles.appBtn} ${styles.appBtnDark}`}>
                  <span className={styles.appBtnText}><span className={styles.appBtnMain}>Get it on Google Play</span></span>
                  <Image src="/icons/google-play.svg" alt="" width={18} height={18} />
                </button>
                <button className={styles.appBtn}>
                  <span className={styles.appBtnText}><span className={styles.appBtnMain}>Download on the App Store</span></span>
                  <Image src="/icons/apple.svg" alt="" width={18} height={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Shared field sub-components ─────────────────────────────────────────────

function RequiredMark() {
  return <span aria-hidden="true" style={{ color: "#EF4444", marginLeft: 2 }}>*</span>;
}

function FetchError({ message = "Failed to load.", onRetry }: { message?: string; onRetry: () => void }) {
  return (
    <div className={styles.fetchError}>
      {message}{" "}
      <button type="button" className={styles.retryBtn} onClick={onRetry}>Retry</button>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function BackIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  );
}
function UploadIcon() {
  return <div className={styles.uploadIconWrapper}><Image src="/images/admin/cloud-plus.svg" alt="Upload" width={32} height={32} /></div>;
}
function TrashIcon() {
  return <Image src="/images/admin/trash.svg" alt="Delete" width={20} height={20} />;
}
function FileIcon() {
  return <div className={styles.fileIconBox}><Image src="/images/admin/file-format.svg" alt="File Format" width={32} height={32} /></div>;
}
function CheckIconSmall() {
  return <Image src="/images/admin/success-checkmark.svg" alt="Success" width={14} height={14} />;
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