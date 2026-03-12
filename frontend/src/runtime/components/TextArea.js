// frontend/src/runtime/components/TextArea.js

import React from "react";
import useActionHandler from "../engine/useActionHandler";
import { theme } from "../../theme";

/**
 * Blue Lotus Tri‑Neon TextArea Component
 * - Cinematic neon glow
 * - Multi-line input
 * - Supports change + submit actions
 */

export default function TextArea({
  value = "",
  placeholder = "",
  action = null,
  onChangeAction = null,
  color = theme.colors.white,
  background = theme.colors.black,
  radius = 8,
  padding = 10,
  rows = 4,
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
    border: `1px solid ${neonColor}`,
    background,
    color: neonColor,
    outline: "none",
    fontSize: 16,
    resize: "vertical",
    transition: "all 0.18s ease-out",
    ...glowStyle,
    ...style,
  };

  return (
    <textarea
      value={value}
      placeholder={placeholder}
      rows={rows}
      onChange={(e) => handleChange?.(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.metaKey) {
          handleSubmit?.(value);
        }
      }}
      style={combinedStyle}
      {...props}
    />
  );
}
