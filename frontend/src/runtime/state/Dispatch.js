// frontend/src/runtime/state/Dispatch.js

/**
 * Dispatch
 * ---------------------------------------------------------
 * Connects actions to the reducer + StateManager.
 *
 * Responsibilities:
 * - Accept an action object
 * - Run reducer(state, action)
 * - Update StateManager with the new state
 * - Return the updated state for convenience
 */

export default function createDispatch(stateManager, reducer) {
  return function dispatch(action) {
    if (!action || typeof action.type !== "string") {
      console.warn("Dispatch: Invalid action:", action);
      return stateManager.getState();
    }

    const prevState = stateManager.getState();
    const nextState = reducer(prevState, action);

    // Reducer must always return a new object
    if (nextState === prevState) {
      console.warn("Reducer returned the same state object. Check immutability.");
    }

    stateManager.setState(nextState);
    return nextState;
  };
}
