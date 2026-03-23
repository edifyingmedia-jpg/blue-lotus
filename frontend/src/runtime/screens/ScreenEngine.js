// frontend/src/runtime/screens/ScreenEngine.js

/**
 * ScreenEngine.js
 * ---------------------------------------------------------
 * Resolves runtime screen definitions.
 *
 * Responsibilities:
 *  - Load screen definitions by name
 *  - Validate screen structure
 *  - Normalize screen data for rendering
 *
 * This engine must remain deterministic and UI‑agnostic.
 */

import ScreenLoader from './ScreenLoader';

class ScreenEngine {
  load(screenName) {
    if (!screenName) return null;

    const screen = ScreenLoader.load(screenName);
    if (!screen) return null;

    return this.normalize(screen);
  }

  normalize(screen) {
    return {
      name: screen.name,
      layout: screen.layout || null,
      components: Array.isArray(screen.components)
        ? screen.components
        : [],
      metadata: screen.metadata || {},
    };
  }
}

const screenEngine = new ScreenEngine();
export default screenEngine;
