// frontend/src/runtime/useRuntimeDataBindings.js

/**
 * useRuntimeDataBindings.js
 * ---------------------------------------------------------
 * React hook that resolves dynamic bindings inside component props.
 *
 * This is the glue between:
 *  - DocumentModel (screen-level bindings)
 *  - StateEngine (global reactive state)
 *  - ActionDispatcher (action results)
 *  - resolveProps / resolveBinding (expression resolver)
 *
 * It ensures that any {{ ... }} expression inside props is
 * resolved into a real value before the component renders.
 */

import { useMemo } from "react";
import { resolveProps } from "./bindings";
import StateEngine from "./StateEngine";
import ActionDispatcher from "./ActionDispatcher";

/**
 * Hook: useRuntimeDataBindings
 *
 * @param {object} rawProps - The component's original props from DocumentModel
 * @param {object} screenBindings - The bindings defined on the current screen
 */
export default function useRuntimeDataBindings(rawProps, screenBindings) {
  // Pull reactive state
  const state = StateEngine.useState(); // subscribes to state changes

  // Pull action results (reactive)
  const actions = ActionDispatcher.useActionResults();

  /**
   * Resolve all dynamic expressions inside props.
   * Memoized so components only re-render when dependencies change.
   */
  const resolvedProps = useMemo(() => {
    return resolveProps(rawProps, {
      state,
      bindings: screenBindings || {},
      actions,
    });
  }, [rawProps, state, screenBindings, actions]);

  return resolvedProps;
}
