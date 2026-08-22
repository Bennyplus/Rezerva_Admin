"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import Pagination from "@/components/admin/Pagination";
import Spinner from "@/components/admin/Spinner";
import FilterBar from "@/components/admin/FilterBar";
import FilterDropdown from "@/components/admin/FilterDropdown";
import SortDropdown from "@/components/admin/SortDropdown";
import MoreIcon from "@/components/admin/icons/MoreIcon";
import CustomSelect from "@/components/admin/CustomSelect";
import CustomDateTimePicker from "@/components/admin/CustomDateTimePicker";
import { contentService, ContentItem } from "@/services/content-service";
import styles from "./content.module.css";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const PAGE_SIZE = 10;

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

const PREVIEW_PLACEHOLDER_MAP = {
  "Legal Document": `<h2>Terms and Conditions</h2><p>Welcome to Rezerva! These terms govern your use of our car rental platform and services. Please read them carefully.</p><p>By renting a vehicle, you agree to: <br/>• Keep the vehicle in safe driving condition.<br/>• Return it with a full tank or equal fuel levels.<br/>• Inform our support team immediately in case of an accident.</p>`,
  "Help Articles": `<h3>Frequently Asked Questions</h3><p><b>Q: How do I book a self-drive car?</b><br/>A: Open the Rezerva app, select your preferred vehicle category, choose your dates, and tap 'Book Now'.</p><p><b>Q: What insurance options are available?</b><br/>A: We offer basic liability cover, premium cover, and collision damage waivers during check-out.</p>`,
  "Onboarding Screens": `<h2>Drive Your Dream Car</h2><p>Fast, flexible, and hassle-free car rentals at your fingertips. Discover premium cars, SUVs, and self-drive options tailored for your travel comfort.</p>`
};

export default function ContentManagementPage() {
  const [currentView, setCurrentView] = useState<"list" | "create">("list");
  const [loading, setLoading] = useState(true);
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals & dropdowns
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<ContentItem["contentType"]>("Legal Document");
  const [activeDropdown, setActiveDropdown] = useState<string | number | null>(null);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);

  // Form Fields matching CreateNotificationForm fields & useNotificationForm hook variables
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [cta, setCta] = useState("");
  const [mediaAttachment, setMediaAttachment] = useState("");
  const [schedule, setSchedule] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  
  // File attachments state matching upload zone preview
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviews, setImagePreviews] = useState<{ name: string; size: number; url: string }[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchContents = async () => {
    setLoading(true);
    try {
      const data = await contentService.getContents(currentPage, searchQuery);
      setContents(data.results);
      setTotalCount(data.count);
    } catch (e) {
      console.error("Failed to load contents:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, [currentPage, searchQuery]);

  const handleCreateClick = () => {
    setIsTypeModalOpen(true);
  };

  const handleSelectType = (type: ContentItem["contentType"]) => {
    setSelectedType(type);
    setIsTypeModalOpen(false);
    setEditingItem(null);
    // Reset Form fields
    setTitle("");
    setMessage("");
    setCta("");
    setMediaAttachment("");
    setSchedule(false);
    setDate(new Date());
    setImagePreviews([]);
    setSelectedFile(null);
    setFileError(null);
    setCurrentView("create");
  };

  const handleBack = () => {
    setCurrentView("list");
    setEditingItem(null);
  };

  const handleEdit = (item: ContentItem) => {
    setEditingItem(item);
    setSelectedType(item.contentType);
    setTitle(item.title);
    setMessage(item.message);
    setCta(item.callToAction || "");
    setMediaAttachment(item.mediaAttachment || "");
    setSchedule(item.status === "Scheduled");
    setImagePreviews(item.mediaAttachment ? [{ name: "attachment_file.png", size: 245000, url: item.mediaAttachment }] : []);
    setSelectedFile(null);
    setFileError(null);
    setActiveDropdown(null);
    setCurrentView("create");
  };

  const handlePublish = async (id: string | number) => {
    try {
      await contentService.publishContent(id);
      setActiveDropdown(null);
      fetchContents();
    } catch (e) {
      console.error("Failed to publish content:", e);
    }
  };

  const handleDuplicate = async (id: string | number) => {
    try {
      await contentService.duplicateContent(id);
      setActiveDropdown(null);
      fetchContents();
    } catch (e) {
      console.error("Failed to duplicate content:", e);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (confirm("Are you sure you want to delete this content item?")) {
      try {
        await contentService.deleteContent(id);
        setActiveDropdown(null);
        fetchContents();
      } catch (e) {
        console.error("Failed to delete content:", e);
      }
    }
  };

  // Form Validation
  const isFormValid = title.trim().length > 0 && message.trim().length > 0;

  const handleSubmitForm = async (status: "Published" | "Draft" | "Scheduled") => {
    if (!isFormValid) return;

    try {
      const finalStatus = schedule ? "Scheduled" : status;
      const payload = {
        title,
        contentType: selectedType,
        status: finalStatus,
        message,
        callToAction: cta || undefined,
        mediaAttachment: mediaAttachment || undefined
      };

      if (editingItem) {
        await contentService.updateContent(editingItem.id, payload, selectedFile || undefined);
      } else {
        await contentService.createContent(payload, selectedFile || undefined);
      }

      setCurrentView("list");
      setEditingItem(null);
      setSelectedFile(null);
      fetchContents();
    } catch (e) {
      console.error("Failed to save content:", e);
    }
  };

  // File Upload Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setSelectedFile(file);

    const url = URL.createObjectURL(file);
    setImagePreviews([{ name: file.name, size: file.size, url }]);
    setMediaAttachment(url);
  };

  const removeImage = (index: number) => {
    setImagePreviews([]);
    setMediaAttachment("");
    setSelectedFile(null);
  };

  // Unique filter options
  const contentTypes = ["Legal Document", "Help Articles", "Onboarding Screens"];
  const statuses = ["Published", "Draft", "Scheduled"];

  if (loading && contents.length === 0) {
    return (
      <div style={{ display: "flex", height: "100%", width: "100%", minHeight: "60vh", alignItems: "center", justifyContent: "center" }}>
        <Spinner size={40} />
      </div>
    );
  }

  const isEmpty = contents.length === 0;

  return (
    <div className={styles.page}>
      {currentView === "list" ? (
        <>
          <div className={styles.header}>
            <div>
              <h1 className={styles.headerTitle}>Content Management</h1>
              <p className={styles.headerSubtitle}>
                Manage platform content, legal pages, and in-app resources from one place.
              </p>
            </div>
            <button className={styles.createBtn} onClick={handleCreateClick}>
              Create Content
            </button>
          </div>

          {isEmpty ? (
            /* ─── Empty State ─── */
            <div className={styles.emptyCard} id="content-empty-state">
              <h2 className={styles.emptyTitle}>No content available</h2>
              <p className={styles.emptySubtitle}>
                Platform contents, legal pages, and in-app resources will appear here
              </p>
            </div>
          ) : (
            /* ─── Active Content List Table ─── */
            <>
              {/* Filter and search toolbar */}
              <div className={styles.toolbar}>
                <div className={styles.toolbarLeft}>
                  <FilterBar
                    searchValue={searchQuery}
                    onSearchChange={setSearchQuery}
                    hideSort={false}
                    filterDropdown={
                      <FilterDropdown
                        tabs={[
                          { id: 'contentType', label: 'Content Type', options: contentTypes },
                          { id: 'status', label: 'Statuses', options: statuses }
                        ]}
                        onApply={(filters) => {
                          console.log("Applied filters:", filters);
                        }}
                      />
                    }
                    sortDropdown={
                      <SortDropdown
                        options={[
                          { label: "Newest to Oldest", value: "date_desc" },
                          { label: "Oldest to Newest", value: "date_asc" }
                        ]}
                        onSortSelect={(option) => console.log("Sorted:", option)}
                      />
                    }
                  />
                </div>
              </div>

              {/* Data Table */}
              <div className={styles.tableCard}>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.checkCol}>
                          <input type="checkbox" className={styles.checkbox} aria-label="Select all rows" />
                        </th>
                        <th>Title</th>
                        <th>Content Type</th>
                        <th>Last Updated</th>
                        <th>Updated By</th>
                        <th>Status</th>
                        <th className={styles.actionCell}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {contents.map((item) => (
                        <tr key={item.id}>
                          <td className={styles.checkCol}>
                            <input type="checkbox" className={styles.checkbox} aria-label={`Select item ${item.id}`} />
                          </td>
                          <td style={{ fontWeight: 600, color: "#111827" }}>{item.title}</td>
                          <td>{item.contentType}</td>
                          <td>{item.lastUpdated}</td>
                          <td>{item.updatedBy}</td>
                          <td>
                            <span className={styles.statusBadge} data-status={item.status.toLowerCase()}>
                              <span className={styles.statusDot} />
                              {item.status}
                            </span>
                          </td>
                          <td className={styles.actionCell} style={{ position: "relative" }}>
                            <button
                              className={styles.moreBtn}
                              onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                            >
                              <MoreIcon />
                            </button>
                            {activeDropdown === item.id && (
                              <div className={styles.dropdown}>
                                <button className={styles.dropdownItem} onClick={() => handleEdit(item)}>
                                  Edit Content
                                </button>
                                {item.status !== "Published" && (
                                  <button className={styles.dropdownItem} onClick={() => handlePublish(item.id)}>
                                    Publish
                                  </button>
                                )}
                                <button className={styles.dropdownItem} onClick={() => handleDuplicate(item.id)}>
                                  Duplicate
                                </button>
                                <button className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`} onClick={() => handleDelete(item.id)}>
                                  Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(totalCount / PAGE_SIZE) || 1}
                  resultsPerPage={PAGE_SIZE}
                  onPageChange={setCurrentPage}
                  variant="table"
                />
              </div>
            </>
          )}
        </>
      ) : (
        /* ─── Split Creation Form & Live Phone Preview matching CreateNotificationForm design ─── */
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <button className={styles.backBtn} onClick={handleBack} aria-label="Go back">
              <BackIcon />
            </button>
            <div className={styles.headerActions}>
              <button type="button" className={styles.cancelBtn} onClick={handleBack}>
                Cancel
              </button>
              <button
                type="button"
                className={`${styles.saveBtn} ${isFormValid ? styles.saveBtnActive : ""}`}
                disabled={!isFormValid}
                onClick={() => handleSubmitForm("Published")}
              >
                {editingItem ? "Update Content" : "Create & Upload Content"}
              </button>
            </div>
          </div>

          <div className={styles.content}>
            {/* Form Card */}
            <div className={styles.formCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{editingItem ? "Edit Content" : "Create New Content"}</h2>
                <p className={styles.cardSubtitle}>
                  {editingItem ? "Update the details of your content document." : "Fill in the details to compose and publish your content."}
                </p>
              </div>

              <div className={styles.formGrid}>
                {/* Title */}
                <div className={styles.fieldGroup}>
                  <label htmlFor="content-title" className={styles.label}>Title <RequiredMark /></label>
                  <input
                    id="content-title"
                    type="text"
                    placeholder="e.g Longstreet"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={styles.input}
                  />
                </div>

                {/* Message Rich Text Editor */}
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Message Content <RequiredMark /></label>
                  <div className={styles.editorContainer}>
                    <JoditEditor value={message} config={EDITOR_CONFIG} onChange={setMessage} />
                  </div>
                </div>

                {/* Call to Action */}
                <div className={styles.fieldGroup}>
                  <label htmlFor="content-cta" className={styles.label}>
                    Call To Action <span className={styles.labelOptional}>(Optional)</span>
                  </label>
                  <input
                    id="content-cta"
                    type="text"
                    placeholder="e.g Join Now"
                    value={cta}
                    onChange={(e) => setCta(e.target.value)}
                    className={styles.input}
                  />
                </div>

                {/* Media Attachment Upload zone */}
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
                                  {Math.round(img.size / 1024)} KB •{" "}
                                  <span className={styles.statusSuccess}><CheckIconSmall /> Completed</span>
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              className={styles.deleteFileBtn}
                              onClick={() => removeImage(idx)}
                              aria-label="Remove attachment"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        className={styles.uploadZone}
                        onClick={() => fileInputRef.current?.click()}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                      >
                        <div className={styles.uploadContent}>
                          <UploadIcon />
                          <p className={styles.uploadText}><strong>Choose a file</strong> or drag &amp; drop it here.</p>
                          <p className={styles.uploadHint}>JPEG, PNG, and WebP formats, up to 50 MB.</p>
                          <button
                            type="button"
                            className={styles.browseBtn}
                            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                          >
                            Browse File
                          </button>
                        </div>
                      </div>
                    )}
                    <input
                      type="file" accept="image/*"
                      style={{ display: "none" }} ref={fileInputRef}
                      onChange={handleFileChange} aria-hidden="true" tabIndex={-1}
                    />
                  </div>
                </div>

                {/* Schedule Toggle */}
                <div className={styles.scheduleToggle}>
                  <div
                    role="switch" aria-checked={schedule} aria-label="Schedule notification"
                    tabIndex={0}
                    className={`${styles.toggle} ${schedule ? styles.toggleActive : ""}`}
                    onClick={() => setSchedule(!schedule)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSchedule(!schedule); } }}
                  >
                    <div className={styles.toggleDot} />
                  </div>
                  <span className={styles.toggleLabel}>Schedule Notification</span>
                </div>

                {/* Date Picker */}
                {schedule && (
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Scheduled Date &amp; Time <RequiredMark /></label>
                    <CustomDateTimePicker
                      value={date}
                      onChange={setDate}
                    />
                  </div>
                )}

                {/* Footer Buttons */}
                <div className={styles.formFooter}>
                  <button type="button" className={styles.secondaryBtn} onClick={() => handleSubmitForm("Draft")}>
                    Save As Draft
                  </button>
                  <button
                    type="button"
                    className={`${styles.saveBtn} ${isFormValid ? styles.saveBtnActive : ""}`}
                    disabled={!isFormValid}
                    onClick={() => handleSubmitForm("Published")}
                  >
                    {editingItem ? "Update Content" : "Create & Upload Content"}
                  </button>
                </div>

              </div>
            </div>

            {/* Simulated Live Preview */}
            <div className={styles.previewSection}>
              <div className={styles.previewCard}>
                <div className={styles.previewHeader}>
                  <span className={styles.previewLogo}>REZERVA</span>
                </div>
                <div className={styles.previewImageContainer}>
                  <div className={styles.previewImage}>
                    {mediaAttachment ? (
                      <Image src={mediaAttachment} alt="Notification preview" fill style={{ objectFit: "cover" }} unoptimized />
                    ) : (
                      <ImagePlaceholder />
                    )}
                  </div>
                </div>
                <div className={styles.previewBody}>
                  <h3 className={`${styles.previewTitle} ${!title ? styles.previewPlaceholder : ""}`}>
                    {title || "Invited: Grand Launching!"}
                  </h3>
                  <div className={styles.previewTextWrapper}>
                    <div
                      className={`${styles.previewMainText} ${!message ? styles.previewPlaceholder : ""}`}
                      dangerouslySetInnerHTML={{ __html: message || PREVIEW_PLACEHOLDER_MAP[selectedType] }}
                    />
                  </div>
                  {cta && <button className={styles.previewCTA}>{cta}</button>}
                </div>
                <div className={styles.previewFooter}>
                  <p className={styles.footerBrand}>REZERVA</p>
                  <p className={styles.footerText}>
                    Wherever you're going, start with Rezerva.<br />
                    Download the app and take control of your next journey.
                  </p>
                  <div className={styles.appStoreButtons}>
                    <button className={`${styles.appBtn} ${styles.appBtnDark}`} type="button">
                      <span className={styles.appBtnText}><span className={styles.appBtnMain}>Get it on Google Play</span></span>
                    </button>
                    <button className={styles.appBtn} type="button">
                      <span className={styles.appBtnText}><span className={styles.appBtnMain}>Download on the App Store</span></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Select Content Type Modal Dialog */}
      {isTypeModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsTypeModalOpen(false)}>
          <div className={styles.typeModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Select Content Type</h3>
              <button className={styles.closeBtn} onClick={() => setIsTypeModalOpen(false)}>
                ×
              </button>
            </div>
            <div className={styles.modalContent}>
              <button className={styles.typeOption} onClick={() => handleSelectType("Legal Document")}>
                <span className={styles.typeLabel}>Legal Document</span>
                <span className={styles.typeArrow}>→</span>
              </button>
              <button className={styles.typeOption} onClick={() => handleSelectType("Help Articles")}>
                <span className={styles.typeLabel}>Help Articles</span>
                <span className={styles.typeArrow}>→</span>
              </button>
              <button className={styles.typeOption} onClick={() => handleSelectType("Onboarding Screens")}>
                <span className={styles.typeLabel}>Onboarding Screens</span>
                <span className={styles.typeArrow}>→</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Shared field sub-components ─────────────────────────────────────────────

function RequiredMark() {
  return <span aria-hidden="true" style={{ color: "#EF4444", marginLeft: 2 }}>*</span>;
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
