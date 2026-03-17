// frontend/src/runtime/editor/EditorSurface.jsx

import React, { useState, useEffect } from "react";
import EventBus from "./core/EventBus";
import { Theme } from "./EditorTheme";

/**
 * EditorSurface
 *
 * The main writing area of Blue Lotus.
 * Handles:
 * - text input
 * - scroll container
 * - update events from TWINLotus
 */

const EDITOR_UPDATE_CHANNEL = "editor:update";
const EDITOR_EVENT_CHANNEL = "editor:event";

const EditorSurface = () => {
  const [text, setText] = useState("");

  useEffect(() => {
    const handler = (payload) => {
      if (payload?.text !== undefined) {
        setText(payload.text);
      }
    };

    EventBus.on(EDITOR_UPDATE_CHANNEL, handler);
    return () => EventBus.off(EDITOR_UPDATE_CHANNEL, handler);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);

    EventBus.emit(EDITOR_EVENT_CHANNEL, {
      action: "update_text",
      payload: { value },
    });
  };

  return (
    <div
      data-editor-surface
      style={{
        width: "100%",
        height: "100%",
        overflowY: "auto",
        background: Theme.colors.bg,
        padding: Theme.spacing.lg,
        boxSizing: "border-box",
        fontFamily: Theme.fonts.body,
      }}
    >
      <textarea
        value={text}
        onChange={handleChange}
        spellCheck={false}
        style={{
          width: "100%",
          height: "100%",
          background: Theme.colors.bgElevated,
          color: Theme.colors.text,
          border: `1px solid ${Theme.colors.border}`,
          borderRadius: Theme.radius.md,
          padding: Theme.spacing.md,
          fontSize: "16px",
          lineHeight: "1.6",
          resize: "none",
          outline: "none",
          boxShadow: Theme.neonGlow("neonCyan"),
          fontFamily: Theme.fonts.mono,
        }}
      />
    </div>
  );
};

export default EditorSurface;
