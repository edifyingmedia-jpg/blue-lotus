import React from "react";
import RenderScreen from "../runtime/RenderScreen";

/**
 * ScreenPage
 * ----------
 * A universal wrapper that renders any screen JSON using the runtime engine.
 *
 * Usage:
 * <ScreenPage screen={myScreenJson} />
 *
 * This allows your router or builder to dynamically load screens
 * without needing separate React components for each page.
 */

export default function ScreenPage({ screen }) {
  if (!screen) {
    return (
      <div style={{ padding: 20, color: "red" }}>
        <strong>No screen data provided.</strong>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <RenderScreen screen={screen} />
    </div>
  );
}
