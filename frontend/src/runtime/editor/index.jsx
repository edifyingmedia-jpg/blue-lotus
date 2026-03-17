// frontend/src/runtime/editor/index.jsx

import { injectEditorScrollStyles } from "./EditorScrollStyles";
import { bootstrapEditor } from "./EditorBootstrap";

/**
 * Blue Lotus Editor Entry Point
 *
 * Loads:
 * - global scroll styles
 * - editor bootstrap sequence
 */

async function start() {
  // Inject global neon scrollbars
  injectEditorScrollStyles();

  // Initialize loader + engine + context + screen
  await bootstrapEditor();
}

start();
