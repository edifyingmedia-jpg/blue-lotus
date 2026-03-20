// frontend/src/runtime/utils/isObject.js

/**
 * isObject
 * ---------------------------------------------------------
 * Safely checks whether a value is a non-null object.
 * Used throughout the runtime to avoid edge-case crashes.
 */

export default function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
