// frontend/src/runtime/editor/LotusCommandPanel.jsx

import React from "react";
import EventBus from "./core/EventBus";
import { LotusCommandRegistry } from "./core/LotusCommandRegistry";
import { Theme } from "./EditorTheme";

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
        gap: Theme.spacing.sm,
        padding: Theme.spacing.sm,
        background: Theme.colors.bgPanel,
        borderBottom: `1px solid ${Theme.colors.border}`,
        fontFamily: Theme.fonts.body,
      }}
    >
      {Object.entries(categories).map(([category, commands]) => (
        <div key={category} style={{ marginBottom: Theme.spacing.sm }}>
          <div
            style={{
              color: Theme.colors.textMuted,
              fontSize: "11px",
              marginBottom: Theme.spacing.xs,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {category}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: Theme.spacing.xs }}>
            {commands.map((cmd, index) => {
              // Rotate neon accents for fun
              const neonColors = [
                Theme.colors.neonCyan,
                Theme.colors.neonPurple,
                Theme.colors.neonPink,
              ];
              const accent = neonColors[index % neonColors.length];

              return (
                <button
                  key={cmd.name}
                  onClick={() => handleCommand(cmd)}
                  style={{
                    padding: `${Theme.spacing.xs} ${Theme.spacing.md}`,
                    background: Theme.colors.buttonBg,
                    border: `1px solid ${Theme.colors.border}`,
                    borderRadius: Theme.radius.sm,
                    color: Theme.colors.text,
                    cursor: "pointer",
                    fontSize: "12px",
                    transition: "0.15s ease",
                    boxShadow: `0 0 4px ${accent}55`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = Theme.colors.buttonHover;
                    e.currentTarget.style.boxShadow = Theme.neonGlow(
                      index % 3 === 0
                        ? "neonCyan"
                        : index % 3 === 1
                        ? "neonPurple"
                        : "neonPink"
                    );
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = Theme.colors.buttonBg;
                    e.currentTarget.style.boxShadow = `0 0 4px ${accent}55`;
                  }}
                >
                  {cmd.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LotusCommandPanel;
