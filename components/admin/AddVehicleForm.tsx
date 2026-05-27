"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import CustomSelect from "@/components/admin/CustomSelect";
import styles from "./AddVehicleForm.module.css";
import { vehiclesService } from "@/services/vehicles-service";

interface AddVehicleFormProps {
  onCancel: () => void;
  onSave: (data: any) => void;
}

export default function AddVehicleForm({ onCancel, onSave }: AddVehicleFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    year: "",
    color: "",
    category: "",
    price_per_day: "",
    seatingCapacity: "",
    location: "",
    chassisNumber: "",
    vin: "",
    transmission: "",
    fuelType: "",
    features: "",
    image_files: null,
  });

  const [imagePreviews, setImagePreviews] = useState<{ url: string; name: string; size: number; file: File }[]>([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "loading" | "success">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [brandOptions, setBrandOptions] = useState<{ value: string; label: string }[]>([]);
  const [colorOptions, setColorOptions] = useState<{ value: string; label: string }[]>([]);
  const [fuelTypeOptions, setFuelTypeOptions] = useState<{ value: string; label: string }[]>([]);
  const [transmissionOptions, setTransmissionOptions] = useState<{ value: string; label: string }[]>([]);
  const [featureOptions, setFeatureOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const { brands, colors, fuels, transmissions, features } = await vehiclesService.getVehicleOptions();

        setBrandOptions(brands.map((b: any) => ({ value: b.id.toString(), label: b.name })));
        setColorOptions(colors.map((c: any) => ({ value: c.id.toString(), label: c.name })));
        setFuelTypeOptions(fuels.map((f: any) => ({ value: f.value, label: f.label })));
        setTransmissionOptions(transmissions.map((t: any) => ({ value: t.value, label: t.label })));
        setFeatureOptions(features.map((f: any) => ({ value: f.id.toString(), label: f.name })));
      } catch (error) {
        console.error("Failed to fetch vehicle options:", error);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        file: file,
      }));
      console.log("New images:", newImages);
      setImagePreviews((prev) => [...prev, ...newImages]);
      setShowPreviewModal(true); // Open modal after selection
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaveStatus("loading");

    try {
      const payload = new FormData();
      payload.append("brand", formData.name);
      payload.append("model", formData.model);
      payload.append("transmission", formData.transmission);
      payload.append("fuel_type", formData.fuelType);
      payload.append("price_per_day", formData.price_per_day);
      payload.append("year", formData.year);
      payload.append("color", formData.color);
      payload.append("features", formData.features);
      payload.append("chasis_number", formData.chassisNumber);
      payload.append("vin_number", formData.vin);
      payload.append("transmission", formData.transmission);

      // Send files
      imagePreviews.forEach((img) => {
        payload.append("image_files", img.file);
      });

      await vehiclesService.createVehicle(payload);

      setSaveStatus("success");

      setTimeout(() => {
        setSaveStatus("idle");
        onSave(formData);
      }, 3000);
    } catch (error) {
      console.error("Failed to save vehicle:", error);
      setSaveStatus("idle");
      // Optionally handle error state
    }
  };

  const isFormValid = Object.entries(formData).every(([key, value]) => {
    if (key === "image_files") return true; // Handled separately via imagePreviews
    return typeof value === "string" && value.trim() !== "";
  });

  return (
    <div className={styles.formContainer}>
      {/* Header with Breadcrumb and Action Buttons */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={onCancel} aria-label="Go back">
            <BackIcon />
          </button>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
          <button
            className={isFormValid ? styles.saveBtnTopActive : styles.saveBtnTop}
            disabled={!isFormValid || saveStatus !== "idle"}
            onClick={handleSave}
          >
            Save Vehicle
            {saveStatus === "loading" && <Spinner />}
            {saveStatus === "success" && <SuccessCheckmark />}
          </button>
        </div>
      </div>

      {/* Main Form Card */}
      <div className={styles.formCard}>
        <div className={styles.cardContent}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Add New Vehicle</h2>
            <p className={styles.cardSubtitle}>Add New Vehicle</p>
          </div>

          <div className={styles.formGrid}>
            {/* Row 1: Name & Model */}
            <div className={styles.formField}>
              <label className={styles.label}>Name</label>
              <CustomSelect
                name="name"
                value={formData.name}
                placeholder="Select Brand"
                options={brandOptions}
                onChange={handleSelectChange}
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.label}>Model</label>
              <CustomSelect
                name="model"
                value={formData.model}
                placeholder="e.g Camry 2007"
                options={[
                  { value: "camry", label: "Camry 2007" },
                  { value: "civic", label: "Civic 2010" },
                ]}
                onChange={handleSelectChange}
              />
            </div>

            {/* Row 2: Category */}
            <div className={`${styles.formField}`}>
              <label className={styles.label}>Year</label>
              <input
                type="text"
                name="year"
                className={styles.input}
                placeholder="e.g 2025"
                value={formData.year}
                onChange={handleChange}
              />
            </div>
            <div className={`${styles.formField}`}>
              <label className={styles.label}>Color</label>
              <CustomSelect
                name="color"
                value={formData.color}
                placeholder="Select Color"
                options={colorOptions}
                onChange={handleSelectChange}
              />
            </div>

            <div className={`${styles.formField} ${styles.fullWidth}`}>
              <label className={styles.label}>Category</label>
              <CustomSelect
                name="category"
                value={formData.category}
                placeholder="e.g Sedan"
                options={[
                  { value: "sedan", label: "Sedan" },
                  { value: "hatchback", label: "Hatchback" },
                  { value: "suv", label: "SUV" },
                  { value: "coupe", label: "Coupe" },
                  { value: "convertible", label: "Convertible" },
                  { value: "wagon", label: "Wagon" },
                  { value: "truck", label: "Truck" },
                  { value: "minivan", label: "Minivan" },
                ]}
                onChange={handleSelectChange}
              />
            </div>

            {/* Row 3: Price Per Day & Seating Capacity */}
            <div className={styles.formField}>
              <label className={styles.label}>Price Per Day</label>
              <input
                type="text"
                name="price_per_day"
                className={styles.input}
                placeholder="e.g $120.00"
                value={formData.price_per_day}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.label}>Seating Capacity</label>
              <CustomSelect
                name="seatingCapacity"
                value={formData.seatingCapacity}
                placeholder="e.g 4"
                options={[
                  { value: "2", label: "2" },
                  { value: "4", label: "4" },
                  { value: "5", label: "5" },
                  { value: "7", label: "7" },
                  { value: "8", label: "8" },
                  { value: "10", label: "10" },
                  { value: "12", label: "12" },
                ]}
                onChange={handleSelectChange}
              />
            </div>

            {/* Row 4: Location & Chassis Number */}
            <div className={styles.formField}>
              <label className={styles.label}>Location</label>
              <CustomSelect
                name="location"
                value={formData.location}
                placeholder="e.g Lagos"
                options={[
                  { value: "lagos", label: "Lagos" },
                  { value: "abuja", label: "Abuja" },
                ]}
                onChange={handleSelectChange}
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.label}>Chassis Number</label>
              <input
                type="text"
                name="chassisNumber"
                className={styles.input}
                placeholder="e.g 2347890"
                value={formData.chassisNumber}
                onChange={handleChange}
              />
            </div>

            {/* Row 5: VIN */}
            <div className={`${styles.formField} ${styles.fullWidth}`}>
              <label className={styles.label}>VIN</label>
              <input
                type="text"
                name="vin"
                className={styles.input}
                placeholder="e.g 2345678"
                value={formData.vin}
                onChange={handleChange}
              />
            </div>

            {/* Row 6: Transmission & Fuel Type */}
            <div className={styles.formField}>
              <label className={styles.label}>Transmission</label>
              <CustomSelect
                name="transmission"
                value={formData.transmission}
                placeholder="Select Transmission"
                options={transmissionOptions}
                onChange={handleSelectChange}
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.label}>Fuel Type</label>
              <CustomSelect
                name="fuelType"
                value={formData.fuelType}
                placeholder="Select Fuel Type"
                options={fuelTypeOptions}
                onChange={handleSelectChange}
              />
            </div>

            {/* Row 7: Features */}
            <div className={`${styles.formField} ${styles.fullWidth}`}>
              <label className={styles.label}>Features</label>
              <CustomSelect
                name="features"
                value={formData.features}
                placeholder="Select Features"
                options={featureOptions}
                showSearch={true}
                multiple={true}
                onChange={handleSelectChange}
              />
            </div>
          </div>

          {/* Image Upload Zone */}
          <div className={styles.imageSection}>
            <label className={styles.label}>Vehicle Images (Min 5)</label>

            {imagePreviews.length > 0 && !showPreviewModal ? (
              /* New list view after preview */
              <div className={styles.fileList}>
                {imagePreviews.map((img, idx) => (
                  <div key={idx} className={styles.fileCard}>
                    <div className={styles.fileCardLeft}>
                      <FileIcon />
                      <div className={styles.fileInfo}>
                        <p className={styles.fileName}>Image</p>
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
                {/* Re-trigger upload box if needed or button */}
                <div className={styles.fileListActions}>
                  <button
                    className={styles.editPhotosBtn}
                    onClick={() => setShowPreviewModal(true)}
                    type="button"
                  >
                    Edit Photos
                  </button>
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
              <div className={styles.uploadZone}>
                <div className={styles.uploadContent}>
                  <UploadIcon />
                  <p className={styles.uploadText}>
                    <strong>Choose a file</strong> or drag & drop it here.
                  </p>
                  <p className={styles.uploadHint}>JPEG, PNG, and WebP formats, up to 50 MB.</p>
                  <button
                    className={styles.browseBtn}
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
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
              className={styles.hiddenInput}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>

          {/* Preview Modal */}
          {showPreviewModal && (
            <ImagePreviewModal
              images={imagePreviews}
              onClose={() => setShowPreviewModal(false)}
              onRemove={removeImage}
              onAddMore={() => fileInputRef.current?.click()}
              onContinue={() => setShowPreviewModal(false)}
            />
          )}

          {/* Footer Actions */}
          <div className={styles.formFooter}>
            <button className={styles.cancelBtnOutline} onClick={onCancel} type="button">Cancel</button>
            <div className={styles.footerRight}>
              <button className={styles.secondaryBtn} type="button">Add Another Vehicle</button>
              <button
                className={isFormValid ? styles.saveBtnActive : styles.saveBtn}
                disabled={!isFormValid || saveStatus !== "idle"}
                onClick={handleSave}
              >
                Save Vehicle
                {saveStatus === "loading" && <Spinner />}
                {saveStatus === "success" && <SuccessCheckmark />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

/* ─── Modal Component ─── */
interface PreviewModalProps {
  images: { url: string; name: string; size: number; file?: File }[];
  onClose: () => void;
  onRemove: (idx: number) => void;
  onAddMore: () => void;
  onContinue: () => void;
}

function ImagePreviewModal({ images, onClose, onRemove, onAddMore, onContinue }: PreviewModalProps) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleGroup}>
            <h3 className={styles.modalTitle}>Preview</h3>
            <p className={styles.modalSubtitle}>Add New Vehicle</p>
          </div>
          <button className={styles.closeModalBtn} onClick={onClose} aria-label="Close modal">
            <XIcon />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.previewGrid}>
            {images.map((img, idx) => (
              <div key={idx} className={styles.previewItem}>
                <Image src={img.url} alt={`Preview ${idx + 1}`} fill className={styles.previewImg} />
                <button className={styles.removeImgBtn} onClick={() => onRemove(idx)} type="button">
                  <CloseIcon />
                </button>
              </div>
            ))}
            <div className={styles.addMoreBox} onClick={onAddMore}>
              <PlusIconSmall />
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.modalCancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.modalContinueBtn} onClick={onContinue}>Continue</button>
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
        className={styles.uploadIcon}
      />
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function PlusIconSmall() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
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
function SuccessCheckmark() {
  return (
    <div className={styles.successIconWrapper}>
      <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  );
}

function Spinner() {
  return <div className={styles.spinner}></div>;
}
