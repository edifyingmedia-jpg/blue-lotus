// frontend/src/runtime/components/TagList.js

import React from "react";

/**
 * Blue Lotus Cinematic TagList
 * - Adaptive wrapping
 * - Smooth transitions
 * - Gap + padding support
 * - Optional Tri‑Neon glow
 * - Custom tag renderer support
 * - Emergent‑style spacing intelligence
 */

export default function TagList({
  tags = [],
  gap = 8,
  padding = 0,
  direction = "row", // "row" or "column"
  glow = false,
  intensity = 0.4,
  renderTag, // optional custom renderer
  style = {},
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
    flexDirection: direction,
    flexWrap: "wrap",
    gap,
    padding,
    width: "100%",
    transition: "all 0.25s ease",
    ...glowStyle,
    ...style,
  };

  const defaultTagStyle = {
    padding: "6px 12px",
    borderRadius: 10,
    background: "rgba(255, 255, 255, 0.08)",
    fontSize: 13,
    color: "white",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    transition: "all 0.25s ease",
  };

  return (
    <div style={baseStyle} {...props}>
      {tags.map((tag, i) =>
        renderTag ? (
          renderTag(tag, i)
        ) : (
          <span key={i} style={defaultTagStyle}>
            {tag}
          </span>
        )
      )}
    </div>
  );
}
