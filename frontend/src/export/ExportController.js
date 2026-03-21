// frontend/src/export/ExportController.js

/**
 * ExportController
 * ---------------------------------------------------------
 * Handles UI-facing export actions.
 * The UI calls this controller, not the service directly.
 *
 * Responsibilities:
 *  - Validate incoming project state
 *  - Trigger ExportService
 *  - Manage loading + error states
 *  - Return clean results to the UI
 */

import { exportProject } from "./ExportService";

export class ExportController {
  constructor(uiHandlers = {}) {
    this.onStart = uiHandlers.onStart || null;
    this.onSuccess = uiHandlers.onSuccess || null;
    this.onError = uiHandlers.onError || null;
  }

  /**
   * runExport
   * ---------------------------------------------------------
   * Executes the export flow and returns the final bundle.
   *
   * @param {Object} projectState - The full project definition
   * @returns {Promise<Object>} - The final export bundle
   */
  async runExport(projectState) {
    try {
      if (this.onStart) {
        this.onStart();
      }

      if (!projectState) {
        throw new Error("ExportController: Missing projectState");
      }

      const bundle = await exportProject(projectState);

      if (this.onSuccess) {
        this.onSuccess(bundle);
      }

      return bundle;
    } catch (err) {
      if (this.onError) {
        this.onError(err);
      }
      throw err;
    }
  }
}
