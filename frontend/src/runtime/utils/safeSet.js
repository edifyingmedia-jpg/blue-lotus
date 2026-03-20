// frontend/src/runtime/utils/safeSet.js

/**
 * safeSet
 * ---------------------------------------------------------
 * Safely sets a nested value inside an object using a path.
 * Example: safeSet(obj, "user.profile.name", "Tiffany")
 * Creates intermediate objects as needed.
 */

export default function safeSet(obj, path, value) {
  if (!obj || typeof path !== "string") return obj;

  const keys = path.split(".");
  let current = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    // Last key: assign the value
    if (i === keys.length - 1) {
      current[key] = value;
      return obj;
    }

    // Create intermediate objects if missing or invalid
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
