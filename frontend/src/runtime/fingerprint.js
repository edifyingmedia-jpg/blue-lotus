/**
 * fingerprint.js
 * ----------------------------------------------------
 * Generates a lightweight, deterministic fingerprint
 * for the current browser/device.
 *
 * Used for:
 * - anonymous analytics
 * - rate limiting
 * - preventing duplicate sessions
 * - identifying preview sessions
 *
 * No PII. No tracking. No cookies.
 */

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32‑bit integer
  }
  return Math.abs(hash).toString();
}

export default function getFingerprint() {
  const data = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  ].join("|");

  return hashString(data);
}
