"use client";

import { useState, useEffect } from "react";
import Spinner from "@/components/admin/Spinner";
import styles from "./PaymentsWalletForm.module.css";
import {
  paymentsWalletService,
  PaymentsWalletConfig,
  DEFAULT_PAYMENTS_WALLET_CONFIG,
  CURRENCY_OPTIONS,
  REFUND_WINDOW_OPTIONS,
  REFUND_TYPE_OPTIONS,
} from "@/services/payments-wallet-service";

export default function PaymentsWalletForm() {
  const [config, setConfig] = useState<PaymentsWalletConfig>({
    ...DEFAULT_PAYMENTS_WALLET_CONFIG,
  });
  const [loading, setLoading] = useState(true);

  // Section-specific dirty flags
  const [currencyDirty, setCurrencyDirty] = useState(false);
  const [paymentMethodsDirty, setPaymentMethodsDirty] = useState(false);
  const [refundPolicyDirty, setRefundPolicyDirty] = useState(false);

  // Saving states
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load config on mount
  useEffect(() => {
    let isMounted = true;
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const live = await paymentsWalletService.getConfig();
        if (live && isMounted) {
          setConfig(live);
        }
      } catch (err) {
        console.error("Failed to load payments & wallet config:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchConfig();
    return () => {
      isMounted = false;
    };
  }, []);

  const showSuccessToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  /* ─── Currency Handlers ─── */
  const handleCurrencyChange = (val: string) => {
    setConfig((prev) => ({
      ...prev,
      currency: { defaultCurrency: val },
    }));
    setCurrencyDirty(true);
  };

  const handleUpdateCurrency = async () => {
    if (!currencyDirty || savingSection) return;
    setSavingSection("currency");
    try {
      await paymentsWalletService.updateCurrency(config.currency);
      setCurrencyDirty(false);
      showSuccessToast("Default currency updated successfully");
    } catch (err) {
      console.error("Failed to update currency:", err);
    } finally {
      setSavingSection(null);
    }
  };

  /* ─── Payment Methods Handlers ─── */
  const handlePaymentMethodToggle = (
    method: "wallet" | "card" | "bankTransfers" | "cash"
  ) => {
    setConfig((prev) => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [method]: !prev.paymentMethods[method],
      },
    }));
    setPaymentMethodsDirty(true);
  };

  const handleUpdatePaymentMethods = async () => {
    if (!paymentMethodsDirty || savingSection) return;
    setSavingSection("payment-methods");
    try {
      await paymentsWalletService.updatePaymentMethods(config.paymentMethods);
      setPaymentMethodsDirty(false);
      showSuccessToast("Payment methods updated successfully");
    } catch (err) {
      console.error("Failed to update payment methods:", err);
    } finally {
      setSavingSection(null);
    }
  };

  /* ─── Refund Policy Handlers ─── */
  const handleRefundFieldChange = (
    field: "autoRefundWindow" | "refundTypes",
    val: string
  ) => {
    setConfig((prev) => ({
      ...prev,
      refundPolicy: {
        ...prev.refundPolicy,
        [field]: val,
      },
    }));
    setRefundPolicyDirty(true);
  };

  const handleUpdateRefundPolicy = async () => {
    if (!refundPolicyDirty || savingSection) return;
    setSavingSection("refund-policy");
    try {
      await paymentsWalletService.updateRefundPolicy(config.refundPolicy);
      setRefundPolicyDirty(false);
      showSuccessToast("Refund policy updated successfully");
    } catch (err) {
      console.error("Failed to update refund policy:", err);
    } finally {
      setSavingSection(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper} id="payments-wallet-form-loading">
        <Spinner size={36} color="#375DFB" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* ─── 1. Currency Section ─── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.title}>Currency</h2>
          <p className={styles.subtitle}>
            Configure the default currency and formatting used across the Rezerva platform.
          </p>
        </div>

        <div className={styles.formRow}>
          <label className={styles.formLabel} htmlFor="default-currency-select">
            Default Currency
          </label>
          <select
            id="default-currency-select"
            className={styles.formSelect}
            value={config.currency.defaultCurrency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
          >
            <option value="" disabled className={styles.selectPlaceholder}>
              e.g USD
            </option>
            {CURRENCY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.actionRow}>
          <button
            type="button"
            className={styles.submitBtn}
            disabled={!currencyDirty || savingSection === "currency"}
            onClick={handleUpdateCurrency}
            id="update-default-currency-btn"
          >
            {savingSection === "currency" ? "Saving..." : "Update Default Currency"}
          </button>
        </div>
      </section>

      {/* ─── 2. Payment Methods Section ─── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.title}>Payment Methods</h2>
          <p className={styles.subtitle}>
            Configure the payment methods available for bookings, withdrawals, and platform transactions.
          </p>
        </div>

        <div className={styles.formRow}>
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxItem}>
              <span>Wallet</span>
              <input
                type="checkbox"
                id="payment-method-wallet"
                className={styles.checkboxInput}
                checked={config.paymentMethods.wallet}
                onChange={() => handlePaymentMethodToggle("wallet")}
              />
            </label>

            <label className={styles.checkboxItem}>
              <span>Card</span>
              <input
                type="checkbox"
                id="payment-method-card"
                className={styles.checkboxInput}
                checked={config.paymentMethods.card}
                onChange={() => handlePaymentMethodToggle("card")}
              />
            </label>

            <label className={styles.checkboxItem}>
              <span>Bank Transfers</span>
              <input
                type="checkbox"
                id="payment-method-bank-transfers"
                className={styles.checkboxInput}
                checked={config.paymentMethods.bankTransfers}
                onChange={() => handlePaymentMethodToggle("bankTransfers")}
              />
            </label>

            <label className={styles.checkboxItem}>
              <span>Cash</span>
              <input
                type="checkbox"
                id="payment-method-cash"
                className={styles.checkboxInput}
                checked={config.paymentMethods.cash}
                onChange={() => handlePaymentMethodToggle("cash")}
              />
            </label>
          </div>
        </div>

        <div className={styles.actionRow}>
          <button
            type="button"
            className={styles.submitBtn}
            disabled={!paymentMethodsDirty || savingSection === "payment-methods"}
            onClick={handleUpdatePaymentMethods}
            id="update-payment-methods-btn"
          >
            {savingSection === "payment-methods" ? "Saving..." : "Update Payment Method"}
          </button>
        </div>
      </section>

      {/* ─── 3. Refund Policy Section ─── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.title}>Refund Policy</h2>
          <p className={styles.subtitle}>
            Configure refund eligibility, processing rules, and refund approval policies.
          </p>
        </div>

        <div className={styles.formRow}>
          <label className={styles.formLabel} htmlFor="auto-refund-window-select">
            Auto Refund Window
          </label>
          <select
            id="auto-refund-window-select"
            className={styles.formSelect}
            value={config.refundPolicy.autoRefundWindow}
            onChange={(e) => handleRefundFieldChange("autoRefundWindow", e.target.value)}
          >
            <option value="" disabled className={styles.selectPlaceholder}>
              e.g 1 Hour
            </option>
            {REFUND_WINDOW_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formRow}>
          <label className={styles.formLabel} htmlFor="refund-types-select">
            Refund Types
          </label>
          <select
            id="refund-types-select"
            className={styles.formSelect}
            value={config.refundPolicy.refundTypes}
            onChange={(e) => handleRefundFieldChange("refundTypes", e.target.value)}
          >
            <option value="" disabled className={styles.selectPlaceholder}>
              e.g Partial
            </option>
            {REFUND_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.actionRow}>
          <button
            type="button"
            className={styles.submitBtn}
            disabled={!refundPolicyDirty || savingSection === "refund-policy"}
            onClick={handleUpdateRefundPolicy}
            id="update-refund-policy-btn"
          >
            {savingSection === "refund-policy" ? "Saving..." : "Update Refund Policy"}
          </button>
        </div>
      </section>

      {/* ─── Success Toast ─── */}
      {toastMessage && <div className={styles.successToast}>{toastMessage}</div>}
    </div>
  );
}
