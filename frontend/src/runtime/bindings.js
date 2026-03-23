// frontend/src/runtime/bindings.js

/**
 * bindings.js
 * ---------------------------------------------------------
 * Centralized binding resolver for the Blue Lotus runtime.
 *
 * Responsibilities:
 *  - Resolve {{state.foo}} bindings
 *  - Resolve {{bindings.x.y}} dynamic data bindings
 *  - Resolve {{actions.result}} action outputs
 *  - Provide safe fallbacks for missing values
 *
 * This module is used by:
 *  - DynamicScreen
 *  - useRuntimeDataBindings
 *  - ActionDispatcher
 */

export function resolveBinding(path, { state, bindings, actions }) {
  if (!path || typeof path !== "string") {
    return undefined;
  }

  // Remove {{ }} if present
  const clean = path.replace(/^\{\{|\}\}$/g, "").trim();

  // Determine binding root
  if (clean.startsWith("state.")) {
    return getDeepValue(state, clean.replace("state.", ""));
  }

  if (clean.startsWith("bindings.")) {
    return getDeepValue(bindings, clean.replace("bindings.", ""));
  }

  if (clean.startsWith("actions.")) {
    return getDeepValue(actions, clean.replace("actions.", ""));
  }

  // Literal fallback
  return clean;
}

/**
 * Resolve all bindings inside a props object.
 */
export function resolveProps(props, context) {
  if (!props || typeof props !== "object") return props;

  const resolved = {};

  for (const key of Object.keys(props)) {
    const value = props[key];

    if (typeof value === "string" && value.includes("{{")) {
      resolved[key] = resolveBinding(value, context);
    } else if (typeof value === "object" && value !== null) {
      resolved[key] = resolveProps(value, context);
    } else {
      resolved[key] = value;
    }
  }

  return resolved;
}

/**
 * Safely walk nested objects.
 */
function getDeepValue(obj, path) {
  if (!obj) return undefined;

  return path.split(".").reduce((acc, key) => {
    if (acc && Object.prototype.hasOwnProperty.call(acc, key)) {
      return acc[key];
    }
    return undefined;
  }, obj);
}
