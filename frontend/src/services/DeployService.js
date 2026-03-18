// frontend/src/services/DeployService.js

/**
 * DeployService.js
 * ----------------
 * Takes the flattened export file list and prepares a
 * deployment-ready payload.
 *
 * This payload can be:
 *  - zipped
 *  - uploaded to a deployment provider
 *  - stored for later publishing
 */

export function prepareDeploymentPayload(files) {
    // Normalize file entries
    const normalized = files.map(file => ({
        path: sanitizePath(file.path),
        content: file.content
    }));

    return {
        createdAt: Date.now(),
        fileCount: normalized.length,
        files: normalized
    };
}

/**
 * Ensure paths are safe and consistent
 */
function sanitizePath(path) {
    return path
        .replace(/\\/g, "/")
        .replace(/^\//, "")
        .trim();
}
