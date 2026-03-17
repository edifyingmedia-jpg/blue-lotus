// frontend/src/runtime/editor/EditorSurface.jsx

import React, { useEffect, useState, useCallback } from "react";
import EventBus from "./core/EventBus";
import { getText, setText, applyUpdate } from "./core/DocumentModel";
import { updateSelection } from "./core/SelectionModel";
import TWINLotus from "./TWIN/TWINLotus";
import LotusCommandPanel from "./LotusCommandPanel";

const EDITOR_EVENT_CHANNEL = "editor:event";
const EDITOR_UPDATE_CHANNEL = "editor:update";

const EditorSurface = () => {
  const [text, setLocalText] = useState(() => getText());

  // Handle user typing
  const handleChange = useCallback((event) => {
    const value = event.target.value;

    // Update document model
    setText(value);
    setLocalText(value);

    // Update selection model
    updateSelection(event.target.selectionStart, event.target.selectionEnd, value);

    // Emit event to TWINLotus
    EventBus.emit(EDITOR_EVENT_CHANNEL, {
      action: "update_text",
      payload: { value },
    });
  }, []);

  // Handle selection changes
  const handleSelectionChange = useCallback((event) => {
    const el = event.target;
    updateSelection(el.selectionStart, el.selectionEnd, el.value);
  }, []);

  // Listen for updates from TWINLotus
  useEffect(() => {
    const handleUpdate = (update) => {
      const next = applyUpdate(update);
      setLocalText(next);
    };

    EventBus.on(EDITOR_UPDATE_CHANNEL, handleUpdate);
    return () => {
      EventBus.off(EDITOR_UPDATE_CHANNEL, handleUpdate);
    };
  }, []);

  // Optional debug hook
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.__BLUE_LOTUS_DEBUG__ = {
        emitLotusCommand(command, payload = {}) {
          EventBus.emit(EDITOR_EVENT_CHANNEL, {
            action: "lotus_command",
            payload: { command, ...payload },
          });
        },
      };
    }
  }, []);

  return (
    <div
      data-editor-surface
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        width: "100%",
        height: "100%",
      }}
    >
      {/* Command Panel */}
      <LotusCommandPanel />

      {/* Main Editor */}
      <textarea
        value={text}
        onChange={handleChange}
        onSelect={handleSelectionChange}
        style={{
          flex: 1,
          width: "100%",
          resize: "none",
          padding: "12px",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          fontSize: "14px",
          lineHeight: 1.5,
        }}
      />

      {/* Invisible runtime brain */}
      <TWINLotus
        initialText={text}
        onChange={(nextText) => {
          setText(nextText);
          setLocalText(nextText);
        }}
      />
    </div>
  );
};

export default EditorSurface;
