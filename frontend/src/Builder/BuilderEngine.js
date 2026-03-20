// frontend/src/Builder/BuilderEngine.js

/**
 * BuilderEngine
 * ---------------------------------------------------------
 * Central orchestrator for the Blue Lotus Builder.
 *
 * Responsibilities:
 *  - Initialize builder state
 *  - Provide BuilderContext to the UI
 *  - Expose builder actions (add/update/remove/select)
 *  - Integrate with ActionDispatcher + AI (TWIN)
 *  - Support undo/redo
 */

import React, { useReducer, useMemo } from "react";
import { BuilderProvider } from "./BuilderContext";
import {
  initialBuilderState,
  builderReducer
} from "./BuilderState";

export default function BuilderEngine({ children }) {
  const [state, dispatch] = useReducer(builderReducer, initialBuilderState);

  /**
   * Builder actions exposed to UI + AI
   */
  const actions = useMemo(() => {
    return {
      setProject(project) {
        dispatch({ type: "SET_PROJECT", project });
      },

      setComponents(components) {
        dispatch({ type: "SET_COMPONENTS", components });
      },

      addComponent(component) {
        dispatch({ type: "ADD_COMPONENT", component });
      },

      updateComponent(id, data) {
        dispatch({ type: "UPDATE_COMPONENT", id, data });
      },

      removeComponent(id) {
        dispatch({ type: "REMOVE_COMPONENT", id });
      },

      selectComponent(id) {
        dispatch({ type: "SELECT_COMPONENT", id });
      }
    };
  }, []);

  return (
    <BuilderProvider
      builderState={state}
      dispatch={dispatch}
      actions={actions}
      project={state.project}
    >
      {children}
    </BuilderProvider>
  );
}
