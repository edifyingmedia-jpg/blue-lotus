// frontend/src/runtime/ProjectLoader.js

/**
 * ProjectLoader.js
 * ----------------
 * Handles:
 *   - creating new projects
 *   - loading existing projects
 *   - saving project state
 *   - bridging the engine with the DocumentModel
 */

import { Project } from "./DocumentModel";

export class ProjectLoader {
    constructor() {
        this.currentProject = null;
    }

    /**
     * Creates a brand new project with a default scene.
     */
    createNewProject(name = "Untitled Project") {
        const id = crypto.randomUUID();
        const project = new Project(id, name);

        // Add a default scene
        project.addScene("Main");

        this.currentProject = project;
        this.saveToLocalStorage();

        return project;
    }

    /**
     * Loads a project from localStorage.
     */
    loadFromLocalStorage() {
        const raw = localStorage.getItem("blue-lotus-project");
        if (!raw) return null;

        try {
            const data = JSON.parse(raw);
            const project = new Project(data.id, data.name);

            // Restore scenes
            for (const s of data.scenes) {
                const scene = project.addScene(s.name);
                scene.id = s.id;
                scene.content = s.content;
                scene.createdAt = s.createdAt;
                scene.updatedAt = s.updatedAt;
            }

            project.metadata = data.metadata;
            project.createdAt = data.createdAt;
            project.updatedAt = data.updatedAt;

            this.currentProject = project;
            return project;
        } catch (err) {
            console.error("Failed to load project:", err);
            return null;
        }
    }

    /**
     * Saves the current project to localStorage.
     */
    saveToLocalStorage() {
        if (!this.currentProject) return;

        const data = JSON.stringify(this.currentProject);
        localStorage.setItem("blue-lotus-project", data);
    }

    /**
     * Returns the active project.
     */
    getProject() {
        return this.currentProject;
    }
}
