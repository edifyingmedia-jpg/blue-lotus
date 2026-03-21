// frontend/src/export/hooks/useExport.js

/**
 * useExport
 * ---------------------------------------------------------
 * React hook wrapper for the ExportController.
 * Provides loading, error, and success states to the UI.
 */

import { useState, useCallback } from "react";
import { ExportController } from "../ExportController";

export function useExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);
  const [bundle, setBundle] = useState(null);

  const runExport = useCallback(async (projectState) => {
    setIsExporting(true);
    setError(null);
    setBundle(null);

    const controller = new ExportController({
      onStart: () => setIsExporting(true),
      onSuccess: (result) => setBundle(result),
      onError: (err) => setError(err),
    });

    try {
      const result = await controller.runExport(projectState);
      return result;
    } finally {
      setIsExporting(false);
    }
  }, []);

  return {
    isExporting,
    error,
    bundle,
    runExport,
  };
}
