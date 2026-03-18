// frontend/src/components/SceneList.jsx

/**
 * SceneList.jsx
 * ---------------------------------------------------------
 * Cinematic tri‑neon scene navigator.
 * Displays all scenes, highlights the active one,
 * and emits selection events to the engine.
 */

import React from "react";
import "./SceneList.css";

export function SceneList({ scenes, activeSceneId, onSelect }) {
    return (
        <div className="scene-list-root">
            {scenes.map(scene => (
                <div
                    key={scene.id}
                    className={
                        "scene-list-item" +
                        (scene.id === activeSceneId ? " scene-list-item-active" : "")
                    }
                    onClick={() => onSelect(scene.id)}
                >
                    <div className="scene-list-title">{scene.title}</div>
                    <div className="scene-list-subtitle">
                        {scene.content?.length
                            ? `${scene.content.length} chars`
                            : "Empty scene"}
                    </div>
                </div>
            ))}

            {scenes.length === 0 && (
                <div className="scene-list-empty">
                    No scenes yet. Create one to begin.
                </div>
            )}
        </div>
    );
}
