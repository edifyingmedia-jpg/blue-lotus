// frontend/src/export/pipeline/ExportContext.js

/**
 * ExportContext
 * ---------------------------------------------------------
 * Holds shared state for the export pipeline.
 * Passed through all pipeline stages (engine, bundler, writer).
 */

export default class ExportContext {
  constructor({ project, screens, components, runtime }) {
    this.project = project;       // Project metadata
    this.screens = screens;       // Screen registry
    this.components = components; // Component registry
    this.runtime = runtime;       // Runtime export surface

    this.bundle = {};             // Final assembled bundle
    this.logs = [];               // Pipeline logs
  }

  log(message) {
    const entry = `[EXPORT] ${message}`;
    this.logs.push(entry);
    console.log(entry);
  }

  setBundlePart(key, value) {
    this.bundle[key] = value;
  }

  getBundle() {
    return this.bundle;
  }
}
