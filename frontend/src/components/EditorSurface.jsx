// frontend/src/components/EditorSurface.jsx

/**
 * EditorSurface.jsx
 * ---------------------------------------------------------
 * The visual workspace of the Blue Lotus editor.
 * Hosts:
 *  - SceneList (left panel)
 *  - SceneEditor (main surface)
 *  - CommandPalette (overlay)
 */

import React from "react";
import "./EditorSurface.css";

import SceneList from "./SceneList";
import SceneEditor from "./SceneEditor";
import CommandPalette from "./CommandPalette";

export default function EditorSurface({ scenes, currentScene, state, dispatch }) {
    return (
        <div className="editor-root neon-surface">

            {/* Left panel: Scene navigation */}
            <aside className="scene-list-panel">
                <SceneList
                    scenes={scenes}
                    currentScene={currentScene}
                    dispatch={dispatch}
                />
            </aside>

            {/* Main editor area */}
            <main className="scene-editor-panel">
                <SceneEditor
                    scene={currentScene}
                    state={state}
                    dispatch={dispatch}
                />
            </main>

            {/* Command palette overlay */}
            {state.commandPaletteOpen && (
                <div className="command-palette-overlay fade-in">
                    <CommandPalette
                        state={state}
                        dispatch={dispatch}
                    />
                </div>
            )}
        </div>
    );
}
