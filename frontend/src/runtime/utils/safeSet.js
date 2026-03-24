/**
 * safeSet.js
 * ----------------------------------------------------
 * Safely set a nested value using dot-path notation.
 *
 * Example:
 *   const obj = {};
 *   safeSet(obj, "user.profile.name", "Tiffany");
 *   → obj = { user: { profile: { name: "Tiffany" } } }
 */

export default function safeSet(obj, path, value) {
  if (!obj || typeof obj !== "object") {
    throw new Error("safeSet requires a target object");
  }
  if (!path || typeof path !== "string") {
    throw new Error("safeSet requires a string path");
  }

  const parts = path.split(".");
  let current = obj;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    // If we're at the last segment, assign the value
    if (i === parts.length - 1) {
      current[part] = value;
      return;
    }

    // If the next segment doesn't exist, create it
    if (
      current[part] === undefined ||
      current[part] === null ||
      typeof current[part] !== "object"
    ) {
      current[part] = {};
    }

    current = current[part];
  }
}
