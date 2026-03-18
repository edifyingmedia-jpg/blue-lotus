// frontend/src/components/CommandPalette.jsx

/**
 * CommandPalette.jsx
 * ---------------------------------------------------------
 * The intelligence layer of the Blue Lotus editor.
 * Cinematic, neon-ready, keyboard-navigable command palette.
 */

import React, { useState, useMemo, useEffect } from "react";
import "./CommandPalette.css";

export function CommandPalette({ engine }) {
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);

    const commands = useMemo(() => {
        const all = engine.getCommands(); // [{ id, label, action }]
        if (!query.trim()) return all;
        return all.filter(cmd =>
            cmd.label.toLowerCase().includes(query.toLowerCase())
        );
    }, [query, engine]);

    // Keyboard navigation
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "ArrowDown") {
                setSelectedIndex((i) => Math.min(i + 1, commands.length - 1));
            }
            if (e.key === "ArrowUp") {
                setSelectedIndex((i) => Math.max(i - 1, 0));
            }
            if (e.key === "Enter") {
                const cmd = commands[selectedIndex];
                if (cmd) {
                    engine.runCommand(cmd.id);
                    engine.closeCommandPalette();
                }
            }
            if (e.key === "Escape") {
                engine.closeCommandPalette();
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [commands, selectedIndex, engine]);

    return (
        <div className="cmd-root">

            {/* Search bar */}
            <input
                autoFocus
                className="cmd-input"
                placeholder="Type a command..."
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                }}
            />

            {/* Command list */}
            <div className="cmd-list">
                {commands.map((cmd, i) => (
                    <div
                        key={cmd.id}
                        className={
                            "cmd-item" +
                            (i === selectedIndex ? " cmd-item-active" : "")
                        }
                        onMouseEnter={() => setSelectedIndex(i)}
                        onClick={() => {
                            engine.runCommand(cmd.id);
                            engine.closeCommandPalette();
                        }}
                    >
                        {cmd.label}
                    </div>
                ))}

                {commands.length === 0 && (
                    <div className="cmd-empty">No matching commands</div>
                )}
            </div>
        </div>
    );
}
