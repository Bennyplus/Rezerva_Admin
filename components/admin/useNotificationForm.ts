"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { notificationsService } from "@/services/notifications-services";

// ─── Constants ────────────────────────────────────────────────────────────────

export const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ACCEPTED_EXTENSIONS = ".jpg,.jpeg,.png,.webp";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
}

export interface ImagePreview {
  url: string;
  name: string;
  size: number;
}

export interface FormState {
  title: string;
  message: string;
  cta: string;
  recipients: string;
  channel: string;
  date: string;
  schedule: boolean;
  userEmails: string;
}

export interface FormErrors {
  title?: string;
  message?: string;
  recipients?: string;
  channel?: string;
  userEmails?: string;
  date?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseNotificationFormOptions {
  onSave: (data: FormData) => void;
}

export function useNotificationForm({ onSave }: UseNotificationFormOptions) {

  // ── Form ────────────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState<FormState>({
    title: "",
    message: "",
    cta: "",
    recipients: "",
    channel: "",
    date: new Date().toISOString(),
    schedule: false,
    userEmails: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormErrors, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Files ───────────────────────────────────────────────────────────────────
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<string[]>([]);

  // ── API data ────────────────────────────────────────────────────────────────
  const [recipientTypes, setRecipientTypes] = useState<SelectOption[]>([]);
  const [recipientTypesLoading, setRecipientTypesLoading] = useState(true);
  const [recipientTypesError, setRecipientTypesError] = useState(false);

  const [deliveryChannels, setDeliveryChannels] = useState<SelectOption[]>([]);
  const [deliveryChannelsLoading, setDeliveryChannelsLoading] = useState(true);
  const [deliveryChannelsError, setDeliveryChannelsError] = useState(false);

  const [availableUsers, setAvailableUsers] = useState<SelectOption[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(false);
  const userIdMapRef = useRef<Record<string, number>>({});

  // ── Cleanup object URLs on unmount ──────────────────────────────────────────
  useEffect(() => {
    return () => { objectUrlsRef.current.forEach(URL.revokeObjectURL); };
  }, []);

  // ── Prefetch ALL dropdown data on mount ──────────────────────────────────────
  const fetchRecipientTypes = useCallback(() => {
    setRecipientTypesLoading(true);
    setRecipientTypesError(false);
    return notificationsService
      .getRecipientTypes()
      .then((types: { value: string; label?: string; display_name?: string }[]) => {
        setRecipientTypes(
          types.map((t) => ({ value: t.value, label: t.label ?? t.display_name ?? t.value }))
        );
      })
      .catch(() => setRecipientTypesError(true))
      .finally(() => setRecipientTypesLoading(false));
  }, []);

  const fetchDeliveryChannels = useCallback(() => {
    setDeliveryChannelsLoading(true);
    setDeliveryChannelsError(false);
    return notificationsService
      .getDeliveryChannels()
      .then((channels: SelectOption[]) => setDeliveryChannels(channels))
      .catch(() => setDeliveryChannelsError(true))
      .finally(() => setDeliveryChannelsLoading(false));
  }, []);

  const fetchUsers = useCallback(() => {
    setUsersLoading(true);
    setUsersError(false);
    return notificationsService
      .getUsersForNotifications()
      .then((users: { id: number; email: string }[]) => {
        const map: Record<string, number> = {};
        users.forEach((u) => { map[u.email] = u.id; });
        userIdMapRef.current = map;
        setAvailableUsers(users.map((u) => ({ value: u.email, label: u.email })));
      })
      .catch(() => setUsersError(true))
      .finally(() => setUsersLoading(false));
  }, []);

  // All three fetched eagerly on mount — no waiting for user interaction
  useEffect(() => {
    fetchRecipientTypes();
    fetchDeliveryChannels();
    fetchUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Validation ───────────────────────────────────────────────────────────────
  const validate = useCallback((data: FormState): FormErrors => {
    const errs: FormErrors = {};
    if (!data.title.trim()) errs.title = "Title is required.";
    if (!stripHtml(data.message)) errs.message = "Message content is required.";
    if (!data.recipients) errs.recipients = "Recipient type is required.";
    if (!data.channel) errs.channel = "Delivery channel is required.";
    if (data.recipients === "specific" && !data.userEmails) {
      errs.userEmails = "Please select at least one user.";
    }
    if (data.schedule) {
      const d = new Date(data.date);
      if (isNaN(d.getTime()) || d <= new Date()) {
        errs.date = "Scheduled date must be in the future.";
      }
    }
    return errs;
  }, []);

  // Re-validate touched fields reactively
  useEffect(() => {
    if (Object.keys(touched).length === 0) return;
    const all = validate(formData);
    const relevant: FormErrors = {};
    (Object.keys(touched) as (keyof FormErrors)[]).forEach((k) => {
      if (all[k]) relevant[k] = all[k];
    });
    setErrors(relevant);
  }, [formData, touched, validate]);

  const markTouched = useCallback((field: keyof FormErrors) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const isFormValid = useMemo(
    () => Object.keys(validate(formData)).length === 0,
    [formData, validate]
  );

  // ── Form handlers ─────────────────────────────────────────────────────────────
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      markTouched(name as keyof FormErrors);
    },
    [markTouched]
  );

  const handleSelectChange = useCallback(
    (name: string, value: string) => {
      setFormData((prev) => {
        const next = { ...prev, [name]: value };
        if (name === "recipients" && value !== "specific") next.userEmails = "";
        return next;
      });
      markTouched(name as keyof FormErrors);
    },
    [markTouched]
  );

  const handleMessageChange = useCallback(
    (content: string) => {
      setFormData((prev) => ({ ...prev, message: content }));
      markTouched("message");
    },
    [markTouched]
  );

  const toggleSchedule = useCallback(() => {
    setFormData((prev) => ({ ...prev, schedule: !prev.schedule }));
  }, []);

  const handleDateChange = useCallback(
    (date: Date) => {
      setFormData((prev) => ({ ...prev, date: date.toISOString() }));
      markTouched("date");
    },
    [markTouched]
  );

  // ── File handling ─────────────────────────────────────────────────────────────
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;
      setFileError("");
      const validFiles: File[] = [];
      const validPreviews: ImagePreview[] = [];

      for (const file of Array.from(files)) {
        if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
          setFileError(`"${file.name}" is not supported. Use JPEG, PNG, or WebP.`);
          continue;
        }
        if (file.size > MAX_FILE_SIZE_BYTES) {
          setFileError(`"${file.name}" exceeds the ${MAX_FILE_SIZE_MB} MB limit.`);
          continue;
        }
        if (selectedFiles.some((f) => f.name === file.name && f.size === file.size)) continue;

        const url = URL.createObjectURL(file);
        objectUrlsRef.current.push(url);
        validFiles.push(file);
        validPreviews.push({ url, name: file.name, size: file.size });
      }

      if (validFiles.length > 0) {
        setSelectedFiles((prev) => [...prev, ...validFiles]);
        setImagePreviews((prev) => [...prev, ...validPreviews]);
      }

      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [selectedFiles]
  );

  const removeImage = useCallback((index: number) => {
    setImagePreviews((prev) => {
      const url = prev[index].url;
      URL.revokeObjectURL(url);
      objectUrlsRef.current = objectUrlsRef.current.filter((u) => u !== url);
      return prev.filter((_, i) => i !== index);
    });
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSaveClick = useCallback(async () => {
    setTouched({ title: true, message: true, recipients: true, channel: true, userEmails: true, date: true });
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("title", formData.title.trim());
      payload.append("message", formData.message);
      payload.append("recipient_type", formData.recipients);
      payload.append("is_scheduled", formData.schedule ? "True" : "False");
      if (formData.schedule) {
        payload.append("scheduled_at", new Date(formData.date).toISOString());
      }
      if (formData.cta.trim()) {
        payload.append("call_to_action", formData.cta.trim());
      }
      payload.append("delivery_channel", formData.channel);

      // Each ID as a separate entry — backend expects integer PKs, not a comma string
      if (formData.recipients === "specific" && formData.userEmails) {
        formData.userEmails
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
          .forEach((email) => {
            const id = userIdMapRef.current[email];
            if (id != null) payload.append("specific_recipients", String(id));
          });
      }

      selectedFiles.forEach((file) => payload.append("media_attachments", file));
      onSave(payload);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, selectedFiles, validate, onSave]);

  return {
    // Form data
    formData,
    errors,
    isFormValid,
    isSubmitting,

    // Handlers
    handleChange,
    handleSelectChange,
    handleMessageChange,
    toggleSchedule,
    handleDateChange,
    handleSaveClick,
    markTouched,

    // File state + handlers
    imagePreviews,
    selectedFiles,
    fileError,
    fileInputRef,
    handleFileChange,
    removeImage,

    // API options
    recipientTypes,
    recipientTypesLoading,
    recipientTypesError,
    fetchRecipientTypes,

    deliveryChannels,
    deliveryChannelsLoading,
    deliveryChannelsError,
    fetchDeliveryChannels,

    availableUsers,
    usersLoading,
    usersError,
    fetchUsers,
  };
}
