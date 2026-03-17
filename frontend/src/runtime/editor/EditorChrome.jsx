// frontend/src/runtime/editor/EditorChrome.jsx

import React from "react";
import LotusCommandPanel from "./LotusCommandPanel";
import LotusCommandPalette from "./LotusCommandPalette";
import EditorSurface from "./EditorSurface";

/**
 * EditorChrome
 *
 * Wraps the entire Blue Lotus editor environment:
 * - Command Panel (buttons)
 * - Command Palette (Cmd+K / slash menu)
 * - Editor Surface (textarea + TWINLotus)
 *
 * This is the top-level UI shell for the runtime editor.
 */

const EditorChrome = () => {
  return (
    <div
      data-editor-chrome
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#000",
        color: "#eee",
      }}
    >
      {/* Top command bar */}
      <LotusCommandPanel />

      {/* Floating command palette */}
      <LotusCommandPalette />

      {/* Main editor */}
      <div style={{ flex: 1, position: "relative" }}>
        <EditorSurface />
      </div>
    </div>
  );
};

export default EditorChrome;
