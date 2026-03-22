// frontend/src/components/BLButton.js

import React from "react";
import PropTypes from "prop-types";

/**
 * BLButton
 *
 * The runtime button component for Blue Lotus.
 * Provides:
 *  - predictable button rendering
 *  - safe defaults
 *  - clean event forwarding
 *
 * It does NOT:
 *  - simulate behavior
 *  - inject mock props
 *  - override user-defined styles
 */
export default function BLButton({ style, children, onPress, onClick, ...rest }) {
  const handleClick = (e) => {
    if (onPress) onPress(e);
    if (onClick) onClick(e);
  };

  return (
    <button
      {...rest}
      onClick={handleClick}
      style={{
        padding: "8px 14px",
        fontSize: 14,
        borderRadius: 6,
        border: "1px solid #334155",
        backgroundColor: "#1e293b",
        color: "#e2e8f0",
        cursor: "pointer",
        boxSizing: "border-box",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

BLButton.propTypes = {
  style: PropTypes.object,
  children: PropTypes.node,
  onPress: PropTypes.func,
  onClick: PropTypes.func,
};
