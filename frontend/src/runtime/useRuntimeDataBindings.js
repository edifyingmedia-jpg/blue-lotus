// frontend/src/runtime/useRuntimeDataBindings.js

import { useMemo } from "react";

/**
 * useRuntimeDataBindings
 *
 * The runtime data‑binding hook for Blue Lotus.
 *
 * Responsibilities:
 *  - Resolve static props
 *  - Resolve bound values from runtime state (future)
 *  - Provide a stable interface for ComponentResolver
 *
 * It does NOT:
 *  - invent data
 *  - simulate backend responses
 *  - mutate appDefinition
 *  - create placeholder values
 */
export default function useRuntimeDataBindings({ node, appState }) {
  return useMemo(() => {
    if (!node || !node.props) return {};

    const resolved = {};

    for (const [key, value] of Object.entries(node.props)) {
      // Static literal value
      if (typeof value !== "object" || value === null) {
        resolved[key] = value;
        continue;
      }

      // Future: dynamic binding object
      if (value.binding) {
        const boundValue = appState?.[value.binding];
        resolved[key] = boundValue ?? null;
        continue;
      }

      // Fallback: pass through raw object
      resolved[key] = value;
    }

    return resolved;
  }, [node, appState]);
}
