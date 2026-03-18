// frontend/src/components/SceneList.jsx

/**
 * SceneList.jsx
 * -------------
 * A real, functional scene list UI component.
 * Displays all scenes, highlights the active one,
 * and notifies the parent when a scene is selected.
 */

import React from "react";

export function SceneList({ scenes, activeSceneId, onSelect }) {
    return (
        <div style={styles.container}>
            {scenes.map(scene => (
                <div
                    key={scene.id}
                    style={{
                        ...styles.item,
                        ...(scene.id === activeSceneId ? styles.active : {})
                    }}
                    onClick={() => onSelect(scene.id)}
                >
                    <div style={styles.title}>{scene.title}</div>
                </div>
            ))}
        </div>
    );
}

const styles = {
    container: {
        width: "240px",
        background: "#0f0f12",
        borderRight: "1px solid #1c1c20",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        padding: "8px 0"
    },
    item: {
        padding: "12px 16px",
        cursor: "pointer",
        color: "#c8c8d0",
        fontSize: "14px",
        borderBottom: "1px solid #1c1c20"
    },
    active: {
        background: "#1a1a1f",
        color: "#ffffff",
        fontWeight: "bold"
    },
    title: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    }
};
