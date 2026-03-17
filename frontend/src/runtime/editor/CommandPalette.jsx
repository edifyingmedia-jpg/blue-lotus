// frontend/src/runtime/editor/LotusCommandPalette.jsx

import React, { useState, useEffect, useCallback } from "react";
import EventBus from "./core/EventBus";
import { LotusCommandRegistry } from "./core/LotusCommandRegistry";

const EDITOR_EVENT_CHANNEL = "editor:event";

const LotusCommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = LotusCommandRegistry.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleTrigger = (cmd) => {
    EventBus.emit(EDITOR_EVENT_CHANNEL, {
      action: "lotus_command",
      payload: {
        command: cmd.name,
        ...cmd.payload,
      },
    });

    setOpen(false);
    setQuery("");
  };

  const handleKey = useCallback((e) => {
    // Open palette with Cmd+K or Ctrl+K
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      setOpen((prev) => !prev);
      return;
    }

    // Slash command
    if (e.key === "/" && !open) {
      setOpen(true);
      setQuery("");
      return;
    }

    // Escape closes palette
    if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  if (!open) return null;

  return (
    <div
      data-lotus-command-palette
      style={{
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "420px",
        background: "#111",
        border: "1px solid #333",
        borderRadius: "8px",
        padding: "12px",
        zIndex: 9999,
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      }}
    >
      <input
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type a command…"
        style={{
          width: "100%",
          padding: "8px",
          background: "#222",
          border: "1px solid #444",
          borderRadius: "4px",
          color: "#eee",
          marginBottom: "10px",
          fontSize: "14px",
        }}
      />

      <div style={{ maxHeight: "240px", overflowY: "auto" }}>
        {filtered.length === 0 && (
          <div style={{ color: "#777", padding: "8px" }}>
            No matching commands
          </div>
        )}

        {filtered.map((cmd) => (
          <div
            key={cmd.name}
            onClick={() => handleTrigger(cmd)}
            style={{
              padding: "8px",
              borderRadius: "4px",
              cursor: "pointer",
              background: "#181818",
              marginBottom: "6px",
              border: "1px solid #333",
              color: "#eee",
            }}
          >
            <div style={{ fontSize: "14px" }}>{cmd.label}</div>
            <div style={{ fontSize: "11px", color: "#888" }}>
              {cmd.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LotusCommandPalette;
