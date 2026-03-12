// frontend/src/runtime/components/Image.js

import React from "react";
import useActionHandler from "../engine/useActionHandler";
import { theme } from "../../theme";

/**
 * Blue Lotus Tri‑Neon Image Component
 * - Supports click actions
 * - Cinematic neon glow
 * - Radius, fit modes, full styling
 */

export default function Image({
  src,
  alt = "",
  action = null,
  width = "100%",
  height = "auto",
  radius = 8,
  fit = "cover",
  glow = true,
  intensity = 0.55,
  style = {},
  ...props
}) {
  const handleAction = useActionHandler(action);

  const glowStyle = glow
    ? {
        boxShadow: `
          0 0 ${2 * intensity}px ${theme.colors.primary},
          0 0 ${4 * intensity}px ${theme.colors.primary},
          0 0 ${6 * intensity}px ${theme.colors.primary}
        `,
      }
    : {};

  const combinedStyle = {
    width,
    height,
    borderRadius: radius,
    objectFit: fit,
    cursor: action ? "pointer" : "default",
    display: "block",
    transition: "all 0.18s ease-out",
    ...glowStyle,
    ...style,
  };

  return (
    <img
      src={src}
      alt={alt}
      style={combinedStyle}
      onClick={action ? handleAction : undefined}
      {...props}
    />
  );
}
