/**
 * StateCotext.js
 * ----------------------------------------------------
 * React context for exposing global runtime state
 * to components without prop drilling.
 *
 * This context is used by:
 * - components that need global state
 * - bindings
 * - computed values
 */

import React, { createContext, useContext } from "react";
import StateEngine from "./StateEngine";

const StateContext = createContext(StateEngine.state);

export function StateProvider({ children }) {
  const [state, setState] = React.useState(StateEngine.state);

  React.useEffect(() => {
    const unsubscribe = StateEngine.subscribe((newState) => {
      setState({ ...newState });
    });
    return unsubscribe;
  }, []);

  return (
    <StateContext.Provider value={state}>
      {children}
    </StateContext.Provider>
  );
}

export function useStateContext() {
  return useContext(StateContext);
}

export default StateContext;
