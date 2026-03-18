// frontend/src/components/EditorSurface.jsx

/**
 * EditorSurface.jsx
 * -----------------
 * The visual root of the Blue Lotus editor.
 * Applies the cinematic tri‑neon styling and wraps:
 *  - SceneList
 *  - SceneEditor
 *  - CommandPalette
 */

import React from "react";
import "./EditorSurface.css";

import { SceneList } from "./SceneList";
import { SceneEditor } from "./SceneEditor";
import { CommandPalette } from "./CommandPalette";

export function EditorSurface({ engine }) {
    const { scenes, activeSceneId } = engine.state;

    return (
        <div className="editor-root">
            {/* Left panel: Scenes */}
            <div className="scene-list">
                <SceneList
                    scenes={scenes}
                    activeSceneId={activeSceneId}
                    onSelect={id => engine.setActiveScene(id)}
                />
            </div>

            {/* Main editor area */}
            <div className="scene-editor">
                <SceneEditor
                    scene={engine.getActiveScene()}
                    onChange={content => engine.updateSceneContent(activeSceneId, content)}
                />
            </div>

            {/* Command palette overlay */}
            {engine.state.commandPaletteOpen && (
                <div className="command-palette fade-in">
                    <CommandPalette engine={engine} />
                </div>
            )}
        </div>
    );
}
