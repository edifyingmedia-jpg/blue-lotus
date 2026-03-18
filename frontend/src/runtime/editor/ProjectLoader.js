// frontend/src/runtime/editor/ProjectLoader.js

import { EditorBootstrap } from "./EditorBootstrap";
import { EditorEngine } from "./EditorEngine";
import { loadProjectById, loadScenesForProject } from "../../services/projectService";
import { createDocumentModel } from "../document/DocumentModel";

/**
 * ProjectLoader
 * -------------
 * Loads a project by ID, fetches its scenes + metadata,
 * constructs the DocumentModel, and boots the editor runtime.
 */
export class ProjectLoader {
    constructor({ projectId, onReady, onError }) {
        this.projectId = projectId;
        this.onReady = onReady;
        this.onError = onError;
    }

    async load() {
        try {
            // 1. Load project metadata
            const project = await loadProjectById(this.projectId);

            // 2. Load scenes
            const scenes = await loadScenesForProject(this.projectId);

            // 3. Build DocumentModel
            const documentModel = createDocumentModel({
                project,
                scenes
            });

            // 4. Initialize Editor Engine
            const engine = new EditorEngine({
                project,
                documentModel
            });

            // 5. Bootstrap the editor UI
            const bootstrap = new EditorBootstrap({
                engine,
                project,
                documentModel
            });

            // 6. Notify caller
            if (this.onReady) {
                this.onReady({
                    project,
                    scenes,
                    documentModel,
                    engine,
                    bootstrap
                });
            }

            return {
                project,
                scenes,
                documentModel,
                engine,
                bootstrap
            };

        } catch (err) {
            console.error("ProjectLoader failed:", err);
            if (this.onError) this.onError(err);
            throw err;
        }
    }
}
