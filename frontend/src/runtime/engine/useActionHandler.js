// frontend/src/runtime/engine/useActionHandler.js

import { useCallback } from "react";

/**
 * useActionHandler
 * ---------------------------------------------------------
 * Connects UI components to the ActionEngine via dispatch.
 *
 * Components call:
 *    onAction(type, payload)
 *
 * This hook wraps dispatch into a stable callback.
 */

export default function useActionHandler(dispatch) {
  return useCallback(
    (type, payload = {}) => {
      if (!type) return;

      dispatch({
        type,
        ...payload
      });
    },
    [dispatch]
  );
}
