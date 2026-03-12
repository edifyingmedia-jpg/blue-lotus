// frontend/src/runtime/components/Container.js

import React from "react";
import useActionHandler from "../engine/useActionHandler";

/**
 * Blue Lotus Container Component
 * - Wraps children
 * - Supports click actions
 * - Supports padding, margin, radius, background
 * - Works with your Action Engine
 */

export default function Container({
  children,
  action = null,
  padding = 0,
  margin = 0,
  radius = 0,
  background = "transparent",
  style = {},
  ...props
}) {
  const handleAction = useActionHandler(action);

  const combinedStyle = {
    padding,
    margin,
    borderRadius: radius,
    background,
    cursor: action ? "pointer" : "default",
    display: "block",
    ...style,
  };

  return (
    <div
      style={combinedStyle}
      onClick={action ? handleAction : undefined}
      {...props}
    >
      {children}
    </div>
  );
}
