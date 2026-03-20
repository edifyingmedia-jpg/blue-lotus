// frontend/src/runtime/state/index.js

/**
 * State Module Exports
 * ---------------------------------------------------------
 * Central export surface for the runtime state system.
 * Exposes:
 * - StateManager
 * - Reducer
 * - createDispatch
 * - StateProvider + useStateContext
 */

export { default as StateManager } from "./StateManager";
export { default as Reducer } from "./Reducer";
export { default as createDispatch } from "./Dispatch";
export {
  StateProvider,
  useStateContext,
  StateContext,
} from "./StateContext";
