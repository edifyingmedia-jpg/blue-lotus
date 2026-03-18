// frontend/src/components/Container.jsx

import React from "react";

/**
 * Container
 * ---------------------------------------------------------
 * The foundational layout wrapper for Blue Lotus.
 *
 * Features:
 * - Cinematic max-width (default 800px)
 * - Centered layout
 * - Adjustable padding
 * - Smooth transitions
 * - Works with JSON screen definitions
 * - Emotionally clean, stable, and predictable
 */

const Container = ({
  children,
  maxWidth = "800px",
  padding = "1.5rem",
  center = true,
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
