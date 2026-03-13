// frontend/src/runtime/engine/useActionHandler.js

import { useCallback } from "react";
import ActionEngine from "./ActionEngine";

/**
 * useActionHandler
 * ---------------------------------------------------------
 * Connects components to the ActionEngine.
 * - Normalizes null/undefined actions
 * - Returns a stable callback
 * - Supports passing values (e.g., Input, TextArea)
 */

export default function useActionHandler(action) {
  const { run } = ActionEngine();

  return useCallback(
    (value) => {
      if (!action) return;
      run(action, value);
    },
    [action, run]
  );
}
