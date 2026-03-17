// frontend/src/runtime/editor/EditorScreen.jsx

import React from "react";
import { EditorProvider } from "./EditorContext";
import Workspace from "./Workspace";
import { Theme } from "./EditorTheme";

/**
 * EditorScreen
 *
 * The full-screen container for the Blue Lotus editor.
 * Wraps:
 * - EditorProvider (global UI state)
 * - Workspace (multi-pane layout)
 *
 * This is the component you embed anywhere.
 */

const EditorScreen = () => {
  return (
    <div
      data-editor-screen
      style={{
        width: "100%",
        height: "100%",
        background: Theme.colors.bg,
        color: Theme.colors.text,
        fontFamily: Theme.fonts.body,
        overflow: "hidden",
      }}
    >
      <EditorProvider>
        <Workspace />
      </EditorProvider>
    </div>
  );
};

export default EditorScreen;
