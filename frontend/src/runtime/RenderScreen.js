import React from "react";
import { resolveComponent } from "./resolveComponent";

/**
 * RenderScreen
 * ------------
 * Takes a full screen JSON definition and renders the root node.
 *
 * Example screen JSON:
 * {
 *   "name": "Home",
 *   "root": {
 *     "type": "View",
 *     "props": { "padding": 20 },
 *     "children": [
 *       { "type": "Heading", "props": { "text": "Welcome" } },
 *       { "type": "PrimaryButton", "props": { "title": "Start" } }
 *     ]
 *   }
 * }
 */

export default function RenderScreen({ screen }) {
  if (!screen || !screen.root) {
    console.warn("⚠ RenderScreen: No screen or root node provided.");
    return null;
  }

  try {
    return resolveComponent(screen.root);
  } catch (err) {
    console.error("❌ Error rendering screen:", err);
    return (
      <div style={{ padding: 20, color: "red" }}>
        <strong>Render Error:</strong> {err.message}
      </div>
    );
  }
}
