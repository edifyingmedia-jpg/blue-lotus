// frontend/src/runtime/utils/mergeDeep.js

/**
 * mergeDeep
 * ---------------------------------------------------------
 * Recursively merges two objects without mutating either.
 * Used for state updates, screen definitions, and config merging.
 */

export default function mergeDeep(target = {}, source = {}) {
  const output = { ...target };

  for (const key in source) {
    const value = source[key];

    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      typeof output[key] === "object" &&
      !Array.isArray(output[key])
    ) {
      output[key] = mergeDeep(output[key], value);
    } else {
      output[key] = value;
    }
  }

  return output;
}
