/**
 * deepClone.js
 * ----------------------------------------------------
 * Deterministic deep clone for plain objects and arrays.
 * Does NOT attempt to clone functions, classes, Dates,
 * Maps, Sets, or other complex types — because your
 * runtime never uses them in app definitions or state.
 */

export default function deepClone(value) {
  if (value === null || value === undefined) return value;

  // Primitive values return as-is
  if (typeof value !== "object") return value;

  // Arrays
  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item));
  }

  // Plain objects
  const result = {};
  for (const key of Object.keys(value)) {
    result[key] = deepClone(value[key]);
  }

  return result;
}
