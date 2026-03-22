// frontend/src/components/BLImage.js

import React from "react";
import PropTypes from "prop-types";

/**
 * BLImage
 *
 * The runtime image component for Blue Lotus.
 * Provides:
 *  - predictable image rendering
 *  - safe defaults
 *  - no forced sizing unless specified
 *
 * It does NOT:
 *  - simulate behavior
 *  - inject mock props
 *  - override user-defined styles
 */
export default function BLImage({ src, alt = "", style, ...rest }) {
  return (
    <img
      {...rest}
      src={src}
      alt={alt}
      style={{
        display: "block",
        maxWidth: "100%",
        height: "auto",
        boxSizing: "border-box",
        ...style,
      }}
    />
  );
}

BLImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  style: PropTypes.object,
};
