// frontend/src/components/SceneEditor.jsx

/**
 * SceneEditor.jsx
 * ---------------
 * The main writing surface of the Blue Lotus editor.
 * Clean, cinematic, tri‑neon aligned, and fully wired
 * into the engine's update flow.
 */

import React from "react";

export function SceneEditor({ scene, onChange }) {
    if (!scene) {
        return (
            <div style={styles.empty}>
                <div style={styles.emptyTitle}>No scene selected</div>
                <div style={styles.emptySubtitle}>
                    Choose a scene from the left panel to begin editing.
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <textarea
                style={styles.textarea}
                value={scene.content}
                onChange={e => onChange(e.target.value)}
                placeholder="Start writing your scene..."
            />
        </div>
    );
}

const styles = {
    container: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column"
    },
    textarea: {
        flex: 1,
        width: "100%",
        height: "100%",
        background: "transparent",
        border: "none",
        outline: "none",
        resize: "none",
        color: "#e8e8f0",
        fontSize: "18px",
        lineHeight: "1.6",
        padding: "12px 4px",
        fontFamily: "Inter, sans-serif",
        caretColor: "#b37bff",
        transition: "background 160ms ease"
    },
    empty: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#9a9ab3"
    },
    emptyTitle: {
        fontSize: "20px",
        fontWeight: 600,
        marginBottom: "6px",
        color: "#b37bff"
    },
    emptySubtitle: {
        fontSize: "14px",
        opacity: 0.7
    }
};
