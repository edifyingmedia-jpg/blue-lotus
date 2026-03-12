// frontend/src/runtime/components/Button.js

import React from "react";
import useActionHandler from "../engine/useActionHandler";
import { theme } from "../../theme";
import Icon from "./Icon";
import Text from "./Text";

/**
 * Blue Lotus Tri‑Neon Button Component
 * - Supports Text, Icon, or Icon + Text
 * - Cinematic neon glow
 * - Press animation
 * - Action Engine integration
 */

export default function Button({
  label = "",
  icon = null,
  action = null,
  size = "medium",
  color = theme.colors.white,
  background = theme.colors.black,
  radius = 10,
  glow = true,
  intensity = 0.65,
  style = {},
  ...props
}) {
  const handleAction = useActionHandler(action);

  // Size presets
  const sizeMap = {
    small: { padding: "8px 14px", fontSize: 14 },
    medium: { padding: "12px 20px", fontSize: 16 },
    large: { padding: "16px 26px", fontSize: 18 },
  };

  const { padding, fontSize } = sizeMap[size] || sizeMap.medium;

  // Neon glow logic
  const neonColor = color;
  const glowStyle = glow
    ? {
        boxShadow: `
          0 0 ${2 * intensity}px ${neonColor},
          0 0 ${4 * intensity}px ${neonColor},
          0 0 ${6 * intensity}px ${neonColor},
          inset 0 0 ${2 * intensity}px ${neonColor}
        `,
      }
    : {};

  const combinedStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding,
    borderRadius: radius,
    background,
    color: neonColor,
    border: `1px solid ${theme.colors.primary}`,
    cursor: action ? "pointer" : "default",
    transition: "all 0.18s ease-out",
    fontSize,
    userSelect: "none",
    ...glowStyle,
    ...style,
  };

  return (
    <button
      style={combinedStyle}
      onClick={action ? handleAction : undefined}
      {...props}
    >
      {icon && <Icon name={icon} size={fontSize + 2} color={color} glow={glow} />}
      {label && <Text text={label} size={fontSize} color={color} glow={glow} />}
    </button>
  );
}
