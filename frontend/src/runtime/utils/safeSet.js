/**
 * safeSet.js
 * ----------------------------------------------------
 * Safely sets a nested value on an object using a
 * dot‑separated path. Creates intermediate objects
 * as needed. Never throws.
 *
 * Examples:
 *   safeSet(obj, "user.profile.name", "Tiffany")
 *   safeSet(obj, "settings.theme.colors.primary", "#000")
 */

export default function safeSet(obj, path, value) {
  if (!obj || !path || typeof path !== "string") return obj;

  const parts = path.split(".");
  let current = obj;

  for (let i = 0; i < parts.length; i++) {
    const key = parts[i];

    // Last key → assign value
    if (i === parts.length - 1) {
      current[key] = value;
      return obj;
    }

    // Create intermediate objects if missing
    if (
      !current[key] ||
      typeof current[key] !== "object" ||
      Array.isArray(current[key])
    ) {
      current[key] = {};
    }

    current = current[key];
  }

  return obj;
}
