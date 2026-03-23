// frontend/src/runtime/resolver/ScreenLoader.js

/**
 * ScreenLoader.js
 * ---------------------------------------------------------
 * Loads and normalizes a screen's DocumentModel.
 *
 * Responsibilities:
 *  - Validate the screen name
 *  - Load the DocumentModel for that screen
 *  - Ensure a consistent return shape for the runtime
 *
 * This replaces the legacy JSON-based screen registry.
 */

import DocumentModel from "../DocumentModel";

export default function ScreenLoader(screenName) {
  if (!screenName || typeof screenName !== "string") {
    return {
      name: screenName || null,
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
      params: {},
      root: null,
    };
  }

  return {
    name: model.name,
    components: model.components || {},
    bindings: model.bindings || {},
    params: model.params || {},
    root: model.root || null,
  };
}
