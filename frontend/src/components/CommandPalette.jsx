// frontend/src/components/CommandPalette.jsx

/**
 * CommandPalette.jsx
 * ------------------
 * The intelligence layer of the editor.
 * Provides fast access to engine commands with
 * clean tri‑neon styling and zero clutter.
 */

import React, { useState, useMemo } from "react";

export function CommandPalette({ engine }) {
    const [query, setQuery] = useState("");

    const commands = useMemo(() => {
        const all = engine.getCommands(); // [{ id, label, action }]
        if (!query.trim()) return all;
        return all.filter(cmd =>
            cmd.label.toLowerCase().includes(query.toLowerCase())
        );
    }, [query, engine]);

    return (
        <div style={styles.container}>
            {/* Search bar */}
            <input
                autoFocus
                style={styles.input}
                placeholder="Type a command..."
                value={query}
                onChange={e => setQuery(e.target.value)}
            />

            {/* Command list */}
            <div style={styles.list}>
                {commands.map(cmd => (
                    <div
                        key={cmd.id}
                        style={styles.item}
                        onClick={() => {
                            engine.runCommand(cmd.id);
                            engine.closeCommandPalette();
                        }}
                    >
                        {cmd.label}
                    </div>
                ))}

                {commands.length === 0 && (
                    <div style={styles.empty}>No matching commands</div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        gap: "8px"
    },
    input: {
        width: "100%",
        padding: "10px 12px",
        borderRadius: "8px",
        border: "1px solid #b37bff",
        background: "transparent",
        color: "#e8e8f0",
        fontSize: "15px",
        outline: "none",
        caretColor: "#b37bff"
    },
    list: {
        display: "flex",
        flexDirection: "column",
        maxHeight: "300px",
        overflowY: "auto",
        gap: "4px"
    },
    item: {
        padding: "10px 12px",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "all 120ms ease",
        background: "rgba(255,255,255,0.03)"
    },
    empty: {
        padding: "12px",
        textAlign: "center",
        opacity: 0.6
    }
};
