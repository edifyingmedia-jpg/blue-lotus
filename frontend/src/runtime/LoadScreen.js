import React from "react";

/**
 * LoadScreen
 * -----------------------------------------
 * A simple, deterministic loading screen used by the
 * runtime engine while initializing app definitions,
 * resolving components, or preparing the preview host.
 *
 * This component must remain lightweight and synchronous.
 */

export default function LoadScreen({ message = "Loading..." }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.25rem",
        color: "#555",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {message}
    </div>
  );
}
