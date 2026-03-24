/**
 * useRuntimeDataBindings.js
 * ----------------------------------------------------
 * React hook that provides components with access to
 * runtime data bindings (state, props, computed values).
 *
 * This hook listens to StateEngine updates and returns
 * the resolved binding values for the component.
 */

import { useState, useEffect } from "react";
import createBindings from "./bindings";
import StateEngine from "./StateEngine";

export default function useRuntimeDataBindings(componentId, props = {}) {
  const [bindings, setBindings] = useState(() =>
    createBindings(componentId, props)
  );

  useEffect(() => {
    // Subscribe to state changes
    const unsubscribe = StateEngine.subscribe(() => {
      const updated = createBindings(componentId, props);
      setBindings(updated);
    });

    return () => unsubscribe && unsubscribe();
  }, [componentId, props]);

  return bindings;
}
