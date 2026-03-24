/**
 * format.js
 * ----------------------------------------------------
 * Lightweight formatting utilities used throughout the
 * runtime. Deterministic, dependency-free, and safe for
 * both Preview and Runtime environments.
 *
 * Includes:
 * - formatNumber
 * - formatDate
 * - formatCurrency
 * - capitalize
 */

export function formatNumber(value, options = {}) {
  if (value === null || value === undefined || isNaN(value)) {
    return "";
  }

  const { decimals = 0 } = options;

  return Number(value).toFixed(decimals);
}

export function formatDate(value, options = {}) {
  if (!value) return "";

  try {
    const date = value instanceof Date ? value : new Date(value);

    const {
      locale = "en-US",
      includeTime = false,
    } = options;

    const dateOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    if (includeTime) {
      dateOptions.hour = "2-digit";
      dateOptions.minute = "2-digit";
    }

    return date.toLocaleString(locale, dateOptions);
  } catch {
    return "";
  }
}

export function formatCurrency(value, currency = "USD") {
  if (value === null || value === undefined || isNaN(value)) {
    return "";
  }

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value);
  } catch {
    return "";
  }
}

export function capitalize(str) {
  if (!str || typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default {
  formatNumber,
  formatDate,
  formatCurrency,
  capitalize,
};
