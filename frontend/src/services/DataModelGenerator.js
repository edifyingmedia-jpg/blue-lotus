// frontend/src/services/DataModelGenerator.js

/**
 * DataModelGenerator.js
 * ---------------------
 * Derives data models from the DocumentModel.
 *
 * This first version is intentionally simple:
 *  - Scans scene content for "model:" blocks
 *  - Extracts field definitions
 *  - Produces a structured data model list
 *
 * Example syntax inside a scene:
 *
 *   model: Character
 *   name: string
 *   age: number
 *   role: string
 *
 */

export function generateDataModels(documentModel) {
    const scenes = documentModel.getScenes();
    const models = [];

    scenes.forEach(scene => {
        const blocks = scene.content.split("\n");

        let currentModel = null;

        blocks.forEach(line => {
            const trimmed = line.trim();

            // Start of a model
            if (trimmed.startsWith("model:")) {
                if (currentModel) {
                    models.push(currentModel);
                }

                const name = trimmed.replace("model:", "").trim();
                currentModel = {
                    name,
                    fields: []
                };
                return;
            }

            // Field definition
            if (currentModel && trimmed.includes(":")) {
                const [field, type] = trimmed.split(":").map(s => s.trim());
                currentModel.fields.push({ field, type });
            }
        });

        // Push last model in scene
        if (currentModel) {
            models.push(currentModel);
        }
    });

    return models;
}
