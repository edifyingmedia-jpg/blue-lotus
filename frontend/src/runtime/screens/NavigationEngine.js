// frontend/src/runtime/screens/NavigationEngine.js

/**
 * NavigationEngine.js
 * ---------------------------------------------------------
 * Provides navigation helpers for runtime components.
 *
 * Responsibilities:
 *  - Wrap ScreenEngine navigation
 *  - Expose a clean API for components
 *  - Prepare for future navigation modes (stack, tabs, modals)
 */

import { useScreenEngine } from "../resolver/ScreenEngine";

export default function useNavigation() {
  const { navigate, activeScreenId, screens } = useScreenEngine();

  /**
   * Navigate to a screen by ID
   */
  function go(screenId) {
    navigate(screenId);
  }

  /**
   * Navigate to the first screen in the project
   */
  function goHome() {
    if (screens.length > 0) {
      navigate(screens[0].id);
    }
  }

  /**
   * Reload the current screen
   */
  function reload() {
    navigate(activeScreenId);
  }

  return {
    go,
    goHome,
    reload,
    activeScreenId,
  };
}
