/**
 * safeGet.js
 * ----------------------------------------------------
 * Safely retrieves a nested value from an object using
 * a dot‑separated path. Returns undefined if any part
 * of the path is missing.
 *
 * Examples:
 *   safeGet(obj, "user.profile.name")
 *   safeGet(obj, "settings.theme.colors.primary")
 */

export default function safeGet(obj, path) {
  if (!obj || !path || typeof path !== "string") return undefined;

  const parts = path.split(".");
  let current = obj;

  for (const part of parts) {
    if (
      current &&
      typeof current === "object" &&
      Object.prototype.hasOwnProperty.call(current, part)
    ) {
      current = current[part];
    } else {
      return undefined;
    }
  }

  return current;
}
