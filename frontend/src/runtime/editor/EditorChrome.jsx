// frontend/src/runtime/editor/EditorChrome.jsx

import React from "react";
import LotusCommandPanel from "./LotusCommandPanel";
import LotusCommandPalette from "./LotusCommandPalette";
import EditorSurface from "./EditorSurface";
import { Theme } from "./EditorTheme";

/**
 * EditorChrome
 *
 * The themed UI shell for the Blue Lotus editor.
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
        background: Theme.colors.bg,
        color: Theme.colors.text,
        fontFamily: Theme.fonts.body,
      }}
    >
      {/* Top command bar */}
      <div
        style={{
          background: Theme.colors.bgPanel,
          borderBottom: `1px solid ${Theme.colors.border}`,
          padding: Theme.spacing.sm,
        }}
      >
        <LotusCommandPanel />
      </div>

      {/* Floating command palette */}
      <LotusCommandPalette />

      {/* Main editor */}
      <div
        style={{
          flex: 1,
          position: "relative",
          background: Theme.colors.bg,
        }}
      >
        <EditorSurface />
      </div>
    </div>
  );
};

export default EditorChrome;
