// frontend/src/runtime/editor/NotesPane.jsx

import React, { useState } from "react";
import { Theme } from "./EditorTheme";

/**
 * NotesPane
 *
 * A lightweight right-side pane for author notes.
 * Future features:
 * - sticky notes
 * - AI note suggestions
 * - scene-linked notes
 * - character-linked notes
 */

const NotesPane = () => {
  const [notes, setNotes] = useState("");

  return (
    <div
      data-notes-pane
      style={{
        width: "260px",
        height: "100%",
        background: Theme.colors.bgPanel,
        borderLeft: `1px solid ${Theme.colors.border}`,
        padding: Theme.spacing.md,
        color: Theme.colors.text,
        fontFamily: Theme.fonts.body,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          marginBottom: Theme.spacing.md,
          color: Theme.colors.textMuted,
          fontSize: "12px",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        Notes
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Write notes here…"
        style={{
          flex: 1,
          width: "100%",
          background: Theme.colors.bgElevated,
          color: Theme.colors.text,
          border: `1px solid ${Theme.colors.border}`,
          borderRadius: Theme.radius.md,
          padding: Theme.spacing.md,
          fontSize: "14px",
          resize: "none",
          outline: "none",
          boxShadow: Theme.neonGlow("neonPurple"),
          fontFamily: Theme.fonts.mono,
        }}
      />
    </div>
  );
};

export default NotesPane;
