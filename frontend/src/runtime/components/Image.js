import React from "react";
import useActionHandler from "../engine/useActionHandler";

/**
 * Blue Lotus Image Component
 * - Supports click actions
 * - Supports width, height, radius
 * - Works with your Action Engine
 */

export default function Image({
  src,
  alt = "",
  action = null,
  width = "100%",
  height = "auto",
  radius = 8,
  style = {},
  ...props
}) {
  const handleAction = useActionHandler(action);

  const combinedStyle = {
    width,
    height,
    borderRadius: radius,
    cursor: action ? "pointer" : "default",
    display: "block",
    ...style,
  };

  return (
    <img
      src={src}
      alt={alt}
      style={combinedStyle}
      onClick={() => action && handleAction()}
      {...props}
    />
  );
}
