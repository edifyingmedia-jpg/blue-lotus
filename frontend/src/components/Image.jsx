// frontend/src/components/Image.jsx

import React from "react";

/**
 * Image
 * ---------------------------------------------------------
 * A clean, stable image component for Blue Lotus.
 *
 * Features:
 * - Supports width, height, radius
 * - Auto object-fit
 * - Smooth transitions
 * - Works with JSON screen definitions
 */

const Image = ({
  src,
  alt = "",
  width = "100%",
  height = "auto",
  radius = "8px",
  style = {},
  ...rest
}) => {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width,
        height,
        borderRadius: radius,
        objectFit: "cover",
        display: "block",
        transition: "all 0.25s ease",
        ...style,
      }}
      {...rest}
    />
  );
};

export default Image;
