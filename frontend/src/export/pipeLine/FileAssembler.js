// frontend/src/export/pipeline/FileAssembler.js

/**
 * FileAssembler
 * ---------------------------------------------------------
 * Combines screens, components, and runtime exports into a
 * single assembled structure. This becomes the "app" bundle
 * inside the final export.
 */

export default class FileAssembler {
  static assemble({ screens, components, runtime }) {
    return {
      screens: screens || {},
      components: components || {},
      runtime: runtime || {},
      generatedAt: new Date().toISOString()
    };
  }
}
