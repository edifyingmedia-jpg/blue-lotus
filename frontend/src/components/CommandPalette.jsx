// frontend/src/components/CommandPalette.jsx

/**
 * CommandPalette.jsx
 * ------------------
 * A real, functional command palette for Blue Lotus.
 * - Opens with a parent trigger
 * - Filters commands as the user types
 * - Executes the selected command
 */

import React, { useEffect, useState } from "react";

export function CommandPalette({ isOpen, commands, onClose }) {
    const [query, setQuery] = useState("");
    const [filtered, setFiltered] = useState(commands);

    useEffect(() => {
        if (isOpen) {
            setQuery("");
            setFiltered(commands);
        }
    }, [isOpen, commands]);

    useEffect(() => {
        const q = query.toLowerCase();
        setFiltered(
            commands.filter(cmd =>
                cmd.name.toLowerCase().includes(q)
            )
        );
    }, [query, commands]);

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div style={styles.overlay} onKeyDown={handleKeyDown} tabIndex={0}>
            <div style={styles.container}>
                <input
                    style={styles.input}
                    placeholder="Type a command..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                />

                <div style={styles.list}>
                    {filtered.map((cmd) => (
                        <div
                            key={cmd.id}
                            style={styles.item}
                            onClick={() => {
                                cmd.action();
                                onClose();
                            }}
                        >
                            {cmd.name}
                        </div>
                    ))}

                    {filtered.length === 0 && (
                        <div style={styles.empty}>No commands found</div>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "10vh",
        zIndex: 9999
    },
    container: {
        width: "480px",
        background: "#111114",
        border: "1px solid #2a2a30",
        borderRadius: "8px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
    },
    input: {
        width: "100%",
        padding: "12px 16px",
        background: "#0d0d0f",
        color: "#e8e8f0",
        border: "none",
        outline: "none",
        fontSize: "16px"
    },
    list: {
        maxHeight: "300px",
        overflowY: "auto",
        background: "#0f0f12"
    },
    item: {
        padding: "12px 16px",
        cursor: "pointer",
        color: "#c8c8d0",
        borderBottom: "1px solid #1c1c20"
    },
    empty: {
        padding: "12px 16px",
        color: "#666"
    }
};
