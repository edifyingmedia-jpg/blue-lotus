// frontend/src/runtime/components/Button.js

import React, { useState } from "react";
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
  const [pressed, setPressed] = useState(false);

  // Size presets
  const sizeMap = {
    small: { padding: "8px 14px", fontSize: 14 },
    medium: { padding: "12px 20px", fontSize: 16 },
    large: { padding: "16px 26px", fontSize: 18 },
  };

  const neonColor = color;

  const glowStyle =
    glow && !pressed
      ? {
          boxShadow: `
            0 0 ${2 * intensity}px ${neonColor},
            0 0 ${4 * intensity}px ${neonColor},
            0 0 ${6 * intensity}px ${neonColor}
          `,
        }
      : {};

  return (
    <button
      onClick={() => {
        setPressed(true);
        setTimeout(() => setPressed(false), 120);
        handleAction();
      }}
      style={{
        background,
        color,
        padding: sizeMap[size].padding,
        borderRadius: radius,
        border: "none",
        fontSize: sizeMap[size].fontSize,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        transform: pressed ? "scale(0.96)" : "scale(1)",
        transition: "all 0.2s ease",
        ...glowStyle,
        ...style,
      }}
      {...props}
    >
      {icon && <Icon name={icon} size={sizeMap[size].fontSize + 2} />}
      {label && <Text>{label}</Text>}
    </button>
  );
}
