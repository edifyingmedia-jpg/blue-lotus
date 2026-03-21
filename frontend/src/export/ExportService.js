// frontend/src/export/ExportService.js

/**
 * ExportService
 * ---------------------------------------------------------
 * Public-facing API for the export subsystem.
 * The Builder UI calls this service instead of touching
 * pipeline internals directly.
 */

import {
  ExportEngine,
  ExportContext,
} from "./pipeLine";

/**
 * exportProject
 * ---------------------------------------------------------
 * Runs the full export pipeline and returns the final bundle.
 *
 * @param {Object} projectState - The full project definition
 * @returns {Promise<Object>} - The assembled export bundle
 */
export async function exportProject(projectState) {
  if (!projectState) {
    throw new Error("ExportService: Missing projectState");
  }

  // Create context
  const context = new ExportContext(projectState);

  // Run the engine
  const engine = new ExportEngine(context);
  const result = await engine.run();

  if (!result || !result.bundle) {
    throw new Error("ExportService: Export pipeline returned no bundle");
  }

  return result.bundle;
}
