// frontend/src/runtime/utils/validateType.js

/**
 * validateType
 * ---------------------------------------------------------
 * Ensures a value matches one of the expected types.
 * Example:
 *   validateType("hello", ["string"]) → true
 *   validateType(42, ["string", "number"]) → true
 *   validateType({}, ["string"]) → false
 */

export default function validateType(value, expectedTypes = []) {
  if (!Array.isArray(expectedTypes) || expectedTypes.length === 0) {
    return true; // No type requirement
  }

  const actual = Array.isArray(value) ? "array" : typeof value;

  return expectedTypes.includes(actual);
}
