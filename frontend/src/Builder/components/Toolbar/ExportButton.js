// frontend/src/Builder/components/Toolbar/ExportButton.js

/**
 * ExportButton
 * ---------------------------------------------------------
 * UI button for triggering the export flow from the Builder.
 */

import React from "react";
import { createExportActions } from "@/Builder/actions";
import { useBuilderExport } from "@/Builder/hooks/useBuilderExport";

export function ExportButton({ builderState }) {
  const exportApi = useBuilderExport(builderState);
  const actions = createExportActions({ builderState, exportApi });

  const handleExport = async () => {
    try {
      await actions.runExport();
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  const handleDownload = () => {
    try {
      actions.downloadExport();
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <div className="export-button">
      <button
        onClick={handleExport}
        disabled={actions.isExporting}
      >
        {actions.isExporting ? "Exporting..." : "Export"}
      </button>

      {actions.bundle && (
        <button onClick={handleDownload}>
          Download
        </button>
      )}

      {actions.error && (
        <div className="export-error">
          Export failed — check console for details.
        </div>
      )}
    </div>
  );
}
