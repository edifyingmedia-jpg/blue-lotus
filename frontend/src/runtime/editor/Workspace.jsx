// frontend/src/runtime/editor/Workspace.jsx

import React from "react";
import { useEditor } from "./EditorContext";
import EditorChrome from "./EditorChrome";
import { Theme } from "./EditorTheme";

/**
 * Workspace
 *
 * The multi-pane layout container for Blue Lotus.
 * Supports:
 * - main editor pane
 * - optional left/right panes (outline, builder, notes)
 * - theme-aware layout
 */

const Workspace = () => {
  const { activePane } = useEditor();

  return (
    <div
      data-workspace
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: Theme.colors.bg,
        color: Theme.colors.text,
        fontFamily: Theme.fonts.body,
      }}
    >
      {/* Left Pane (future: OutlinePane, NavigatorPane) */}
      {activePane === "outline" && (
        <div
          style={{
            width: "260px",
            borderRight: `1px solid ${Theme.colors.border}`,
            background: Theme.colors.bgPanel,
            padding: Theme.spacing.md,
          }}
        >
          <div style={{ color: Theme.colors.textMuted }}>
            Outline Pane (coming soon)
          </div>
        </div>
      )}

      {/* Main Editor Pane */}
      <div style={{ flex: 1, position: "relative" }}>
        <EditorChrome />
      </div>

      {/* Right Pane (future: BuilderPane, NotesPane) */}
      {activePane === "builder" && (
        <div
          style={{
            width: "300px",
            borderLeft: `1px solid ${Theme.colors.border}`,
            background: Theme.colors.bgPanel,
            padding: Theme.spacing.md,
          }}
        >
          <div style={{ color: Theme.colors.textMuted }}>
            Builder Pane (coming soon)
          </div>
        </div>
      )}
    </div>
  );
};

export default Workspace;
