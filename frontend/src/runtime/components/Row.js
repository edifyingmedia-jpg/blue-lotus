// frontend/src/runtime/components/Row.js

import React from "react";

/**
 * Blue Lotus Cinematic Row
 * - Smooth horizontal layout
 * - Gap + padding support
 * - Optional wrapping
 * - Optional Tri‑Neon glow
 * - Smooth transitions
 * - Emergent‑style adaptive behavior
 */

export default function Row({
  gap = 12,
  padding = 0,
  align = "center",      // "start" | "center" | "end"
  justify = "flex-start", // "flex-start" | "center" | "flex-end" | "space-between"
  wrap = false,
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
    display: "flex",
    flexDirection: "row",
    alignItems: align,
    justifyContent: justify,
    gap,
    padding,
    width: "100%",
    flexWrap: wrap ? "wrap" : "nowrap",
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
