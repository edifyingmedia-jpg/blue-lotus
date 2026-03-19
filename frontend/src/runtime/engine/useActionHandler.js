// frontend/src/runtime/engine/useActionHandler.js

/**
 * useActionHandler
 * ---------------------------------------------------------
 * Hook that connects UI components to the ActionDispatcher.
 * Components call `onAction(type, payload)` and this hook
 * forwards the action into the runtime dispatch loop.
 */

import { useCallback } from "react";

export default function useActionHandler(dispatch) {
  return useCallback(
    (type, payload = {}) => {
      dispatch({
        type,
        ...payload
      });
    },
    [dispatch]
  );
}
