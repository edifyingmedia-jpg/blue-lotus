// frontend/src/runtime/editor/EditorBootstrap.js

/**
 * EditorBootstrap.js
 * ------------------
 * Connects the EditorEngine + DocumentModel to the UI layer.
 * Responsible for initializing the editor surface, wiring events,
 * and preparing the runtime environment for interaction.
 */

import { EditorSurface } from "./EditorSurface";

export class EditorBootstrap {
    constructor({ engine, project, documentModel }) {
        this.engine = engine;
        this.project = project;
        this.documentModel = documentModel;

        // Initialize the UI surface
        this.surface = new EditorSurface({
            engine: this.engine,
            documentModel: this.documentModel
        });

        // Wire engine events to UI
        this._bindEngineEvents();

        // Mount UI
        this.surface.mount();
    }

    /**
     * Bind engine events to the UI surface
     */
    _bindEngineEvents() {
        this.engine.on("sceneUpdated", (scene) => {
            this.surface.updateScene(scene);
        });

        this.engine.on("sceneAdded", (scene) => {
            this.surface.addScene(scene);
        });

        this.engine.on("sceneRemoved", (sceneId) => {
            this.surface.removeScene(sceneId);
        });
    }

    /**
     * Expose the surface for external control
     */
    getSurface() {
        return this.surface;
    }
}
