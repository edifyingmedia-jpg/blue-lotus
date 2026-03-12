// frontend/src/runtime/components/List.js

import React from "react";

/**
 * Blue Lotus List Component
 * - Safely renders a vertical list of children
 * - Adds spacing between items
 * - Does not introduce breaking logic
 */

export default function List({
  children,
  gap = 12,
  style = {},
  ...props
}) {
  const combinedStyle = {
    display: "flex",
    flexDirection: "column",
    gap,
    width: "100%",
    ...style,
  };

  return (
    <div style={combinedStyle} {...props}>
      {children}
    </div>
  );
}
