// frontend/src/components/Spacer.jsx

import React from "react";

/**
 * Spacer
 * ---------------------------------------------------------
 * A simple vertical or horizontal spacer.
 *
 * Works with JSON screen definitions and provides
 * clean, predictable spacing in your layouts.
 */

const Spacer = ({
  size = "1rem",
  horizontal = false,
  style = {},
  ...rest
}) => {
  return (
    <div
      style={{
        display: horizontal ? "inline-block" : "block",
        width: horizontal ? size : "100%",
        height: horizontal ? "100%" : size,
        ...style,
      }}
      {...rest}
    />
  );
};

export default Spacer;
