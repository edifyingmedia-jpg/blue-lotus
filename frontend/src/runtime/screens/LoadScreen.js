/**
 * LoadScreen.js
 * ----------------------------------------------------
 * Displays a loading state while the RuntimeEngine
 * initializes the app, loads the project, or resolves
 * the initial screen.
 *
 * This screen is used by both:
 * - LivePreview (Builder)
 * - Deployed runtime apps
 */

import React from "react";

export default function LoadScreen() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.25rem",
        fontWeight: 500,
      }}
    >
      Loading…
    </div>
  );
}
