// frontend/src/services/PublishService.js

/**
 * PublishService.js
 * -----------------
 * Orchestrates the final step of the deployment pipeline.
 *
 * Responsibilities:
 *  - Take the export bundle
 *  - Flatten it into file entries
 *  - Prepare a deployment payload
 *  - Return a publishable artifact
 *
 * This does NOT upload to a provider yet — it produces the
 * final artifact that any deployment target can consume.
 */

import { flattenExportToFiles } from "./ZipService";
import { prepareDeploymentPayload } from "./DeployService";

export async function createPublishArtifact(exportBundle) {
    // 1. Flatten frontend + backend + blueprint
    const files = flattenExportToFiles(exportBundle);

    // 2. Prepare deployment payload
    const payload = prepareDeploymentPayload(files);

    // 3. Wrap in a publishable artifact
    return {
        type: "blue-lotus-app",
        name: exportBundle.manifest.name,
        version: exportBundle.manifest.version,
        generatedAt: Date.now(),
        payload
    };
}
