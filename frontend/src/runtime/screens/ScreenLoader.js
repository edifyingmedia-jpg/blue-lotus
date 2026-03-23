// frontend/src/runtime/screens/ScreenLoader.js

/**
 * ScreenLoader.js
 * ---------------------------------------------------------
 * Loads raw screen definitions from the runtime bundle.
 *
 * Responsibilities:
 *  - Resolve a screen definition by name
 *  - Return the raw screen object
 *
 * This loader must remain deterministic and side‑effect free.
 */

import screens from './index';

class ScreenLoader {
  load(screenName) {
    if (!screenName) return null;

    const screen = screens[screenName];
    if (!screen) {
      console.warn(`Screen not found: ${screenName}`);
      return null;
    }

    return screen;
  }
}

const screenLoader = new ScreenLoader();
export default screenLoader;
