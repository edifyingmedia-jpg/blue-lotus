// EditorScreen.jsx

"use client";

import React, { useEffect, useRef } from "react";
import { useEditor } from "./context/EditorContext";

export default function EditorScreen() {
  const { engine } = useEditor();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      engine.mountCanvas(canvasRef.current);
    }
  }, [engine]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#111",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <canvas
        ref={canvasRef}
        width={1200}
        height={800}
        style={{
          background: "#1a1a1a",
          border: "1px solid #333",
          borderRadius: "6px"
        }}
      />
    </div>
  );
}
