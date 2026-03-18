// frontend/src/services/AppBlueprintGenerator.js

/**
 * AppBlueprintGenerator.js
 * ------------------------
 * Converts the DocumentModel into a structured app blueprint.
 * This blueprint is the intermediate representation used by:
 *  - CodeGenerator (frontend)
 *  - BackendGenerator (API + DB)
 *  - ExportService (download/deploy)
 *
 * The blueprint is deterministic, stable, and fully serializable.
 */

export function generateAppBlueprint(documentModel) {
    const project = documentModel.getProject();
    const scenes = documentModel.getScenes();

    return {
        id: project.id,
        name: project.title || "Untitled App",
        version: 1,

        // High-level metadata
        metadata: {
            createdAt: project.createdAt || Date.now(),
            updatedAt: Date.now()
        },

        // Pages = scenes
        pages: scenes.map(sceneToPage),

        // Navigation structure
        navigation: buildNavigation(scenes),

        // Data models (future expansion)
        dataModels: [],

        // Global settings
        settings: {
            theme: "dark",
            layout: "standard"
        }
    };
}

/**
 * Convert a scene into a page definition
 */
function sceneToPage(scene) {
    return {
        id: scene.id,
        name: scene.title || "Untitled",
        route: "/" + slugify(scene.title || "untitled"),
        content: parseSceneContent(scene.content)
    };
}

/**
 * Build a simple navigation structure
 */
function buildNavigation(scenes) {
    return scenes.map(scene => ({
        id: scene.id,
        title: scene.title,
        route: "/" + slugify(scene.title)
    }));
}

/**
 * Parse scene content into structured blocks
 * (This is intentionally simple and deterministic)
 */
function parseSceneContent(content) {
    if (!content) return [];

    return content
        .split("\n\n")
        .map((block, index) => ({
            id: `block-${index}`,
            type: "text",
            value: block.trim()
        }));
}

/**
 * Convert a title into a URL-safe slug
 */
function slugify(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
