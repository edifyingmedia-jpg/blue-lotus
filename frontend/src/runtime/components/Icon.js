// frontend/src/runtime/components/Icon.js

import React from "react";
import useActionHandler from "../engine/useActionHandler";
import { theme } from "../../theme";

/**
 * Blue Lotus Icon Component
 * - Supports click actions
 * - Supports size + color props
 * - Works with your Action Engine
 */

export default function Icon({
  name,
  size = 20,
  color = theme.colors.white,
  action = null,
  style = {},
  ...props
}) {
  const handleAction = useActionHandler(action);

  const combinedStyle = {
    fontSize: size,
    color,
    cursor: action ? "pointer" : "default",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    ...style,
  };

  return (
    <i
      className={`icon-${name}`}
      style={combinedStyle}
      onClick={() => action && handleAction()}
      {...props}
    />
  );
}
