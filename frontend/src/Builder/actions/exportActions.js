// frontend/src/Builder/actions/exportActions.js

/**
 * exportActions
 * ---------------------------------------------------------
 * Builder-level actions for triggering the export flow.
 * These actions are called by UI components (e.g., toolbar).
 */

export function createExportActions({ builderState, exportApi }) {
  if (!builderState) {
    throw new Error("exportActions: Missing builderState");
  }
  if (!exportApi) {
    throw new Error("exportActions: Missing exportApi");
  }

  const {
    exportCurrentProject,
    downloadCurrentBundle,
    isExporting,
    error,
    bundle,
  } = exportApi;

  return {
    /**
     * Trigger the export pipeline using the current builder state.
     */
    runExport: async () => {
      return await exportCurrentProject(builderState);
    },

    /**
     * Download the most recent export bundle.
     */
    downloadExport: () => {
      return downloadCurrentBundle();
    },

    /**
     * Expose state to the UI.
     */
    isExporting,
    error,
    bundle,
  };
}
