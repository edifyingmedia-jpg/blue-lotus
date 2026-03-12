// frontend/src/runtime/components/Text.js

import React from "react";
import useActionHandler from "../engine/useActionHandler";
import { theme } from "../../theme";

/**
 * Blue Lotus Tri‑Neon Text Component
 * - Cinematic neon glow
 * - Supports size, weight, color
 * - Supports click actions
 */

export default function Text({
  text,
  children,
  action = null,
  size = 16,
  weight = "normal",
  color = theme.colors.white,
  glow = true,
  intensity = 0.55,
  style = {},
  ...props
}) {
  const handleAction = useActionHandler(action);

  // Neon glow logic
  const neonColor = color;
  const glowStyle = glow
    ? {
        textShadow: `
          0 0 ${1 * intensity}px ${neonColor},
          0 0 ${2 * intensity}px ${neonColor},
          0 0 ${3 * intensity}px ${neonColor},
          0 0 ${4 * intensity}px ${neonColor}
        `,
      }
    : {};

  const combinedStyle = {
    fontSize: size,
    fontWeight: weight,
    color: neonColor,
    cursor: action ? "pointer" : "default",
    display: "inline-block",
    transition: "all 0.18s ease-out",
    ...glowStyle,
    ...style,
  };

  return (
    <span
      style={combinedStyle}
      onClick={action ? handleAction : undefined}
      {...props}
    >
      {text || children}
    </span>
  );
}
