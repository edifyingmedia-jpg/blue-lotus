/**
 * bindings.js
 * ----------------------------------------------------
 * Provides safe, sandboxed bindings for components.
 *
 * Components never touch runtime internals directly.
 * Instead, they receive a bindings object that exposes:
 * - state getters/setters
 * - navigation
 * - API client
 * - auth
 */

export default function createBindings({
  stateEngine,
  navigationEngine,
  api,
  auth,
}) {
  return {
    /**
     * State
     */
    getState: (key) => stateEngine.getState(key),
    setState: (key, value) => stateEngine.setState(key, value),
    replaceState: (newState) => stateEngine.replaceState(newState),

    /**
     * Navigation
     */
    navigate: (screenId) => navigationEngine.navigate(screenId),
    getCurrentScreen: () => navigationEngine.getCurrentScreen(),

    /**
     * API
     */
    api,

    /**
     * Auth
     */
    auth,
  };
}
