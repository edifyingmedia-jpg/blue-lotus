// frontend/src/runtime/editor/LotusCommandPalette.jsx

import React, { useState, useEffect, useCallback } from "react";
import EventBus from "./core/EventBus";
import { LotusCommandRegistry } from "./core/LotusCommandRegistry";
import { Theme } from "./EditorTheme";

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

  const handleKey = useCallback(
    (e) => {
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
    },
    [open]
  );

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
        background: Theme.colors.bgElevated,
        border: `1px solid ${Theme.colors.border}`,
        borderRadius: Theme.radius.lg,
        padding: Theme.spacing.md,
        zIndex: 9999,
        boxShadow: Theme.neonGlow("neonPurple"),
        fontFamily: Theme.fonts.body,
      }}
    >
      <input
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type a command…"
        style={{
          width: "100%",
          padding: Theme.spacing.sm,
          background: Theme.colors.buttonBg,
          border: `1px solid ${Theme.colors.border}`,
          borderRadius: Theme.radius.md,
          color: Theme.colors.text,
          marginBottom: Theme.spacing.md,
          fontSize: "14px",
        }}
      />

      <div style={{ maxHeight: "240px", overflowY: "auto" }}>
        {filtered.length === 0 && (
          <div style={{ color: Theme.colors.textMuted, padding: Theme.spacing.sm }}>
            No matching commands
          </div>
        )}

        {filtered.map((cmd, index) => {
          const neonColors = [
            Theme.colors.neonCyan,
            Theme.colors.neonPurple,
            Theme.colors.neonPink,
          ];
          const accent = neonColors[index % neonColors.length];

          return (
            <div
              key={cmd.name}
              onClick={() => handleTrigger(cmd)}
              style={{
                padding: Theme.spacing.sm,
                borderRadius: Theme.radius.md,
                cursor: "pointer",
                background: Theme.colors.bgPanel,
                marginBottom: Theme.spacing.xs,
                border: `1px solid ${Theme.colors.border}`,
                color: Theme.colors.text,
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
                e.currentTarget.style.background = Theme.colors.bgPanel;
                e.currentTarget.style.boxShadow = `0 0 4px ${accent}55`;
              }}
            >
              <div style={{ fontSize: "14px" }}>{cmd.label}</div>
              <div style={{ fontSize: "11px", color: Theme.colors.textMuted }}>
                {cmd.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LotusCommandPalette;
