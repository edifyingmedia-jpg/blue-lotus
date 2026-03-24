/**
 * safeGet.js
 * ----------------------------------------------------
 * Safely read a nested value using dot-path notation.
 *
 * Example:
 *   safeGet({ user: { name: "Tiffany" } }, "user.name")
 *   → "Tiffany"
 */

export default function safeGet(obj, path, fallback = undefined) {
  if (!obj || typeof obj !== "object") return fallback;
  if (!path || typeof path !== "string") return fallback;

  const parts = path.split(".");

  let current = obj;

  for (const part of parts) {
    if (
      current === null ||
      current === undefined ||
      typeof current !== "object" ||
      !(part in current)
    ) {
      return fallback;
    }

    current = current[part];
  }

  return current;
}
