// frontend/src/components/Container.jsx

import React from "react";

/**
 * Container
 * ---------------------------------------------------------
 * Cinematic layout wrapper for Blue Lotus.
 * Supports max-width, padding, centering, background,
 * blur, borders, neon glow, and JSON-friendly props.
 */

const Container = ({
  children,
  maxWidth = "800px",
  padding = "1.5rem",
  center = true,
  background = "transparent",
  border = "none",
  radius = "12px",
  shadow = "none",
  blur = false,
  fullHeight = false,
  style = {},
  ...rest
}) => {
  return (
    <div
      style={{
        maxWidth,
        padding,
        margin: center ? "0 auto" : undefined,
        width: "100%",
        height: fullHeight ? "100%" : "auto",
        background,
        border,
        borderRadius: radius,
        boxShadow: shadow,
        backdropFilter: blur ? "blur(12px)" : undefined,
        transition: "all 0.3s ease",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Container;
