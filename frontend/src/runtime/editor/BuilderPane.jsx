// frontend/src/runtime/editor/BuilderPane.jsx

import React from "react";
import { Theme } from "./EditorTheme";
import { useEditor } from "./EditorContext";

/**
 * BuilderPane
 *
 * The right-side pane for tools, metadata, and AI-assisted features.
 * Future features:
 * - scene builder
 * - character sheets
 * - metadata inspector
 * - AI suggestions
 * - project-level controls
 */

const BuilderPane = () => {
  const { text } = useEditor();

  const placeholderItems = [
    "Builder tools coming soon",
    "Scene metadata will appear here",
    "AI suggestions will live here",
  ];

  return (
    <div
      data-builder-pane
      style={{
        width: "300px",
        height: "100%",
        background: Theme.colors.bgPanel,
        borderLeft: `1px solid ${Theme.colors.border}`,
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
        Builder
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

export default BuilderPane;
