// frontend/src/Builder/hooks/useBuilderExport.js

/**
 * useBuilderExport
 * ---------------------------------------------------------
 * Builder-level hook that connects the Builder's project
 * state to the export subsystem.
 *
 * This is the hook the Builder UI will use when the user
 * clicks the Export button.
 */

import { useCallback } from "react";
import { useExport } from "@/export/hooks/useExport";
import { useDownloadExport } from "@/export/hooks/useDownloadExport";

export function useBuilderExport(builderState) {
  const {
    isExporting,
    error,
    bundle,
    runExport,
  } = useExport();

  const { downloadBundle } = useDownloadExport();

  /**
   * exportCurrentProject
   * -------------------------------------------------------
   * Runs the export pipeline using the Builder's current
   * project state.
   */
  const exportCurrentProject = useCallback(async () => {
    if (!builderState) {
      throw new Error("useBuilderExport: Missing builderState");
    }

    const result = await runExport(builderState);
    return result;
  }, [builderState, runExport]);

  /**
   * downloadCurrentBundle
   * -------------------------------------------------------
   * Downloads the most recent export bundle.
   */
  const downloadCurrentBundle = useCallback(() => {
    if (!bundle) {
      throw new Error("useBuilderExport: No bundle available to download");
    }

    downloadBundle(bundle, "blue-lotus-export.json");
  }, [bundle, downloadBundle]);

  return {
    isExporting,
    error,
    bundle,
    exportCurrentProject,
    downloadCurrentBundle,
  };
}
