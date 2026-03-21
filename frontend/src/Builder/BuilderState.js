// frontend/src/Builder/BuilderState.js

/**
 * BuilderState
 * ---------------------------------------------------------
 * Defines the canonical structure of the Builder's state.
 * This is the source of truth for the reducer and UI.
 */

export default function createInitialBuilderState() {
  return {
    screens: {},        // All screens in the project
    currentScreen: null, // ID of the active screen
    selected: null,      // ID of the selected component
  };
}
