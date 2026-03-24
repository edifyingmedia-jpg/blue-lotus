/**
 * mergeDeep.js
 * ----------------------------------------------------
 * Deterministic deep merge utility.
 *
 * This is similar to deepMerge, but used in places where
 * the runtime expects a more permissive merge:
 *
 * - Plain objects are merged recursively
 * - Arrays are merged index-by-index
 * - Primitives overwrite
 *
 * This is used by parts of the runtime that need
 * structural merging rather than replacement merging.
 */

import isObject from "./isObject";
import deepClone from "./deepClone";

export default function mergeDeep(target, source) {
  if (!isObject(target) || !isObject(source)) {
    return deepClone(source);
  }

  const result = deepClone(target);

  for (const key of Object.keys(source)) {
    const value = source[key];

    // Merge nested objects
    if (isObject(value) && isObject(result[key])) {
      result[key] = mergeDeep(result[key], value);
      continue;
    }

    // Arrays: merge index-by-index
    if (Array.isArray(value) && Array.isArray(result[key])) {
      const merged = [];
      const max = Math.max(result[key].length, value.length);

      for (let i = 0; i < max; i++) {
        if (i in value && i in result[key]) {
          merged[i] = mergeDeep(result[key][i], value[i]);
        } else if (i in value) {
          merged[i] = deepClone(value[i]);
        } else {
          merged[i] = deepClone(result[key][i]);
        }
      }

      result[key] = merged;
      continue;
    }

    // Everything else: overwrite
    result[key] = deepClone(value);
  }

  return result;
}
