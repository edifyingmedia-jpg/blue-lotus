/**
 * StateLoader.js
 * ----------------------------------------------------
 * Loads initial state values from the project definition.
 *
 * This is used by:
 * - RuntimeEngine (during app startup)
 * - StateEngine (for initial hydration)
 *
 * The loader is intentionally simple and synchronous.
 */

import project from "../../project";
import StateEngine from "./StateEngine";
import Reducer from "./Reducer";

class StateLoader {
  /**
   * Load initial state from the project definition.
   */
  load() {
    const initialState = project?.state || {};

    // Apply each initial state value through the reducer
    Object.entries(initialState).forEach(([key, value]) => {
      const reduced = Reducer(undefined, value);
      StateEngine.set(key, reduced);
    });

    return StateEngine.state;
  }
}

const loader = new StateLoader();
export default loader;
