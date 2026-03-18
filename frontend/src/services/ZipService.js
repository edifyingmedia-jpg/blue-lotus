// frontend/src/services/ZipService.js

/**
 * ZipService.js
 * -------------
 * Takes the exported app structure and converts it into
 * a flat list of { path, content } entries that can be
 * zipped by any zip library (browser or server).
 */

export function flattenExportToFiles(exportBundle) {
    const files = [];

    // Frontend files
    Object.entries(exportBundle.frontend).forEach(([path, content]) => {
        files.push({
            path: `frontend/${path}`,
            content
        });
    });

    // Backend files
    Object.entries(exportBundle.backend).forEach(([path, content]) => {
        files.push({
            path: `backend/${path}`,
            content
        });
    });

    // Blueprint + manifest
    files.push({
        path: "blueprint.json",
        content: JSON.stringify(exportBundle.blueprint, null, 2)
    });

    files.push({
        path: "manifest.json",
        content: JSON.stringify(exportBundle.manifest, null, 2)
    });

    return files;
}
