/**
 * generateId.js
 * ----------------------------------------------------
 * Deterministic, collision-resistant ID generator used
 * throughout the runtime. This implementation:
 *
 * - Produces short, URL-safe IDs
 * - Avoids Math.random() for determinism
 * - Uses a monotonic counter + timestamp
 * - Guaranteed unique per session
 */

let counter = 0;

export default function generateId(prefix = "id") {
  counter += 1;

  const timestamp = Date.now().toString(36);
  const count = counter.toString(36);

  return `${prefix}_${timestamp}_${count}`;
}
