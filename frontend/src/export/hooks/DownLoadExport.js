// frontend/src/export/hooks/useDownloadExport.js

/**
 * useDownloadExport
 * ---------------------------------------------------------
 * Provides a clean way for the UI to download the final
 * export bundle as a .zip or .json file.
 *
 * This hook does NOT run the export pipeline — it only
 * handles the download behavior once the bundle exists.
 */

import { useCallback } from "react";

export function useDownloadExport() {
  /**
   * downloadBundle
   * -------------------------------------------------------
   * Accepts the final export bundle and triggers a browser
   * download using a Blob.
   *
   * @param {Object} bundle - The final export bundle
   * @param {string} filename - The desired download filename
   */
  const downloadBundle = useCallback((bundle, filename = "blue-lotus-export.json") => {
    if (!bundle) {
      throw new Error("useDownloadExport: Missing bundle");
    }

    const data = JSON.stringify(bundle, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  }, []);

  return {
    downloadBundle,
  };
}
