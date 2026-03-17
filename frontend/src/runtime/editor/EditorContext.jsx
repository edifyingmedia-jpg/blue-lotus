// frontend/src/runtime/editor/EditorContext.jsx

import React, { createContext, useContext, useState, useCallback } from "react";
import { Theme } from "./EditorTheme";

/**
 * EditorContext
 *
 * Global state container for the Blue Lotus editor.
 * Provides:
 * - text
 * - theme mode
 * - active pane
 * - editor mode (write, revise, structure)
 * - future builder state
 */

const EditorContext = createContext(null);

export const useEditor = () => {
  const ctx = useContext(EditorContext);
  if (!ctx) {
    throw new Error("useEditor must be used inside <EditorProvider>");
  }
  return ctx;
};

export const EditorProvider = ({ children }) => {
  const [text, setText] = useState("");
  const [editorMode, setEditorMode] = useState("write"); // write | revise | structure
  const [activePane, setActivePane] = useState("main"); // main | outline | builder
  const [themeMode, setThemeMode] = useState(Theme.mode);

  const updateText = useCallback((value) => {
    setText(value);
  }, []);

  const value = {
    text,
    updateText,

    editorMode,
    setEditorMode,

    activePane,
    setActivePane,

    themeMode,
    setThemeMode,
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};
