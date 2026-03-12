import { useCallback } from "react";
import { useActionEngine } from "./ActionEngine";

/**
 * Hook: useActionHandler
 * - Wraps the Action Engine
 * - Normalizes null/undefined actions
 * - Returns a stable callback for components
 */

export default function useActionHandler(action) {
  const { runAction } = useActionEngine();

  return useCallback(() => {
    if (!action) return;
    runAction(action);
  }, [action, runAction]);
}
