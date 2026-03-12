// frontend/src/runtime/components/Grid.js

import React from "react";

/**
 * Blue Lotus Cinematic Grid
 * - Responsive auto-fit columns
 * - Smooth layout transitions
 * - Gap + padding support
 * - Tri‑Neon friendly (glow optional)
 * - Works with any children
 */

export default function Grid({
  minWidth = 140,      // minimum width per item before wrapping
  gap = 16,
  padding = 0,
  glow = false,
  intensity = 0.4,
  style = {},
  children,
  ...props
}) {
  const glowStyle = glow
    ? {
        boxShadow: `
          0 0 ${2 * intensity}px rgba(0, 255, 255, 0.6),
          0 0 ${4 * intensity}px rgba(180, 0, 255, 0.5),
          0 0 ${6 * intensity}px rgba(255, 0, 180, 0.4)
        `,
      }
    : {};

  const baseStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}px, 1fr))`,
    gap,
    padding,
    width: "100%",
    transition: "all 0.25s ease",
    ...glowStyle,
    ...style,
  };

  return (
    <div style={baseStyle} {...props}>
      {children}
    </div>
  );
}
