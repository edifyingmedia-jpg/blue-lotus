/**
 * NavigationEngine
 * ----------------------------------------------------
 * Centralized navigation controller for the runtime.
 *
 * Responsibilities:
 * - Track current screen
 * - Validate navigation targets
 * - Emit navigation events
 * - Integrate with EventBus + RuntimeRenderer
 */

import EventBus from "./EventBus";

export default class NavigationEngine {
  constructor({ appDefinition, onNavigate }) {
    this.appDefinition = appDefinition;
    this.onNavigate = onNavigate;
    this.currentScreen = appDefinition?.entryScreen || null;
  }

  /**
   * Navigate to a screen by ID
   */
  navigate(screenId) {
    if (!this.appDefinition?.screens?.[screenId]) {
      console.warn(`NavigationEngine: Screen "${screenId}" does not exist.`);
      return;
    }

    this.currentScreen = screenId;

    // Notify runtime + preview
    if (this.onNavigate) {
      this.onNavigate(screenId);
    }

    EventBus.emit("preview:navigate", screenId);
  }

  /**
   * Returns the current screen ID
   */
  getCurrentScreen() {
    return this.currentScreen;
  }

  /**
   * Update app definition (e.g., builder changes)
   */
  updateDefinition(newDefinition) {
    this.appDefinition = newDefinition;

    // If the current screen was deleted, reset to entry
    if (!newDefinition.screens?.[this.currentScreen]) {
      this.currentScreen = newDefinition.entryScreen || null;
      if (this.onNavigate) {
        this.onNavigate(this.currentScreen);
      }
    }
  }
}
