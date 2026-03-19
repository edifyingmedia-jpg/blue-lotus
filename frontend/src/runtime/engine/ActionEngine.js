// frontend/src/runtime/engine/ActionEngine.js

/**
 * ActionEngine
 * ---------------------------------------------------------
 * Central dispatcher for high-level actions.
 * - Normalizes action objects
 * - Ensures every action has a type
 * - Forwards actions into the reducer pipeline
 */

export default function ActionEngine(dispatch) {
  function run(action, value) {
    if (!action) return;

    // Normalize string actions: "SAVE" → { type: "SAVE" }
    const normalized =
      typeof action === "string"
        ? { type: action, value }
        : { ...action, value };

    if (!normalized.type) {
      console.warn("ActionEngine: Missing action.type", normalized);
      return;
    }

    dispatch(normalized);
  }

  return { run };
}
