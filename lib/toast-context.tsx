"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/* ─── Types ─────────────────────────────────────────────────────────────────── */

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  createdAt: number;
}

interface ToastContextValue {
  showToast: (type: ToastType, message: string) => void;
  dismissToast: (id: string) => void;
  toasts: ToastItem[];
}

/* ─── Context ────────────────────────────────────────────────────────────────── */

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION = 4500; // ms

/* ─── Provider ───────────────────────────────────────────────────────────────── */

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timersRef.current[id]);
    delete timersRef.current[id];
  }, []);

  const showToast = useCallback(
    (type: ToastType, message: string) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const item: ToastItem = { id, type, message, createdAt: Date.now() };

      setToasts((prev) => {
        // Cap at 5 visible toasts — remove oldest if over limit
        const next = [...prev, item];
        return next.length > 5 ? next.slice(next.length - 5) : next;
      });

      timersRef.current[id] = setTimeout(() => dismissToast(id), TOAST_DURATION);
    },
    [dismissToast]
  );

  // Bridge for Axios interceptor (outside React tree)
  useEffect(() => {
    (window as any).__showAdminToast = showToast;
    return () => {
      delete (window as any).__showAdminToast;
    };
  }, [showToast]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
}

/* ─── Hook ───────────────────────────────────────────────────────────────────── */

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return ctx;
}
