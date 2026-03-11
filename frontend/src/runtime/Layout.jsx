import React from "react";
import NavBar from "../pages/NavBar";

/**
 * Layout
 * ------
 * Global wrapper for every screen.
 *
 * Responsibilities:
 *  - Provide consistent padding and spacing
 *  - Apply global background + theme
 *  - Inject NavBar automatically if enabled
 *  - Wrap screen content in a scroll container
 */

export default function Layout({ children, showNav = true, navProps = {} }) {
  const container = {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#0F0F12",
    color: "white",
    display: "flex",
    flexDirection: "column",
  };

  const content = {
    flex: 1,
    padding: "20px",
    maxWidth: 900,
    width: "100%",
    margin: "0 auto",
  };

  return (
    <div style={container}>
      {showNav && <NavBar {...navProps} />}

      <div style={content}>
        {children}
      </div>
    </div>
  );
}
