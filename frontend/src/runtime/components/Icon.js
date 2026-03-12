// frontend/src/runtime/components/Icon.js

import React from "react";
import useActionHandler from "../engine/useActionHandler";
import { theme } from "../../theme";

/**
 * Blue Lotus Tri‑Neon Icon Component
 * - Cinematic neon glow
 * - Dynamic color modes
 * - Supports click actions
 * - Stable + production‑ready
 */

export default function Icon({
  name,
  size = 22,
  color = theme.colors.white,
  glow = true,
  intensity = 0.65,
  action = null,
  style = {},
  ...props
}) {
  const handleAction = useActionHandler(action);

  // Neon glow logic
  const neonColor = color;
  const glowStyle = glow
    ? {
        textShadow: `
          0 0 ${2 * intensity}px ${neonColor},
          0 0 ${4 * intensity}px ${neonColor},
          0 0 ${6 * intensity}px ${neonColor},
          0 0 ${8 * intensity}px ${neonColor}
        `,
      }
    : {};

  const combinedStyle = {
    fontSize: size,
    color: neonColor,
    cursor: action ? "pointer" : "default",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.18s ease-out",
    ...glowStyle,
    ...style,
  };

  return (
    <i
      className={`icon-${name}`}
      style={combinedStyle}
      onClick={handleAction}
      {...props}
    />
  );
}
