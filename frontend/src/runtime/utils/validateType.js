/**
 * validateType.js
 * ----------------------------------------------------
 * Lightweight deterministic type validator used across
 * the runtime (StateEngine, NavigationEngine, Component
 * resolution, schema validation, etc.).
 *
 * Supports:
 * - "string"
 * - "number"
 * - "boolean"
 * - "array"
 * - "object"
 * - "function"
 * - "date"
 */

export default function validateType(value, expectedType) {
  if (!expectedType || typeof expectedType !== "string") {
    return false;
  }

  const type = expectedType.toLowerCase();

  switch (type) {
    case "string":
      return typeof value === "string";

    case "number":
      return typeof value === "number" && !isNaN(value);

    case "boolean":
      return typeof value === "boolean";

    case "array":
      return Array.isArray(value);

    case "object":
      return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
      );

    case "function":
      return typeof value === "function";

    case "date":
      return value instanceof Date && !isNaN(value.getTime());

    default:
      // Unknown type → fail safely
      return false;
  }
}
