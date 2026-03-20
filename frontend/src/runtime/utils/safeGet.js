// frontend/src/runtime/utils/safeGet.js

/**
 * safeGet
 * ---------------------------------------------------------
 * Safely retrieves a nested value from an object using a path.
 * Example: safeGet(obj, "user.profile.name")
 * Returns undefined if any part of the path is missing.
 */

export default function safeGet(obj, path, fallback = undefined) {
  if (!obj || typeof path !== "string") return fallback;

  const keys = path.split(".");
  let current = obj;

  for (const key of keys) {
    if (current && Object.prototype.hasOwnProperty.call(current, key)) {
      current = current[key];
    } else {
      return fallback;
    }
  }

  return current;
}
