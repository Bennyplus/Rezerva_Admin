"use client";

import React from 'react';
import styles from './AppScreen.module.css';

const CARS = [
  {
    id: 1,
    name: "Toyota Highlander 2026",
    price: "3,000",
    location: "Houston, Texas",
    image: "/images/1st-img.png",
    tags: ["Sedan", "Automatic"],
    seats: 4
  },
  {
    id: 2,
    name: "Toyota Corolla 2022",
    price: "3,000",
    location: "Houston, Texas",
    image: "/images/2nd-img.jpg",
    tags: ["Sedan", "Automatic"],
    seats: 4
  }
];

export default function AppScreen() {
  return (
    <div className={styles.screen}>
      {/* Status Bar */}
      <div className={styles.statusBar}>
        <span>9:30</span>
        <div className={styles.statusIcons}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21L1.42 8.59A2 2 0 0 1 2.93 5.41h18.14a2 2 0 0 1 1.51 3.18L12 21z" />
          </svg>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
          </svg>
        </div>
      </div>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.userInfo}>
          <h2 className={styles.greeting}>Hello Prosper,</h2>
          <div className={styles.location}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            42 Montgomery Road, Yaba
          </div>
        </div>
        <div className={styles.headerActions}>
          <svg className={styles.bell} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <img src="https://i.pravatar.cc/150?u=prosper" alt="Prosper" className={styles.avatar} />
        </div>
      </header>

      {/* Search */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBox}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          Find the perfect car for your trip
        </div>
        <div className={styles.filterBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
        </div>
      </div>

      {/* Categories */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h3 className={styles.sectionTitle}>Perfect for Family Trips</h3>
            <p className={styles.sectionSub}>Spacious vehicles for road trips and family travel.</p>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
        
        <div className={styles.carGrid}>
          {CARS.map(car => (
            <div key={car.id} className={styles.carCard}>
              <img src={car.image} alt={car.name} className={styles.carImage} />
              <div className={styles.carMeta}>
                <div className={styles.carPrice}>
                  ${car.price}<span>/day</span>
                </div>
                <div className={styles.carLocation}>
                   <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {car.location}
                </div>
                <h4 className={styles.carTitle}>{car.name}</h4>
                <div className={styles.carTags}>
                  {car.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
                  <span className={styles.tag}>👤 {car.seats}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Section */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h3 className={styles.sectionTitle}>Popular right now</h3>
            <p className={styles.sectionSub}>The most booked vehicles this week</p>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
        <img src="/images/3rd-img.png" style={{ width: 'calc(100% - 20px)', borderRadius: 16, height: 120, objectFit: 'cover' }} />
      </div>

      {/* Bottom Nav */}
      <nav className={styles.bottomNav}>
        <div className={`${styles.navItem} ${styles.navItemActive}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </div>
        <div className={styles.navItem}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <div className={styles.navItem}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      </nav>
    </div>
  );
}
