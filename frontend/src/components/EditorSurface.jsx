// frontend/src/components/EditorSurface.jsx

/**
 * EditorSurface.jsx
 * ---------------------------------------------------------
 * The cinematic visual root of the Blue Lotus editor.
 * Wraps:
 *  - SceneList (left panel)
 *  - SceneEditor (main writing surface)
 *  - CommandPalette (overlay)
 *
 * Adds:
 *  - Responsive layout
 *  - Neon-ready class hooks
 *  - Emotionally intelligent transitions
 *  - Future-proof panel structure
 */

import React from "react";
import "./EditorSurface.css";

import { SceneList } from "./SceneList";
import { SceneEditor } from "./SceneEditor";
import { CommandPalette } from "./CommandPalette";

export function EditorSurface({ engine }) {
    const { scenes, activeSceneId, commandPaletteOpen } = engine.state;

    return (
        <div className="editor-root neon-surface">
            
            {/* Left panel: Scene navigation */}
            <aside className="scene-list-panel">
                <SceneList
                    scenes={scenes}
                    activeSceneId={activeSceneId}
                    onSelect={(id) => engine.setActiveScene(id)}
                />
            </aside>

            {/* Main editor area */}
            <main className="scene-editor-panel">
                <SceneEditor
                    scene={engine.getActiveScene()}
                    onChange={(content) =>
                        engine.updateSceneContent(activeSceneId, content)
                    }
                />
            </main>

            {/* Command palette overlay */}
            {commandPaletteOpen && (
                <div className="command-palette-overlay fade-in">
                    <CommandPalette engine={engine} />
                </div>
            )}
        </div>
    );
}
