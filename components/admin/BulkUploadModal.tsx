"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import styles from "./BulkUploadModal.module.css";
import VehicleDetailsModal from "./VehicleDetailsModal";
import { ADMIN_VEHICLES, AdminVehicle } from "@/data/admin-vehicles";

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "upload" | "selected" | "preview";

export default function BulkUploadModal({ isOpen, onClose }: BulkUploadModalProps) {
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<AdminVehicle | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStep("selected");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setStep("selected");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemoveFile = () => {
    setFile(null);
    setStep("upload");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 KB";
    const k = 1024;
    return Math.round(bytes / k) + " KB";
  };

  const handleRowClick = (vehicle: AdminVehicle) => {
    setSelectedVehicle(vehicle);
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div 
          className={`${styles.modal} ${step === "preview" ? styles.modalLarge : ""}`} 
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={styles.header}>
            <h2 className={styles.title}>
              {step === "preview" ? `Preview ${file?.name || "Vehicles file.csv"}` : "Bulk Upload"}
            </h2>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
              <CloseIcon />
            </button>
          </div>

          {/* Body */}
          <div className={styles.body}>
            {step !== "preview" ? (
              <>
                <div className={styles.intro}>
                  <p className={styles.introText}>
                    Upload multiple vehicles at once using our standardized spreadsheet template. Complete the required fields, then import your file to quickly add vehicles to your fleet.
                  </p>
                  <button className={styles.downloadBtn}>Download Template</button>
                </div>

                <div className={styles.columns}>
                  <div className={styles.instructions}>
                    <ul className={styles.instructionsList}>
                      <li className={styles.instructionItem}>
                        <div className={styles.instructionTitle}>1. Download Template</div>
                        <div className={styles.instructionDesc}>Get the official Drifully vehicle upload template to ensure your data is properly formatted.</div>
                      </li>
                      <li className={styles.instructionItem}>
                        <div className={styles.instructionTitle}>2. Complete Your Data</div>
                        <div className={styles.instructionDesc}>Fill in vehicle details such as make, model, pricing, availability, and specifications.</div>
                      </li>
                      <li className={styles.instructionItem}>
                        <div className={styles.instructionTitle}>3. Upload File</div>
                        <div className={styles.instructionDesc}>Drag and drop your completed spreadsheet or browse your device to upload.</div>
                      </li>
                      <li className={styles.instructionItem}>
                        <div className={styles.instructionTitle}>4. Review & Import</div>
                        <div className={styles.instructionDesc}>Preview your data, resolve any validation errors, and confirm the upload</div>
                      </li>
                    </ul>
                  </div>

                  <div className={styles.requirements}>
                    <div className={styles.requirementsTitle}>Required File Format</div>
                    <ul className={styles.requirementsList}>
                      <li>Supported formats: .CSV, .XLSX</li>
                      <li>Maximum file size: 10MB</li>
                      <li>Maximum upload: 500 vehicles per file</li>
                    </ul>
                  </div>
                </div>

                {step === "upload" ? (
                  <div 
                    className={styles.dropzone}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className={styles.uploadIcon}>
                      <UploadIcon />
                    </div>
                    <h3 className={styles.dropTitle}>Choose a file or drag & drop it here.</h3>
                    <p className={styles.dropSubtitle}>CSV and XLSX formats, up to 10 MB.</p>
                    <button className={styles.browseBtn} type="button">Browse File</button>
                  </div>
                ) : (
                  <div className={styles.fileCard}>
                    <div className={styles.fileCardLeft}>
                      <div className={styles.fileIcon}>CSV</div>
                      <div className={styles.fileInfo}>
                        <h4 className={styles.fileName}>{file?.name || "Vehicles file.csv"}</h4>
                        <p className={styles.fileMeta}>
                          {file ? `0 KB of ${formatFileSize(file.size)}` : "0 KB of 120 KB"} • 
                          <span className={styles.statusSuccess}>
                            <CheckIconSmall /> Completed
                          </span>
                        </p>
                      </div>
                    </div>
                    <button className={styles.deleteBtn} onClick={handleRemoveFile}>
                      <TrashIcon />
                    </button>
                  </div>
                )}
                
                <input
                  type="file"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Name and Model</th>
                      <th>Category</th>
                      <th>
                        <div className={styles.sortHeader}>
                          Daily Price <SortArrowIcon />
                        </div>
                      </th>
                      <th>
                        <div className={styles.sortHeader}>
                          Capacity <SortArrowIcon />
                        </div>
                      </th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ADMIN_VEHICLES.slice(6, 12).map((v, idx) => (
                      <tr key={idx} onClick={() => handleRowClick(v)}>
                        <td>
                          <div className={styles.vehicleCell}>
                            <div className={styles.vehicleThumb}>
                              <Image src={v.image} alt={v.name} fill className={styles.thumbImg} />
                            </div>
                            <div className={styles.vehicleInfo}>
                              <span className={styles.vehicleName}>{v.name}</span>
                              <span className={styles.vehicleBrand}>{v.brand}</span>
                            </div>
                          </div>
                        </td>
                        <td>{v.category}</td>
                        <td>${v.dailyPrice}</td>
                        <td>{v.capacity} Seats</td>
                        <td>
                          <span className={`${styles.badge} ${styles[`status${v.status}`]}`}>
                            <span className={styles.badgeDot} />
                            {v.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <div className={styles.footerLeft}>
              <button className={styles.btnCancel} onClick={onClose}>Cancel</button>
            </div>
            <div className={styles.footerRight}>
              {step === "preview" && (
                <button className={styles.btnBack} onClick={() => setStep("selected")}>Back</button>
              )}
              {step === "selected" && (
                <button className={styles.btnPreview} onClick={() => setStep("preview")}>Preview</button>
              )}
              <button 
                className={step === "upload" ? styles.btnPrimaryDisabled : styles.btnPrimary}
                disabled={step === "upload"}
                onClick={() => {
                  if (step === "preview") {
                    onClose();
                    // Handle actual upload logic here
                  } else if (step === "selected") {
                    // Optional: maybe clicking upload vehicles here bypasses preview?
                  }
                }}
              >
                Upload Vehicles
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedVehicle && (
        <VehicleDetailsModal 
          vehicle={selectedVehicle} 
          onClose={() => setSelectedVehicle(null)} 
          onStatusChange={() => {}}
        />
      )}
    </>
  );
}

/* ─── Icons ─── */
function CloseIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <Image
      src="/images/admin/cloud-plus.svg"
      alt="Upload"
      width={32}
      height={32}
    />
  );
}

function CheckIconSmall() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function SortArrowIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 15l5 5 5-5" />
      <path d="M7 9l5-5 5 5" />
    </svg>
  );
}
