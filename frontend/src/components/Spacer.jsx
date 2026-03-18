// frontend/src/components/Spacer.jsx

import React from "react";

/**
 * Spacer
 * ---------------------------------------------------------
 * Cinematic spacing primitive for Blue Lotus.
 * Supports size presets, horizontal/vertical mode,
 * glow accents, opacity, and JSON-friendly props.
 */

const PRESETS = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
};

const GLOW = {
  none: {},
  cyan: { boxShadow: "0 0 8px rgba(0, 255, 255, 0.35)" },
  purple: { boxShadow: "0 0 8px rgba(128, 0, 255, 0.35)" },
  pink: { boxShadow: "0 0 8px rgba(255, 0, 128, 0.35)" },
};

const Spacer = ({
  size = "1rem",          // can be preset or raw value
  horizontal = false,
  opacity = 1,
  glow = "none",          // none | cyan | purple | pink
  min = null,
  max = null,
  animated = false,
  style = {},
  ...rest
}) => {
  const resolvedSize = PRESETS[size] || size;

  return (
    <div
      style={{
        display: horizontal ? "inline-block" : "block",
        width: horizontal ? resolvedSize : "100%",
        height: horizontal ? "100%" : resolvedSize,
        opacity,
        minHeight: min,
        maxHeight: max,
        ...(animated && {
          animation: "pulseSpace 2.5s ease-in-out infinite",
        }),
        ...GLOW[glow],
        transition: "all 0.25s ease",
        ...style,
      }}
      {...rest}
    />
  );
};

export default Spacer;
