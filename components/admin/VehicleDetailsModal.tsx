"use client";

import Image from "next/image";
import styles from "./VehicleDetailsModal.module.css";
import { AdminVehicle } from "@/data/admin-vehicles";

interface VehicleDetailsModalProps {
  vehicle: AdminVehicle;
  onClose: () => void;
}

export default function VehicleDetailsModal({ vehicle, onClose }: VehicleDetailsModalProps) {
  // In a real scenario, these would come from the vehicle object.
  // We use the design's specific mock details for the display.
  const details = {
    name: "Toyota",
    brand: "Camry 2026",
    dailyPrice: "$120",
    fuelType: "Diesel",
    category: "Sedan",
    location: "Lagos",
    vehicleNumber: "5678FGHJK678",
    seatingCapacity: "4 Seats",
    chassisNumber: "1256HHDINSI234567",
    transmission: "Automatic",
    features: "Bluetooth, Car Radio, Cool Car Feature, Some other stuff lol, Vroom Vroom",
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <h2 className={styles.title}>{vehicle.brand || "Camry 2026"}</h2>
            <span className={styles.badge}>
              <span className={styles.badgeDot} />
              Available
            </span>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <div className={styles.galleryWrap}>
            <div className={styles.gallery}>
              {/* Main Image */}
              <div className={styles.mainImage}>
                <Image 
                  src="/images/3rd-img.png" 
                  alt="Vehicle Main" 
                  fill 
                  className={styles.galleryImg} 
                />
              </div>
              {/* Side Images */}
              <div className={styles.sideImages}>
                <div className={styles.subImage}>
                  <Image 
                    src="/images/4th-img.png" 
                    alt="Vehicle Side 1" 
                    fill 
                    className={styles.galleryImg} 
                  />
                </div>
                <div className={styles.subImage}>
                  <Image 
                    src="/images/5th-img.png" 
                    alt="Vehicle Side 2" 
                    fill 
                    className={styles.galleryImg} 
                  />
                </div>
              </div>
            </div>
          </div>

          <h3 className={styles.detailsTitle}>Details</h3>
          
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Name</span>
              <span className={styles.detailValue}>{details.name}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Brand</span>
              <span className={styles.detailValue}>{details.brand}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Daily Price</span>
              <span className={styles.detailValue}>{details.dailyPrice}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Fuel Type</span>
              <span className={styles.detailValue}>{details.fuelType}</span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Category</span>
              <span className={styles.detailValue}>{details.category}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Location</span>
              <span className={styles.detailValue}>{details.location}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Vehicle Number</span>
              <span className={styles.detailValue}>{details.vehicleNumber}</span>
            </div>
            <div className={styles.detailItem}></div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Seating Capacity</span>
              <span className={styles.detailValue}>{details.seatingCapacity}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Chassis Number</span>
              <span className={styles.detailValue}>{details.chassisNumber}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Transmission</span>
              <span className={styles.detailValue}>{details.transmission}</span>
            </div>
            <div className={styles.detailItem}></div>

            <div className={`${styles.detailItem} ${styles.fullWidth}`}>
              <span className={styles.detailLabel}>Features</span>
              <span className={styles.detailValue}>{details.features}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.btnDeactivate}>Deactivate</button>
          
          <div className={styles.footerRight}>
            <button className={styles.markAsBtn}>
              Mark As <ChevronDownIcon />
            </button>
            <button className={styles.btnEdit}>Edit Vehicle</button>
          </div>
        </div>
      </div>
    </div>
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

function ChevronDownIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
