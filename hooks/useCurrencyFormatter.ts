import { useCallback, useEffect, useState } from "react";

interface FormatCurrencyOptions {
  currency?: string;
  maximumFractionDigits?: number;
  compact?: boolean;
}

export function useCurrencyFormatter() {
  const [userCurrency, setUserCurrency] = useState<string>("USD");

  useEffect(() => {
    // Attempt to fetch the user's currency based on their IP
    const fetchCurrency = async () => {
      try {
        const storedCurrency = localStorage.getItem("user_currency");
        if (storedCurrency) {
          setUserCurrency(storedCurrency);
          return;
        }

        const response = await fetch("https://ipapi.co/currency/");
        if (response.ok) {
          const currency = await response.text();
          if (currency) {
            setUserCurrency(currency.trim());
            localStorage.setItem("user_currency", currency.trim());
          }
        }
      } catch (error) {
        console.error("Failed to fetch currency from ipapi:", error);
      }
    };

    fetchCurrency();
  }, []);

  const formatCurrency = useCallback(
    (value: number, options: FormatCurrencyOptions = {}) => {
      const {
        currency = userCurrency,
        maximumFractionDigits = 0,
        compact = false,
      } = options;

      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        maximumFractionDigits,
        notation: compact ? "compact" : "standard",
        compactDisplay: "short",
      }).format(value);
    },
    [userCurrency]
  );

  return formatCurrency;
}
