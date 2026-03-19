// frontend/src/runtime/engine/NavigationEngine.js

/**
 * NavigationEngine
 * ---------------------------------------------------------
 * Provides a simple, reducer-driven navigation stack.
 * ScreenEngine will consume this to determine which screen
 * should be rendered.
 *
 * Actions supported:
 * - NAVIGATE: push a new screen
 * - REPLACE: replace the current screen
 * - BACK: pop the stack
 */

export default function NavigationEngine() {
  let stack = [];

  function getCurrent() {
    return stack[stack.length - 1] || null;
  }

  function navigate(screenId, params = {}) {
    stack = [...stack, { screenId, params }];
  }

  function replace(screenId, params = {}) {
    if (stack.length === 0) {
      stack = [{ screenId, params }];
      return;
    }
    stack = [...stack.slice(0, -1), { screenId, params }];
  }

  function back() {
    if (stack.length > 1) {
      stack = stack.slice(0, -1);
    }
  }

  return {
    navigate,
    replace,
    back,
    getCurrent,
  };
}
