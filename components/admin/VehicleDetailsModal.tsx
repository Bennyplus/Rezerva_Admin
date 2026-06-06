"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./VehicleDetailsModal.module.css";
import { AdminVehicle } from "@/data/admin-vehicles";

interface VehicleDetailsModalProps {
  vehicle: AdminVehicle;
  onClose: () => void;
  onStatusChange: (id: number, status: string) => void;
}

export default function VehicleDetailsModal({
  vehicle,
  onClose,
  onStatusChange,
}: VehicleDetailsModalProps) {
  const [markAsOpen, setMarkAsOpen] = useState(false);
  const markAsRef = useRef<HTMLDivElement>(null);

  // Determine primary image and additional thumbnails
  const allImages: string[] = [];
  if (vehicle.images && vehicle.images.length > 0) {
    const primary = vehicle.images.find((i) => i.is_primary);
    if (primary) allImages.push(primary.image);
    vehicle.images.forEach((i) => {
      if (!i.is_primary) allImages.push(i.image);
    });
  } else {
    allImages.push(vehicle.image || "/images/3rd-img.png");
  }

  const mainImage = allImages[0] || "/images/3rd-img.png";
  const thumb1 = allImages[1] || "/images/4th-img.png";
  const thumb2 = allImages[2] || "/images/5th-img.png";

  // Status badge styling
  const statusClasses: Record<string, string> = {
    Available: styles.badgeAvailable,
    Booked: styles.badgeBooked,
    Maintenance: styles.badgeMaintenance,
    Inactive: styles.badgeInactive,
  };
  const badgeClass = statusClasses[vehicle.status] || styles.badgeAvailable;

  // Close Mark As dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (markAsRef.current && !markAsRef.current.contains(e.target as Node)) {
        setMarkAsOpen(false);
      }
    };
    if (markAsOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [markAsOpen]);

  // Keyboard close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleMarkAs = (status: string) => {
    if (vehicle.id != null) onStatusChange(vehicle.id, status);
    setMarkAsOpen(false);
    onClose();
  };

  const handleDeactivate = () => {
    if (vehicle.id != null) onStatusChange(vehicle.id, "inactive");
    onClose();
  };

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${vehicle.brand} details`}
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <h2 className={styles.title}>{vehicle.brand || "Camry 2026"}</h2>
            <span className={`${styles.badge} ${badgeClass}`}>
              <span className={styles.badgeDot} />
              {vehicle.status}
            </span>
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close dialog"
            id="vehicle-detail-close-btn"
          >
            <CloseIcon />
          </button>
        </div>

        {/* ── Body ── */}
        <div className={styles.body}>
          {/* Gallery */}
          <div className={styles.galleryWrap}>
            <div className={styles.gallery}>
              <div className={styles.mainImage}>
                <Image
                  src={mainImage}
                  alt={vehicle.name}
                  fill
                  className={styles.galleryImg}
                  sizes="(max-width: 768px) 100vw, 480px"
                />
              </div>
              <div className={styles.sideImages}>
                <div className={styles.subImage}>
                  <Image
                    src={thumb1}
                    alt={`${vehicle.name} view 2`}
                    fill
                    className={styles.galleryImg}
                    sizes="160px"
                  />
                </div>
                <div className={styles.subImage}>
                  <Image
                    src={thumb2}
                    alt={`${vehicle.name} view 3`}
                    fill
                    className={styles.galleryImg}
                    sizes="160px"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <h3 className={styles.detailsTitle}>Details</h3>

          <div className={styles.detailsSection}>
            <div className={styles.detailsGrid}>
              {/* Row 1 */}
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Name</span>
                <span className={styles.detailValue}>{vehicle.name}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Brand</span>
                <span className={styles.detailValue}>{vehicle.brand}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Daily Price</span>
                <span className={styles.detailValue}>
                  ${vehicle.dailyPrice.toLocaleString()}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Fuel Type</span>
                <span className={styles.detailValue}>
                  {(vehicle as any).fuelType || "Diesel"}
                </span>
              </div>

              {/* Row 2 */}
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Category</span>
                <span className={styles.detailValue}>{vehicle.category}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Location</span>
                <span className={styles.detailValue}>{vehicle.location}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Vehicle Number</span>
                <span className={styles.detailValue}>
                  {(vehicle as any).vehicleNumber || vehicle.chassisNo}
                </span>
              </div>
              <div className={styles.detailItem} />

              {/* Row 3 */}
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Seating Capacity</span>
                <span className={styles.detailValue}>
                  {vehicle.capacity} Seats
                </span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Chassis Number</span>
                <span className={styles.detailValue}>{vehicle.chassisNo}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Transmission</span>
                <span className={styles.detailValue}>
                  {(vehicle as any).transmission || "Automatic"}
                </span>
              </div>
              <div className={styles.detailItem} />

              {/* Features — full row */}
              <div className={`${styles.detailItem} ${styles.fullWidth}`}>
                <span className={styles.detailLabel}>Features</span>
                <span className={styles.detailValue}>
                  {(vehicle as any).features ||
                    "Bluetooth, Car Radio, Cool Car Feature, Some other stuff lol, Vroom Vroom"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className={styles.footer}>
          <button
            className={styles.btnDeactivate}
            onClick={handleDeactivate}
            id="vehicle-detail-deactivate-btn"
          >
            Deactivate
          </button>

          <div className={styles.footerRight}>
            {/* Mark As dropdown */}
            <div className={styles.markAsWrapper} ref={markAsRef}>
              <button
                className={styles.markAsBtn}
                onClick={() => setMarkAsOpen((prev) => !prev)}
                id="vehicle-detail-mark-as-btn"
              >
                Mark As <ChevronDownIcon />
              </button>
              {markAsOpen && (
                <div className={styles.markAsDropdown}>
                  <button
                    className={styles.markAsOption}
                    onClick={() => handleMarkAs("available")}
                  >
                    Available
                  </button>
                  <button
                    className={styles.markAsOption}
                    onClick={() => handleMarkAs("booked")}
                  >
                    Booked
                  </button>
                  <button
                    className={styles.markAsOption}
                    onClick={() => handleMarkAs("maintenance")}
                  >
                    Maintenance
                  </button>
                </div>
              )}
            </div>

            <button
              className={styles.btnEdit}
              id="vehicle-detail-edit-btn"
            >
              Edit Vehicle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Icons ─── */
function CloseIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
