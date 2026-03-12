import React from "react";
import useActionHandler from "../engine/useActionHandler";
import { theme } from "../../theme";

/**
 * Blue Lotus Text Component
 * - Supports click actions
 * - Supports size, weight, color
 * - Works with your Action Engine
 */

export default function Text({
  text,
  children,
  action = null,
  size = 16,
  weight = "normal",
  color = theme.colors.white,
  style = {},
  ...props
}) {
  const handleAction = useActionHandler(action);

  const combinedStyle = {
    fontSize: size,
    fontWeight: weight,
    color,
    cursor: action ? "pointer" : "default",
    display: "inline-block",
    ...style,
  };

  return (
    <span
      style={combinedStyle}
      onClick={() => action && handleAction()}
      {...props}
    >
      {text || children}
    </span>
  );
}
