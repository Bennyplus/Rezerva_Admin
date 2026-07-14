"use client";

import React, { useState, useRef } from "react";
import styles from "./VehicleInspectionModal.module.css";

interface VehicleInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { images: Record<string, File>; mileage: string }) => Promise<void>;
}

const INSPECTION_SLOTS = [
  { id: "front_view", label: "Front View" },
  { id: "back_view", label: "Back View" },
  { id: "interior", label: "Interior" },
  { id: "left_side", label: "Left Side" },
  { id: "right_side", label: "Right Side" },
  { id: "dashboard", label: "Dashboard" },
];

export default function VehicleInspectionModal({
  isOpen,
  onClose,
  onConfirm,
}: VehicleInspectionModalProps) {
  const [images, setImages] = useState<Record<string, File>>({});
  const [mileage, setMileage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  if (!isOpen) return null;

  const handleFileChange = (slotId: string, file: File | null) => {
    if (!file) return;

    // Validate type: JPEG or PNG
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      alert("Only JPEG and PNG images are allowed.");
      return;
    }

    // Validate size: 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be under 5MB.");
      return;
    }

    setImages((prev) => ({ ...prev, [slotId]: file }));
  };

  const handleRemoveImage = (slotId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setImages((prev) => {
      const updated = { ...prev };
      delete updated[slotId];
      return updated;
    });
    if (fileInputRefs.current[slotId]) {
      fileInputRefs.current[slotId]!.value = "";
    }
  };

  const handleDragOver = (slotId: string, e: React.DragEvent) => {
    e.preventDefault();
    setDragOverSlot(slotId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverSlot(null);
  };

  const handleDrop = (slotId: string, e: React.DragEvent) => {
    e.preventDefault();
    setDragOverSlot(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(slotId, e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = 1;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const isAllImagesUploaded = INSPECTION_SLOTS.every((slot) => !!images[slot.id]);
  const isFormValid = isAllImagesUploaded && mileage.trim() !== "";

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onConfirm({ images, mileage });
      onClose();
    } catch (error) {
      console.error("Failed to submit vehicle inspection:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className={styles.title}>Vehicle Inspection</h2>
        <p className={styles.description}>Upload clear photos of the vehicle before handover.</p>

        <div className={styles.grid}>
          {INSPECTION_SLOTS.map((slot) => {
            const file = images[slot.id];
            const isDragging = dragOverSlot === slot.id;

            if (file) {
              return (
                <div key={slot.id} className={styles.uploadedCard}>
                  <div className={styles.fileHeader}>
                    <div className={styles.fileIcon}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </div>
                    <button
                      className={styles.deleteBtn}
                      onClick={(e) => handleRemoveImage(slot.id, e)}
                      title="Remove file"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                  <div className={styles.fileName} title={file.name}>
                    {slot.label}
                  </div>
                  <div className={styles.fileSize}>{formatFileSize(file.size)}</div>
                </div>
              );
            }

            return (
              <div
                key={slot.id}
                className={`${styles.slotCard} ${isDragging ? styles.dragOver : ""}`}
                onClick={() => fileInputRefs.current[slot.id]?.click()}
                onDragOver={(e) => handleDragOver(slot.id, e)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(slot.id, e)}
              >
                <input
                  type="file"
                  ref={(el) => {
                    fileInputRefs.current[slot.id] = el;
                  }}
                  style={{ display: "none" }}
                  accept="image/jpeg,image/png"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0] || null;
                    handleFileChange(slot.id, selectedFile);
                  }}
                />
                <div className={styles.uploadIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.6097 19.999C17.9497 20.009 19.2397 19.509 20.2297 18.609C23.4997 15.749 21.7497 10.009 17.4397 9.46897C15.8997 0.128972 2.42973 3.66897 5.61973 12.559" stroke="#868C98" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M7.27938 12.9708C6.74938 12.7008 6.15938 12.5608 5.56938 12.5708C0.909376 12.9008 0.919376 19.6808 5.56938 20.0108" stroke="#868C98" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M15.8203 9.89047C16.3403 9.63047 16.9003 9.49047 17.4803 9.48047" stroke="#868C98" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12.9688 20H8.96875" stroke="#868C98" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M10.9688 22V18" stroke="#868C98" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <div className={styles.slotLabel}>{slot.label}</div>
                <button type="button" className={styles.uploadBtn}>
                  Upload Image
                </button>
              </div>
            );
          })}
        </div>

        <p className={styles.helperText}>
          Ensure all images are well-lit and clearly show the vehicle condition.
        </p>

        <div className={styles.mileageSection}>
          <label htmlFor="mileage-input" className={styles.mileageLabel}>
            Current Mileage
          </label>
          <input
            id="mileage-input"
            type="text"
            className={styles.mileageInput}
            placeholder="Enter the current mileage of the car"
            value={mileage}
            onChange={(e) => {
              // Only allow numeric input (with optional comma or space)
              const clean = e.target.value.replace(/[^0-9]/g, "");
              if (clean) {
                // Format with commas for display
                const formatted = Number(clean).toLocaleString();
                setMileage(formatted);
              } else {
                setMileage("");
              }
            }}
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button
            className={styles.continueBtn}
            type="button"
            disabled={!isFormValid || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                Uploading...
                <div className={styles.spinner} />
              </>
            ) : (
              "Continue"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
