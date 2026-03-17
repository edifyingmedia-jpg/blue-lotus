// frontend/src/runtime/editor/OutlinePane.jsx

import React from "react";
import { Theme } from "./EditorTheme";
import { useEditor } from "./EditorContext";

/**
 * OutlinePane
 *
 * The left-side structural navigation pane.
 * Future features:
 * - chapter list
 * - scene list
 * - beat hierarchy
 * - AI structural suggestions
 */

const OutlinePane = () => {
  const { text } = useEditor();

  // Temporary placeholder logic:
  // Extract headings or scene markers in the future.
  const placeholderItems = [
    "Outline coming soon",
    "Scenes will appear here",
    "AI structure view will live here",
  ];

  return (
    <div
      data-outline-pane
      style={{
        width: "260px",
        height: "100%",
        background: Theme.colors.bgPanel,
        borderRight: `1px solid ${Theme.colors.border}`,
        padding: Theme.spacing.md,
        color: Theme.colors.text,
        fontFamily: Theme.fonts.body,
        overflowY: "auto",
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
        Outline
      </div>

      {placeholderItems.map((item, index) => (
        <div
          key={index}
          style={{
            padding: Theme.spacing.sm,
            marginBottom: Theme.spacing.xs,
            background: Theme.colors.bgElevated,
            borderRadius: Theme.radius.md,
            border: `1px solid ${Theme.colors.border}`,
            fontSize: "13px",
            color: Theme.colors.textMuted,
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default OutlinePane;
