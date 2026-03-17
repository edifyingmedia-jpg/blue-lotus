// frontend/src/runtime/editor/EditorBootstrap.js

import React from "react";
import { createRoot } from "react-dom/client";
import { editorLoader } from "./EditorLoader";
import EditorScreen from "./EditorScreen";

/**
 * EditorBootstrap
 *
 * Bootstraps the Blue Lotus editor:
 * - initializes the loader
 * - waits for engine + context bundle
 * - mounts the full editor screen
 */

export async function bootstrapEditor() {
  await editorLoader.init();

  const container = document.getElementById("blue-lotus-root");

  if (!container) {
    console.error("[Blue Lotus] Missing #blue-lotus-root container.");
    return;
  }

  const root = createRoot(container);
  root.render(<EditorScreen />);
}
