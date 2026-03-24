/**
 * normalizeName.js
 * ----------------------------------------------------
 * Normalizes strings into safe, deterministic names
 * used throughout the runtime for:
 * - component names
 * - state keys
 * - navigation identifiers
 * - schema fields
 *
 * Rules:
 * - Trim whitespace
 * - Convert to lowercase
 * - Replace spaces and invalid characters with "-"
 * - Collapse multiple separators
 * - Remove leading/trailing separators
 */

export default function normalizeName(value) {
  if (!value || typeof value !== "string") return "";

  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")   // replace invalid chars with "-"
    .replace(/-+/g, "-")           // collapse multiple dashes
    .replace(/^-|-$/g, "");        // trim leading/trailing dashes
}
