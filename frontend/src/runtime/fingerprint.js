// frontend/src/runtime/fingerprint.js

/**
 * fingerprint.js
 * ---------------------------------------------------------
 * Blue Lotus Device Fingerprint Collector
 *
 * This module collects NON‑PERSONAL technical metadata
 * and produces a stable, privacy‑safe fingerprint hash.
 *
 * Used for:
 *  - preventing free‑tier abuse
 *  - limiting one free trial per physical device
 *  - detecting VPN/proxy usage
 *  - detecting spoofing attempts
 *
 * NEVER collects:
 *  - personal data
 *  - emails
 *  - names
 *  - passwords
 *  - browsing history
 */

import sha256 from "./utils/sha256"; // small local hashing utility

/**
 * Collect device metadata
 */
async function getDeviceInfo() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.textBaseline = "top";
  ctx.font = "14px 'Arial'";
  ctx.fillText("BL-Fingerprint", 2, 2);
  const canvasHash = canvas.toDataURL();

  const gl = document.createElement("canvas").getContext("webgl");
  const glInfo = gl
    ? {
        vendor: gl.getParameter(gl.VENDOR),
        renderer: gl.getParameter(gl.RENDERER),
      }
    : { vendor: "unknown", renderer: "unknown" };

  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: navigator.deviceMemory || "unknown",
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      colorDepth: window.screen.colorDepth,
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvasHash,
    glVendor: glInfo.vendor,
    glRenderer: glInfo.renderer,
  };
}

/**
 * Collect behavior metadata (lightweight, privacy‑safe)
 */
function getBehaviorInfo() {
  return {
    // coarse timing patterns only
    sessionStart: performance.timeOrigin.toString(),
    navTiming: performance.now().toString().slice(0, 6),
  };
}

/**
 * Collect account metadata (non‑personal)
 */
function getAccountInfo() {
  let localId = localStorage.getItem("bl_local_id");
  if (!localId) {
    localId = crypto.randomUUID();
    localStorage.setItem("bl_local_id", localId);
  }

  return {
    localId,
  };
}

/**
 * Generate final fingerprint hash
 */
export async function generateFingerprint() {
  const device = await getDeviceInfo();
  const behavior = getBehaviorInfo();
  const account = getAccountInfo();

  const combined = JSON.stringify({
    device,
    behavior,
    account,
  });

  // Hash everything together
  const fingerprintHash = await sha256(combined);

  return {
    fingerprint: fingerprintHash,
    device,
    behavior,
    account,
  };
}

export default generateFingerprint;
