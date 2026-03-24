/**
 * deepMerge.js
 * ----------------------------------------------------
 * Deterministic deep merge utility used throughout the
 * runtime. This implementation:
 *
 * - Merges plain objects and arrays
 * - Does NOT mutate the source or target
 * - Preserves Dates, Maps, Sets
 * - Uses deepClone for safe copying
 */

import deepClone from "./deepClone";

export default function deepMerge(target, source) {
  // If either is not an object, return source
  if (!isObject(target) || !isObject(source)) {
    return deepClone(source);
  }

  const result = deepClone(target);

  for (const key of Object.keys(source)) {
    const value = source[key];

    // Merge nested objects
    if (isObject(value) && isObject(result[key])) {
      result[key] = deepMerge(result[key], value);
      continue;
    }

    // Arrays: replace entirely (deterministic)
    if (Array.isArray(value)) {
      result[key] = deepClone(value);
      continue;
    }

    // Maps: replace entirely
    if (value instanceof Map) {
      result[key] = deepClone(value);
      continue;
    }

    // Sets: replace entirely
    if (value instanceof Set) {
      result[key] = deepClone(value);
      continue;
    }

    // Dates: replace entirely
    if (value instanceof Date) {
      result[key] = new Date(value.getTime());
      continue;
    }

    // Primitive values
    result[key] = deepClone(value);
  }

  return result;
}

function isObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}
