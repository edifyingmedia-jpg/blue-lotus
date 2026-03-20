// frontend/src/runtime/utils/deepClone.js

/**
 * deepClone
 * ---------------------------------------------------------
 * A safe, predictable deep clone utility for runtime objects.
 * Handles arrays, objects, primitives, and nested structures.
 */

export default function deepClone(value) {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(item => deepClone(item));
  }

  const result = {};
  for (const key in value) {
    result[key] = deepClone(value[key]);
  }
  return result;
}
