// frontend/src/runtime/editor/index.jsx

import React from "react";
import { createRoot } from "react-dom/client";

import EditorChrome from "./EditorChrome";
import TWINLotus from "./TWIN/TWINLotus";
import { injectEditorScrollStyles } from "./EditorScrollStyles";

/**
 * Blue Lotus Editor Entry Point
 *
 * This file mounts:
 * - EditorChrome (UI shell)
 * - TWINLotus (intelligent engine)
 * - Scroll styles (global neon scrollbars)
 */

// Inject global scroll styles once at startup
injectEditorScrollStyles();

function BlueLotusEditor() {
  return (
    <>
      {/* Intelligent engine */}
      <TWINLotus />

      {/* UI shell */}
      <EditorChrome />
    </>
  );
}

// Mount into the runtime container
const container = document.getElementById("blue-lotus-root");

if (container) {
  const root = createRoot(container);
  root.render(<BlueLotusEditor />);
} else {
  console.error(
    "[Blue Lotus] Could not find #blue-lotus-root. Editor failed to mount."
  );
}
