// frontend/src/runtime/resolver/useRuntimeDataBindings.js

/**
 * useRuntimeDataBindings.js
 * ---------------------------------------------------------
 * Provides runtime-evaluated binding values for components.
 *
 * Responsibilities:
 *  - Evaluate DocumentModel.bindings
 *  - Expose dynamic values to resolveProps()
 *  - Integrate with runtime state + actions
 */

import { useState, useEffect } from "react";
import { useRuntimeState } from "../state/StateEngine";
import { useActionEngine } from "../actions/ActionEngine";

export default function useRuntimeDataBindings(bindingMap = {}) {
  const state = useRuntimeState();
  const actions = useActionEngine();

  const [resolved, setResolved] = useState({});

  useEffect(() => {
    const output = {};

    for (const key of Object.keys(bindingMap)) {
      const binding = bindingMap[key];

      // Static value
      if (binding?.value !== undefined) {
        output[key] = binding.value;
        continue;
      }

      // State binding: { state: "user.name" }
      if (binding?.state) {
        output[key] = getPath(state, binding.state);
        continue;
      }

      // Action binding: { action: "logout" }
      if (binding?.action) {
        output[key] = actions[binding.action] || null;
        continue;
      }

      // Unsupported binding type
      output[key] = null;
    }

    setResolved(output);
  }, [state, actions, bindingMap]);

  return resolved;
}

/**
 * Resolve a deep path like "user.profile.name"
 */
function getPath(obj, path) {
  if (!obj || !path) return null;

  const parts = path.split(".");
  let current = obj;

  for (const part of parts) {
    if (current && Object.prototype.hasOwnProperty.call(current, part)) {
      current = current[part];
    } else {
      return null;
    }
  }

  return current;
}
