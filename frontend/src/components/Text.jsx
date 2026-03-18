// frontend/src/components/Text.jsx

import React from "react";

/**
 * Text
 * ---------------------------------------------------------
 * A clean, flexible text component for Blue Lotus.
 *
 * Features:
 * - Supports size, weight, color
 * - Smooth transitions
 * - Emotionally clean typography
 * - Works with JSON screen definitions
 */

const Text = ({
  children,
  size = "1rem",
  weight = 400,
  color = "#ffffff",
  align = "left",
  style = {},
  ...rest
}) => {
  return (
    <p
      style={{
        fontSize: size,
        fontWeight: weight,
        color,
        textAlign: align,
        margin: "0 0 0.5rem 0",
        lineHeight: 1.5,
        transition: "all 0.25s ease",
        ...style,
      }}
      {...rest}
    >
      {children}
    </p>
  );
};

export default Text;
