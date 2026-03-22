// frontend/src/components/BLView.js

import React from "react";
import PropTypes from "prop-types";

/**
 * BLView
 *
 * The foundational layout component for the Blue Lotus runtime.
 * This is the equivalent of a <div>, but with:
 *  - predictable styling
 *  - safe defaults
 *  - runtime‑faithful behavior
 *
 * It does NOT:
 *  - simulate behavior
 *  - inject mock props
 *  - override user-defined styles
 */
export default function BLView({ style, children, ...rest }) {
  return (
    <div
      {...rest}
      style={{
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        minWidth: 0,
        minHeight: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

BLView.propTypes = {
  style: PropTypes.object,
  children: PropTypes.node,
};
