/**
 * Reducer.js
 * ----------------------------------------------------
 * A minimal reducer utility for transforming values.
 *
 * This is intentionally simple because your runtime
 * does NOT use Redux-style reducers. Instead, this
 * reducer is used by:
 *
 * - StateLoader
 * - ActionEngine (for certain transform actions)
 * - RuntimeEngine (when applying computed values)
 */

export default function Reducer(currentValue, update) {
  // If update is a function, call it with the current value
  if (typeof update === "function") {
    return update(currentValue);
  }

  // If update is a primitive or object, replace the value
  return update;
}
