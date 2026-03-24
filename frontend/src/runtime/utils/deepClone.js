/**
 * deepClone.js
 * ----------------------------------------------------
 * Deterministic deep clone utility used throughout the
 * runtime. This implementation:
 *
 * - Handles arrays, objects, dates, maps, sets
 * - Avoids JSON stringify limitations
 * - Prevents circular reference crashes
 * - Produces stable, predictable clones
 */

export default function deepClone(value, seen = new WeakMap()) {
  // Primitive values are returned as-is
  if (value === null || typeof value !== "object") {
    return value;
  }

  // Handle circular references
  if (seen.has(value)) {
    return seen.get(value);
  }

  // Date
  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  // Array
  if (Array.isArray(value)) {
    const arr = [];
    seen.set(value, arr);
    for (const item of value) {
      arr.push(deepClone(item, seen));
    }
    return arr;
  }

  // Map
  if (value instanceof Map) {
    const map = new Map();
    seen.set(value, map);
    for (const [key, val] of value.entries()) {
      map.set(key, deepClone(val, seen));
    }
    return map;
  }

  // Set
  if (value instanceof Set) {
    const set = new Set();
    seen.set(value, set);
    for (const item of value.values()) {
      set.add(deepClone(item, seen));
    }
    return set;
  }

  // Plain object
  const cloned = {};
  seen.set(value, cloned);

  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      cloned[key] = deepClone(value[key], seen);
    }
  }

  return cloned;
}
