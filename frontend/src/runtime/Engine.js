// frontend/src/runtime/Engine.js

/**
 * Engine.js
 * ---------
 * The core runtime engine for Blue Lotus.
 * Handles:
 *   - project loading
 *   - scene management
 *   - editor mode
 *   - update cycle
 *   - status reporting
 */

import { ProjectLoader } from "./ProjectLoader";

export class Engine {
    constructor() {
        this.loader = new ProjectLoader();
        this.state = {
            mode: "edit", // future: "preview", "ai", "design"
            status: "idle", // "idle", "saving", "dirty"
            activeSceneId: null
        };

        // Load or create a project
        const project = this.loader.loadFromLocalStorage();
        if (project) {
            this.project = project;
            this.state.activeSceneId = project.scenes[0]?.id || null;
        } else {
            this.project = this.loader.createNewProject("New Project");
            this.state.activeSceneId = this.project.scenes[0].id;
        }
    }

    /**
     * Returns the active scene object.
     */
    getActiveScene() {
        return this.project.getScene(this.state.activeSceneId);
    }

    /**
     * Switches the active scene.
     */
    setActiveScene(id) {
        if (this.project.getScene(id)) {
            this.state.activeSceneId = id;
        }
    }

    /**
     * Updates the content of the active scene.
     */
    updateSceneContent(id, content) {
        this.state.status = "dirty";
        this.project.updateSceneContent(id, content);
        this.save();
    }

    /**
     * Saves the project to localStorage.
     */
    save() {
        this.state.status = "saving";
        this.loader.saveToLocalStorage();
        this.state.status = "idle";
    }

    /**
     * Returns the engine's current status.
     */
    getStatus() {
        return this.state.status;
    }
}
