// frontend/src/runtime/utils/generateId.js

/**
 * generateId
 * ---------------------------------------------------------
 * Creates a short, unique, runtime‑safe ID.
 * Used for components, screens, actions, and internal events.
 */

export default function generateId(prefix = "id") {
  const random = Math.random().toString(36).substring(2, 8);
  const timestamp = Date.now().toString(36);
  return `${prefix}_${timestamp}_${random}`;
}
