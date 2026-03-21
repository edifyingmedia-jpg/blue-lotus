// frontend/src/Builder/actions/screenActions.js

/**
 * screenActions
 * ---------------------------------------------------------
 * Actions for managing screens inside the Builder.
 */

export function selectScreen(updateBuilderState, index) {
  updateBuilderState({
    activeScreenIndex: index,
  });
}
