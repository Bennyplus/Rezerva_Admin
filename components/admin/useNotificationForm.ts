"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";

export const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ACCEPTED_EXTENSIONS = ".jpg,.jpeg,.png,.webp";

export interface SelectOption {
  value: string;
  label: string;
}

export const RECIPIENT_TYPES: SelectOption[] = [
  { value: "all_users", label: "All Users" },
  { value: "all_vendors", label: "All Vendors" },
  { value: "all_admins", label: "All Admins" },
  { value: "specific", label: "Specific Users" },
];

export const DELIVERY_CHANNELS: SelectOption[] = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push Notification" },
  { value: "in_app", label: "In-App" },
  { value: "all", label: "All Channels" },
];

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

export const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "").trim();

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

interface UseNotificationFormOptions {
  onSave: (data: FormData) => void;
  initialData?: any;
}

export function useNotificationForm({ onSave, initialData }: UseNotificationFormOptions) {
  const [formData, setFormData] = useState<FormState>({
    title: initialData?.title || "",
    message: initialData?.message || "",
    cta: initialData?.call_to_action || "",
    recipients: initialData?.recipient_type || "all_users",
    channel: initialData?.delivery_channel || "email",
    date: initialData?.scheduled_at ? new Date(initialData.scheduled_at).toISOString() : new Date().toISOString(),
    schedule: initialData?.is_scheduled || false,
    userEmails: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormErrors, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<string[]>([]);

  const [recipientTypes, setRecipientTypes] = useState<SelectOption[]>(RECIPIENT_TYPES);
  const [recipientTypesLoading, setRecipientTypesLoading] = useState(false);
  const [recipientTypesError, setRecipientTypesError] = useState(false);

  const [deliveryChannels, setDeliveryChannels] = useState<SelectOption[]>(DELIVERY_CHANNELS);
  const [deliveryChannelsLoading, setDeliveryChannelsLoading] = useState(false);
  const [deliveryChannelsError, setDeliveryChannelsError] = useState(false);

  const [availableUsers, setAvailableUsers] = useState<SelectOption[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(false);

  useEffect(() => () => { objectUrlsRef.current.forEach(URL.revokeObjectURL); }, []);

  const fetchRecipientTypes = useCallback(() => {
    setRecipientTypesLoading(false);
    setRecipientTypesError(false);
    setRecipientTypes(RECIPIENT_TYPES);
    return Promise.resolve();
  }, []);

  const fetchDeliveryChannels = useCallback(() => {
    setDeliveryChannelsLoading(false);
    setDeliveryChannelsError(false);
    setDeliveryChannels(DELIVERY_CHANNELS);
    return Promise.resolve();
  }, []);

  const fetchUsers = useCallback(() => {
    setUsersLoading(false);
    setUsersError(false);
    setAvailableUsers([]);
    return Promise.resolve();
  }, []);

  useEffect(() => {
    fetchRecipientTypes();
    fetchDeliveryChannels();
    fetchUsers();
  }, [fetchRecipientTypes, fetchDeliveryChannels, fetchUsers]);

  const validate = useCallback((data: FormState): FormErrors => {
    const errs: FormErrors = {};
    if (!data.title.trim()) errs.title = "Title is required.";
    if (!stripHtml(data.message)) errs.message = "Message content is required.";
    if (!data.recipients) errs.recipients = "Recipient type is required.";
    if (!data.channel) errs.channel = "Delivery channel is required.";
    if (data.recipients === "specific" && !data.userEmails) errs.userEmails = "Please select at least one user.";
    if (data.schedule) {
      const d = new Date(data.date);
      if (isNaN(d.getTime()) || d <= new Date()) errs.date = "Scheduled date must be in the future.";
    }
    return errs;
  }, []);

  useEffect(() => {
    if (Object.keys(touched).length === 0) return;
    const all = validate(formData);
    const relevant: FormErrors = {};
    (Object.keys(touched) as (keyof FormErrors)[]).forEach((k) => { if (all[k]) relevant[k] = all[k]; });
    setErrors(relevant);
  }, [formData, touched, validate]);

  const markTouched = useCallback((f: keyof FormErrors) => setTouched((p) => ({ ...p, [f]: true })), []);
  const isFormValid = useMemo(() => Object.keys(validate(formData)).length === 0, [formData, validate]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    markTouched(name as keyof FormErrors);
  }, [markTouched]);

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData((p) => {
      const next = { ...p, [name]: value };
      if (name === "recipients" && value !== "specific") next.userEmails = "";
      return next;
    });
    markTouched(name as keyof FormErrors);
  }, [markTouched]);

  const handleMessageChange = useCallback((content: string) => {
    setFormData((p) => ({ ...p, message: content }));
    markTouched("message");
  }, [markTouched]);

  const toggleSchedule = useCallback(() => setFormData((p) => ({ ...p, schedule: !p.schedule })), []);

  const handleDateChange = useCallback((date: Date) => {
    setFormData((p) => ({ ...p, date: date.toISOString() }));
    markTouched("date");
  }, [markTouched]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
      setSelectedFiles((p) => [...p, ...validFiles]);
      setImagePreviews((p) => [...p, ...validPreviews]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [selectedFiles]);

  const removeImage = useCallback((index: number) => {
    setImagePreviews((p) => {
      URL.revokeObjectURL(p[index].url);
      objectUrlsRef.current = objectUrlsRef.current.filter((u) => u !== p[index].url);
      return p.filter((_, i) => i !== index);
    });
    setSelectedFiles((p) => p.filter((_, i) => i !== index));
  }, []);

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
      payload.append("recipient_type", formData.recipients || "all_users");
      payload.append("delivery_channel", formData.channel || "email");
      if (formData.cta.trim()) payload.append("call_to_action", formData.cta.trim());
      if (formData.schedule) {
        payload.append("is_scheduled", "True");
        payload.append("scheduled_at", new Date(formData.date).toISOString());
      }
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => payload.append("media_attachment", file));
      }
      if (formData.recipients === "specific" && formData.userEmails) {
        formData.userEmails.split(",").map((s) => s.trim()).filter(Boolean)
          .forEach((email) => payload.append("specific_recipients", email));
      }
      onSave(payload);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, selectedFiles, validate, onSave]);

  return {
    formData, errors, isFormValid, isSubmitting,
    handleChange, handleSelectChange, handleMessageChange, toggleSchedule, handleDateChange, handleSaveClick, markTouched,
    imagePreviews, selectedFiles, fileError, fileInputRef, handleFileChange, removeImage,
    recipientTypes, recipientTypesLoading, recipientTypesError, fetchRecipientTypes,
    deliveryChannels, deliveryChannelsLoading, deliveryChannelsError, fetchDeliveryChannels,
    availableUsers, usersLoading, usersError, fetchUsers,
  };
}
