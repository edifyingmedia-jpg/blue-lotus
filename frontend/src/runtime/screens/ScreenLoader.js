// frontend/src/runtime/screens/ScreenLoader.js

/**
 * ScreenLoader
 * ---------------------------------------------------------
 * Lightweight helper that prepares screen data
 * before it reaches ScreenEngine.
 *
 * Responsibilities:
 * - Validate screen name
 * - Normalize params
 * - Return a clean screen descriptor
 */

import screens from "./index";

export default function ScreenLoader(name, params = {}) {
  const screen = screens[name];

  if (!screen) {
    return {
      name,
      params,
      error: `Unknown screen: ${name}`,
      components: [
        {
          type: "Text",
          value: `Unknown screen: ${name}`
        }
      ]
    };
  }

  return {
    name,
    params,
    components: screen.components || []
  };
}
