// frontend/src/runtime/components/Input.js

import React from "react";
import useActionHandler from "../engine/useActionHandler";
import { theme } from "../../theme";

/**
 * Blue Lotus Tri‑Neon Input Component
 * - Cinematic neon glow
 * - Supports change + submit actions
 * - Works with your Action Engine
 */

export default function Input({
  value = "",
  placeholder = "",
  action = null,
  onChangeAction = null,
  color = theme.colors.white,
  background = theme.colors.black,
  radius = 8,
  padding = 10,
  glow = true,
  intensity = 0.55,
  style = {},
  ...props
}) {
  const handleSubmit = useActionHandler(action);
  const handleChange = useActionHandler(onChangeAction);

  const neonColor = color;

  const glowStyle = glow
    ? {
        boxShadow: `
          0 0 ${2 * intensity}px ${neonColor},
          0 0 ${4 * intensity}px ${neonColor},
          0 0 ${6 * intensity}px ${neonColor}
        `,
      }
    : {};

  const combinedStyle = {
    width: "100%",
    padding,
    borderRadius: radius,
    background,
    color,
    border: `1px solid ${theme.colors.primary}`,
    outline: "none",
    transition: "all 0.18s ease-out",
    ...glowStyle,
    ...style,
  };

  return (
    <input
      value={value}
      placeholder={placeholder}
      style={combinedStyle}
      onChange={(e) => onChangeAction && handleChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && action) handleSubmit();
      }}
      {...props}
    />
  );
}
