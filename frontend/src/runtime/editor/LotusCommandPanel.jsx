// frontend/src/runtime/editor/LotusCommandPanel.jsx

import React from "react";
import EventBus from "./core/EventBus";
import { LotusCommandRegistry } from "./core/LotusCommandRegistry";

const EDITOR_EVENT_CHANNEL = "editor:event";

const LotusCommandPanel = () => {
  const handleCommand = (command) => {
    EventBus.emit(EDITOR_EVENT_CHANNEL, {
      action: "lotus_command",
      payload: {
        command: command.name,
        ...command.payload,
      },
    });
  };

  // Group commands by category
  const categories = LotusCommandRegistry.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {});

  return (
    <div
      data-lotus-command-panel
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "8px",
        background: "#111",
        borderBottom: "1px solid #333",
      }}
    >
      {Object.entries(categories).map(([category, commands]) => (
        <div key={category} style={{ marginBottom: "8px" }}>
          <div
            style={{
              color: "#aaa",
              fontSize: "12px",
              marginBottom: "4px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {category}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {commands.map((cmd) => (
              <button
                key={cmd.name}
                onClick={() => handleCommand(cmd)}
                style={{
                  padding: "6px 10px",
                  background: "#222",
                  border: "1px solid #444",
                  borderRadius: "4px",
                  color: "#eee",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                {cmd.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LotusCommandPanel;
