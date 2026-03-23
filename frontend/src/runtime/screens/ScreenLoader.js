// frontend/src/runtime/screens/ScreenLoader.js

/**
 * ScreenLoader.js
 * ---------------------------------------------------------
 * Loads a screen definition from the DocumentModel and
 * prepares it for the screen-layer ScreenEngine.
 *
 * This is the screen-layer loader (not the resolver version).
 */

import DocumentModel from "../resolver/DocumentModel";

/**
 * Loads a screen by name and returns a normalized screen object.
 */
export function loadScreen(screenName, params = {}) {
  if (!screenName || typeof screenName !== "string") {
    return {
      name: null,
      error: "Invalid screen name.",
      components: {},
      bindings: {},
      params: {},
      root: null,
    };
  }

  const model = DocumentModel.load(screenName);

  if (!model) {
    return {
      name: screenName,
      error: `Unknown screen: ${screenName}`,
      components: {},
      bindings: {},
      params,
      root: null,
    };
  }

  return {
    name: model.name,
    components: model.components || {},
    bindings: model.bindings || {},
    params: { ...model.params, ...params },
    root: model.root || null,
  };
}
