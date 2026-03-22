// frontend/src/components/BLText.js

import React from "react";
import PropTypes from "prop-types";

/**
 * BLText
 *
 * The runtime text component for Blue Lotus.
 * Provides:
 *  - predictable text rendering
 *  - safe defaults
 *  - no styling overrides unless explicitly provided
 *
 * It does NOT:
 *  - simulate behavior
 *  - inject mock props
 *  - alter user-defined styles
 */
export default function BLText({ style, children, ...rest }) {
  return (
    <span
      {...rest}
      style={{
        display: "inline",
        whiteSpace: "pre-wrap",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

BLText.propTypes = {
  style: PropTypes.object,
  children: PropTypes.node,
};
