"use client";

import React from 'react';
import styles from './DeviceMockup.module.css';
import AppScreen from './AppScreen';

export default function DeviceMockup() {
  return (
    <div className={styles.container}>
      {/* Phone Frame */}
      <div className={styles.phoneFrame}>
        {/* Notch */}
        <div className={styles.notch}>
          <div className={styles.camera}></div>
          <div className={styles.speaker}></div>
        </div>

        {/* Screen Container */}
        <div className={styles.screenContainer}>
          <AppScreen />
        </div>

        {/* Physical Buttons */}
        <div className={styles.volumeUp}></div>
        <div className={styles.volumeDown}></div>
        <div className={styles.silent}></div>
        <div className={styles.power}></div>
      </div>

      {/* Decorative Blobs (Background) */}
      <div className={styles.blobTop}></div>
      <div className={styles.blobBottom}></div>
    </div>
  );
}
