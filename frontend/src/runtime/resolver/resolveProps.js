// frontend/src/runtime/resolver/resolveProps.js

/**
 * resolveProps.js
 * ---------------------------------------------------------
 * Resolves component props before rendering.
 *
 * Responsibilities:
 *  - Apply dynamic bindings
 *  - Preserve static values
 *  - Recursively resolve nested objects/arrays
 *  - Never mutate the original DocumentModel
 */

export default function resolveProps(rawProps = {}, bindings = {}) {
  // Deep clone to avoid mutating the DocumentModel
  const props = JSON.parse(JSON.stringify(rawProps));

  return walk(props, bindings);
}

/**
 * Recursively walk props and resolve:
 *  - binding references: { bind: "user.name" }
 *  - nested objects
 *  - arrays
 */
function walk(value, bindings) {
  if (value === null || value === undefined) return value;

  // Binding reference: { bind: "path.to.value" }
  if (isBindingObject(value)) {
    return resolveBinding(value.bind, bindings);
  }

  // Array → resolve each element
  if (Array.isArray(value)) {
    return value.map((item) => walk(item, bindings));
  }

  // Object → resolve each key
  if (typeof value === "object") {
    const output = {};
    for (const key of Object.keys(value)) {
      output[key] = walk(value[key], bindings);
    }
    return output;
  }

  // Primitive → return as-is
  return value;
}

/**
 * Detects a binding object:
 * { bind: "user.name" }
 */
function isBindingObject(obj) {
  return (
    obj &&
    typeof obj === "object" &&
    Object.keys(obj).length === 1 &&
    typeof obj.bind === "string"
  );
}

/**
 * Resolve a binding path like "user.name"
 */
function resolveBinding(path, bindings) {
  if (!path || typeof path !== "string") return null;

  const parts = path.split(".");
  let current = bindings;

  for (const part of parts) {
    if (current && Object.prototype.hasOwnProperty.call(current, part)) {
      current = current[part];
    } else {
      return null; // binding not found
    }
  }

  return current;
}
