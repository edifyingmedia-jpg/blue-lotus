// EditorContext.js

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import EditorEngine from "../EditorEngine";

const EditorContext = createContext(null);

export function EditorProvider({ children }) {
  const engineRef = useRef(null);

  // Create the engine once
  if (!engineRef.current) {
    engineRef.current = new EditorEngine();
  }

  const engine = engineRef.current;

  // React state to trigger re-renders when engine updates
  const [editorState, setEditorState] = useState({
    project: null,
    mode: "design",
    activeTool: null,
    activePanel: null
  });

  useEffect(() => {
    // Subscribe to engine updates
    const unsubscribe = engine.eventBus.subscribe((event) => {
      if (event.type === "mode:changed") {
        setEditorState((prev) => ({ ...prev, mode: event.mode }));
      }

      if (event.type === "project:loaded") {
        setEditorState((prev) => ({ ...prev, project: event.project }));
      }

      if (event.type === "tool:changed") {
        setEditorState((prev) => ({ ...prev, activeTool: event.tool }));
      }

      if (event.type === "panel:changed") {
        setEditorState((prev) => ({ ...prev, activePanel: event.panel }));
      }
    });

    return unsubscribe;
  }, [engine]);

  return (
    <EditorContext.Provider value={{ engine, editorState }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  return useContext(EditorContext);
}
