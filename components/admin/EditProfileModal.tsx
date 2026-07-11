"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { accountsService, Country } from "@/services/accounts-service";
import styles from "./EditProfileModal.module.css";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  onUpdate: (updatedUser: any) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  currentUser,
  onUpdate,
}: EditProfileModalProps) {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryId, setCountryId] = useState<string>("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && currentUser) {
      setFullName(currentUser.full_name || "");
      setPhoneNumber(currentUser.phone_number || "");
      setCountryId(currentUser.country ? String(currentUser.country) : "");
      
      const pic = currentUser.profile_picture || currentUser.profile?.profile_picture;
      const hasPic = pic && !pic.includes("default.jpg");
      setPreviewUrl(hasPic ? pic : null);
      setSelectedFile(null);
    }
  }, [isOpen, currentUser]);

  useEffect(() => {
    const fetchCountriesList = async () => {
      try {
        const list = await accountsService.getCountries();
        setCountries(list);
      } catch (err) {
        console.error("Failed to load countries:", err);
      }
    };
    if (isOpen) {
      fetchCountriesList();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const getInitials = (nameStr: string) => {
    if (!nameStr) return "AD";
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return nameStr.substring(0, 2).toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("full_name", fullName.trim());
      formData.append("phone_number", phoneNumber.trim());
      if (countryId) {
        formData.append("country", countryId);
      }
      if (selectedFile) {
        formData.append("profile_picture", selectedFile);
      }

      const response = await accountsService.updateProfile(formData);
      
      // Construct the newly updated user structure
      const updatedUser = {
        ...currentUser,
        ...(response.data?.user || response.user || {}),
        full_name: response.data?.user?.full_name || response.user?.full_name || fullName.trim(),
        profile_picture: response.data?.profile_picture || response.profile_picture || previewUrl,
        address_line_1: response.data?.address_line_1 ?? currentUser?.address_line_1,
        country: response.data?.country ?? countryId,
        phone_number: response.data?.user?.phone_number || response.user?.phone_number || phoneNumber.trim()
      };

      onUpdate(updatedUser);
      onClose();
    } catch (err) {
      console.error("Profile update failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Edit Profile</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close dialog">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Avatar Upload */}
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper} onClick={handleAvatarClick} role="button" aria-label="Change profile picture">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt={fullName}
                  width={80}
                  height={80}
                  className={styles.avatarImg}
                  unoptimized // support Blob URLs or direct URLs
                />
              ) : (
                <div className={styles.avatarFallback}>
                  {getInitials(fullName)}
                </div>
              )}
              <div className={styles.avatarOverlay}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </div>
            </div>
            <span className={styles.avatarLabel}>Click to change photo</span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>

          {/* Full Name */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="profile-fullname">Full Name</label>
            <input
              id="profile-fullname"
              type="text"
              className={styles.input}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {/* Phone Number */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="profile-phone">Phone Number</label>
            <input
              id="profile-phone"
              type="tel"
              className={styles.input}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Country Selection */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="profile-country">Country</label>
            <select
              id="profile-country"
              className={styles.select}
              value={countryId}
              onChange={(e) => setCountryId(e.target.value)}
              disabled={isLoading}
            >
              <option value="">Select country...</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.iso_code})
                </option>
              ))}
            </select>
          </div>

          {/* Action Footer */}
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={isLoading || !fullName.trim()}
            >
              {isLoading && <span className={styles.spinner} />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
