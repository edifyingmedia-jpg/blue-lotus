/**
 * isObject.js
 * ----------------------------------------------------
 * Determines whether a value is a plain object.
 *
 * This utility is used throughout the runtime to ensure
 * deepMerge, deepClone, and other helpers behave
 * deterministically and avoid treating arrays, dates,
 * maps, sets, or null as objects.
 */

export default function isObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}
