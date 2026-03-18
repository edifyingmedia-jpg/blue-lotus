// frontend/src/components/Toolbar.jsx

/**
 * Toolbar.jsx
 * -----------
 * A real, functional toolbar for the Blue Lotus editor.
 * Provides actions for:
 *  - Adding a scene
 *  - Deleting the active scene
 *  - Renaming a scene
 *  - Triggering the command palette
 */

import React from "react";

export function Toolbar({
    activeScene,
    onAddScene,
    onDeleteScene,
    onRenameScene,
    onOpenCommandPalette
}) {
    return (
        <div style={styles.container}>
            <div style={styles.left}>
                <button style={styles.button} onClick={onAddScene}>
                    + Add Scene
                </button>

                <button
                    style={{
                        ...styles.button,
                        ...(activeScene ? {} : styles.disabled)
                    }}
                    onClick={() => activeScene && onDeleteScene(activeScene.id)}
                    disabled={!activeScene}
                >
                    Delete
                </button>

                <button
                    style={{
                        ...styles.button,
                        ...(activeScene ? {} : styles.disabled)
                    }}
                    onClick={() =>
                        activeScene &&
                        onRenameScene(activeScene.id, prompt("New name:"))
                    }
                    disabled={!activeScene}
                >
                    Rename
                </button>
            </div>

            <div style={styles.right}>
                <button style={styles.button} onClick={onOpenCommandPalette}>
                    Commands
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        width: "100%",
        height: "48px",
        background: "#111114",
        borderBottom: "1px solid #1c1c20",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 12px"
    },
    left: {
        display: "flex",
        gap: "8px"
    },
    right: {
        display: "flex",
        gap: "8px"
    },
    button: {
        padding: "6px 12px",
        background: "#1a1a1f",
        color: "#e8e8f0",
        border: "1px solid #2a2a30",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "14px"
    },
    disabled: {
        opacity: 0.4,
        cursor: "not-allowed"
    }
};
