// frontend/src/runtime/editor/TWIN/TWINLotus.jsx
// Visual lotus component controlled entirely by TWINManager

import React, { forwardRef } from "react";
import "./twinAnimations.css";

/**
 * TWINLotus
 * Pure visual component.
 * All logic (state, bloom, pulses, movement) is controlled by TWINManager.
 *
 * Props:
 * - isBlooming: boolean
 * - animationTier: 0 | 1 | 2 | 3
 * - forwardedRef: ref passed from TWINManager
 */

const TWINLotus = forwardRef(({ isBlooming, animationTier }, ref) => {
  // Determine animation class based on tier
  let animationClass = "";

  if (animationTier === 1) animationClass = "lotus-pulse";
  if (animationTier === 2) animationClass = "lotus-mini-expand";
  if (animationTier === 3 && isBlooming) animationClass = "lotus-bloom";

  return (
    <div
      ref={ref}
      className={`twin-lotus ${animationClass}`}
    />
  );
});

export default TWINLotus;
