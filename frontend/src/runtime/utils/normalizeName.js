// frontend/src/runtime/utils/normalizeName.js

/**
 * normalizeName
 * ---------------------------------------------------------
 * Converts a string into a safe, predictable identifier.
 * Used for component names, screen names, and action keys.
 */

export default function normalizeName(value = "") {
  return String(value)
    .trim()
    .replace(/\s+/g, "_")        // Replace spaces with underscores
    .replace(/[^a-zA-Z0-9_]/g, "") // Remove invalid characters
    .toLowerCase();
}
