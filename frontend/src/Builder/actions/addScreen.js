// frontend/src/Builder/actions/addScreen.js

/**
 * addScreen
 * ---------------------------------------------------------
 * Creates a new screen and selects it.
 */

export function addScreen(updateBuilderState) {
  updateBuilderState((prev) => {
    const newScreen = {
      id: crypto.randomUUID(),
      name: `Screen ${prev.screens.length + 1}`,
      components: [],
    };

    const screens = [...prev.screens, newScreen];

    return {
      ...prev,
      screens,
      activeScreenIndex: screens.length - 1,
      metadata: {
        ...prev.metadata,
        updatedAt: Date.now(),
      },
    };
  });
}
