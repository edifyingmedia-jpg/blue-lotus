// frontend/src/runtime/editor/TWIN/TWINLotus.jsx
// Pure visual lotus avatar for TWIN — controlled entirely by TWINManager

import React, { forwardRef } from "react";
import "./twinAnimations.css";

/**
 * Props:
 * - animationTier: 0 | 1 | 2 | 3
 * - isBlooming: boolean
 *
 * Tiers:
 * 0 = idle micro‑pulse
 * 1 = pulse
 * 2 = mini‑expand
 * 3 = full bloom (requires isBlooming = true)
 */

const TWINLotus = forwardRef(({ animationTier = 0, isBlooming = false }, ref) => {
  let animationClass = "";

  if (animationTier === 1) animationClass = "lotus-pulse";
  if (animationTier === 2) animationClass = "lotus-mini-expand";
  if (animationTier === 3 && isBlooming) animationClass = "lotus-bloom";

  return (
    <div
      ref={ref}
      className={`twin-lotus ${animationClass}`}
      style={{
        width: "64px",
        height: "64px",
        borderRadius: "50%",
        background: "radial-gradient(circle, #00eaff, #7b2bff, #ff2bc8)",
        boxShadow: "0 0 18px rgba(0,255,255,0.6)",
        transition: "transform 0.25s ease, opacity 0.25s ease",
        pointerEvents: "none" // never blocks the editor
      }}
    />
  );
});

export default TWINLotus;
