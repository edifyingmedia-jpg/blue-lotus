// frontend/src/services/ExportService.js

/**
 * ExportService.js
 * ----------------
 * Combines:
 *  - App Blueprint
 *  - Frontend Code
 *  - Backend Code
 *
 * Produces a single exportable structure that can be zipped,
 * downloaded, or deployed.
 */

import { generateAppBlueprint } from "./AppBlueprintGenerator";
import { generateFrontendCode } from "./CodeGenerator";
import { generateBackendCode } from "./BackendGenerator";

export async function exportFullApp(documentModel) {
    // 1. Generate blueprint
    const blueprint = generateAppBlueprint(documentModel);

    // 2. Generate frontend + backend code
    const frontend = generateFrontendCode(blueprint);
    const backend = generateBackendCode(blueprint);

    // 3. Combine into a single export structure
    return {
        blueprint,
        frontend,
        backend,
        manifest: {
            name: blueprint.name,
            version: blueprint.version,
            generatedAt: Date.now(),
            files: {
                frontend: Object.keys(frontend),
                backend: Object.keys(backend)
            }
        }
    };
}
