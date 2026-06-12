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
  initialData?: any;
}

export function useNotificationForm({ onSave, initialData }: UseNotificationFormOptions) {

  // ── Form ────────────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState<FormState>({
    title: initialData?.title || "",
    message: initialData?.message || "",
    cta: initialData?.call_to_action || "",
    recipients: initialData?.recipient_type || "",
    channel: initialData?.delivery_channel || "",
    date: initialData?.scheduled_at ? new Date(initialData.scheduled_at).toISOString() : new Date().toISOString(),
    schedule: initialData?.is_scheduled || false,
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
        const reverseMap: Record<number, string> = {};
        users.forEach((u) => {
          map[u.email] = u.id;
          reverseMap[u.id] = u.email;
        });
        userIdMapRef.current = map;
        setAvailableUsers(users.map((u) => ({ value: u.email, label: u.email })));

        if (initialData?.specific_recipients?.length > 0) {
          const emails = initialData.specific_recipients
            .map((id: number) => reverseMap[id])
            .filter(Boolean);
          setFormData((prev) => ({ ...prev, userEmails: emails.join(", ") }));
        }
      })
      .catch(() => setUsersError(true))
      .finally(() => setUsersLoading(false));
  }, [initialData]);

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

      const appendIfChanged = (key: string, newValue: any, oldValue: any) => {
        if (!initialData) {
          payload.append(key, newValue);
        } else if (newValue !== oldValue) {
          payload.append(key, newValue);
        }
      };

      appendIfChanged("title", formData.title.trim(), initialData?.title);
      appendIfChanged("message", formData.message, initialData?.message);
      appendIfChanged("recipient_type", formData.recipients, initialData?.recipient_type);

      const isScheduledValue = formData.schedule ? "True" : "False";
      const initialIsScheduledValue = initialData?.is_scheduled ? "True" : "False";
      appendIfChanged("is_scheduled", isScheduledValue, initialIsScheduledValue);

      if (formData.schedule) {
        const currentIso = new Date(formData.date).toISOString();
        const initialIso = initialData?.scheduled_at ? new Date(initialData.scheduled_at).toISOString() : undefined;
        appendIfChanged("scheduled_at", currentIso, initialIso);
      }

      const currentCta = formData.cta.trim();
      const initialCta = initialData?.call_to_action || "";
      if (!initialData || currentCta !== initialCta) {
        payload.append("call_to_action", currentCta);
      }

      appendIfChanged("delivery_channel", formData.channel, initialData?.delivery_channel);

      // Each ID as a separate entry — backend expects integer PKs, not a comma string
      if (formData.recipients === "specific" && formData.userEmails) {
        const newEmails = formData.userEmails.split(",").map(v => v.trim()).filter(Boolean);
        const newIds = newEmails.map(email => userIdMapRef.current[email]).filter(id => id != null).sort();
        const oldIds = initialData?.specific_recipients ? [...initialData.specific_recipients].sort() : [];

        if (!initialData || JSON.stringify(newIds) !== JSON.stringify(oldIds)) {
          newIds.forEach(id => payload.append("specific_recipients", String(id)));
        }
      }

      selectedFiles.forEach((file) => payload.append("media_attachment", file));
      onSave(payload);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, selectedFiles, validate, onSave, initialData]);

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
