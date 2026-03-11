import React from "react";
import { Link } from "react-router-dom";

/**
 * LinkButton
 * ----------
 * A navigation button that routes to another screen.
 *
 * Usage in JSON:
 * {
 *   "type": "LinkButton",
 *   "props": {
 *     "to": "about",
 *     "label": "Go to About"
 *   }
 * }
 */

export default function LinkButton({ to, label, style }) {
  const target = `/screen/${to}`;

  const baseStyle = {
    display: "inline-block",
    padding: "12px 20px",
    backgroundColor: "#6C5CE7",
    color: "white",
    borderRadius: 8,
    textDecoration: "none",
    fontSize: 16,
    fontWeight: 600,
    textAlign: "center",
    ...style,
  };

  return (
    <Link to={target} style={baseStyle}>
      {label}
    </Link>
  );
}
