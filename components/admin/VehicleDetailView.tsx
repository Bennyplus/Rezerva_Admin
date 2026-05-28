"use client";

import { useState } from "react";
import Image from "next/image";
import { AdminVehicle } from "@/data/admin-vehicles";
import styles from "./VehicleDetailView.module.css";

interface VehicleDetailViewProps {
  vehicle: AdminVehicle;
  onBack: () => void;
  onStatusChange: (id: number, status: string) => void;
}

export default function VehicleDetailView({ vehicle, onBack, onStatusChange }: VehicleDetailViewProps) {
  const [activeImage, setActiveImage] = useState<string>(vehicle.image || "/images/3rd-img.png");

  const statusClasses: Record<string, string> = {
    Available: styles.statusAvailable,
    Booked: styles.statusBooked,
    Maintenance: styles.statusMaintenance,
    Inactive: styles.statusInactive
  };

  const getStatusClass = (status: string) => statusClasses[status] || styles.statusAvailable;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft} style={{ display: "block" }}>
          <button className={styles.backBtn} onClick={onBack} aria-label="Go back">
            <BackIcon />
          </button>
          <div className={styles.headerTitle}>
            <p className={styles.headerTitleText}>Vehicle ID</p>
            <div className={styles.idRow}>
              <h1 className={styles.bookingId}>#{vehicle.id}</h1>
              <button className={styles.copyBtn} aria-label="Copy ID">
                <CopyIcon />
              </button>
              <span className={`${styles.badge} ${getStatusClass(vehicle.status)}`}>
                <span className={styles.badgeDot} />
                {vehicle.status}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.cancelBtn} onClick={() => onStatusChange(vehicle.id!, 'inactive')}>Deactivate</button>
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Left Column */}
        <div className={styles.leftCol}>
          {/* Vehicle Information */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Vehicle Information</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Name</span>
                <span className={styles.infoValue}>{vehicle.name}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Brand</span>
                <span className={styles.infoValue}>{vehicle.brand}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Category</span>
                <span className={styles.infoValue}>{vehicle.category}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Daily Price</span>
                <span className={styles.infoValue}>N{vehicle.dailyPrice.toLocaleString()}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Capacity</span>
                <span className={styles.infoValue}>{vehicle.capacity} Seats</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Chassis Number</span>
                <span className={styles.infoValue}>{vehicle.chassisNo}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Location</span>
                <span className={styles.infoValue}>{vehicle.location}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className={styles.rightCol}>
          <div className={styles.imageCard} style={{ position: 'relative', height: '300px', marginBottom: '16px' }}>
            <Image src={activeImage} alt={vehicle.name} sizes="(max-width: 1200px) 100vw, 540px" fill style={{ objectFit: 'cover' }} />
          </div>
          
          {vehicle.images && vehicle.images.length > 1 && (
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px' }}>
              {vehicle.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(img.image)}
                  style={{ 
                    position: 'relative', 
                    width: '80px', 
                    height: '60px', 
                    flexShrink: 0, 
                    borderRadius: '8px', 
                    overflow: 'hidden', 
                    border: activeImage === img.image ? '2px solid #1a1c1e' : '1px solid #e2e4e9',
                    cursor: 'pointer',
                    padding: 0,
                    background: 'transparent'
                  }}
                  aria-label={`View image ${idx + 1}`}
                >
                  <Image src={img.image} alt={`${vehicle.name} thumbnail ${idx + 1}`} fill sizes="80px" style={{ objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <section className={styles.section} style={{ padding: 0 }}>
            <h2 className={styles.sectionTitle}>Quick Actions</h2>
            <div className={styles.actionList}>
              <ActionButton label="Mark As Booked" onClick={() => onStatusChange(vehicle.id!, 'booked')} />
              <ActionButton label="Mark As Maintenance" onClick={() => onStatusChange(vehicle.id!, 'maintenance')} />
              <ActionButton label="Mark As Available" onClick={() => onStatusChange(vehicle.id!, 'available')} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */
function ActionButton({ label, onClick }: { label: string, onClick?: () => void }) {
  return (
    <button className={styles.actionBtn} onClick={onClick}>
      {label}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
    </button>
  );
}

/* ─── Icons ─── */
function BackIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(134, 140, 152, 1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>; }
function CopyIcon() {
  return <Image src="/images/admin/copy.svg" alt="Copy" width={16} height={16} />;
}
