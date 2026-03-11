import React from "react";
import { Link } from "react-router-dom";

/**
 * NavBar
 * ------
 * A clean, reusable top navigation bar.
 *
 * Usage in JSON:
 * {
 *   "type": "NavBar",
 *   "props": {
 *     "title": "Blue Lotus"
 *   }
 * }
 */

export default function NavBar({ title = "Blue Lotus", links = [] }) {
  const barStyle = {
    width: "100%",
    padding: "14px 20px",
    backgroundColor: "#1B1B1F",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  };

  const titleStyle = {
    color: "white",
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: 0.5,
  };

  const linkContainer = {
    display: "flex",
    gap: "16px",
  };

  const linkStyle = {
    color: "#A29BFE",
    textDecoration: "none",
    fontSize: 16,
    fontWeight: 500,
  };

  return (
    <div style={barStyle}>
      <div style={titleStyle}>{title}</div>

      <div style={linkContainer}>
        {links.map((item, index) => (
          <Link
            key={index}
            to={`/screen/${item.to}`}
            style={linkStyle}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
