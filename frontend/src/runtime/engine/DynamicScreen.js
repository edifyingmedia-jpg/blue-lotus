// frontend/src/runtime/engine/DynamicScreen.js

/**
 * DynamicScreen
 * ---------------------------------------------------------
 * Represents a screen whose structure is generated at runtime.
 * Useful for AI‑generated screens, conditional layouts, or
 * screens that depend on dynamic data.
 */

export default class DynamicScreen {
  constructor({ id, title, build }) {
    this.id = id;
    this.title = title;
    this.build = build; // function that returns a screen definition
  }

  getDefinition(context) {
    if (typeof this.build !== "function") {
      console.warn(`DynamicScreen "${this.id}" has no build() function.`);
      return null;
    }

    try {
      return this.build(context);
    } catch (err) {
      console.error(`DynamicScreen "${this.id}" failed to build.`, err);
      return null;
    }
  }
}
