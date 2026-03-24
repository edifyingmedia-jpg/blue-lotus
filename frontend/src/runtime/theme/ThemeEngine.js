/**
 * ThemeEngine.js
 * ----------------------------------------------------
 * Central theme controller for the runtime.
 *
 * Responsibilities:
 * - Hold the active theme (light/dark/custom)
 * - Provide deterministic theme switching
 * - Notify subscribers on theme changes
 * - Integrate with ThemeProvider + useTheme
 */

import tokens from "./tokens";

class ThemeEngine {
  constructor() {
    this.theme = tokens.light; // default theme
    this.mode = "light";       // "light" | "dark" | "custom"
    this.subscribers = new Set();
  }

  /**
   * Get the current theme object.
   */
  getTheme() {
    return this.theme;
  }

  /**
   * Get the current theme mode.
   */
  getMode() {
    return this.mode;
  }

  /**
   * Switch between light/dark/custom themes.
   */
  setMode(mode) {
    if (!tokens[mode]) {
      console.error(`ThemeEngine: Theme mode "${mode}" not found`);
      return;
    }

    this.mode = mode;
    this.theme = tokens[mode];
    this.notify();
  }

  /**
   * Apply a custom theme object.
   */
  setCustomTheme(customTheme) {
    this.mode = "custom";
    this.theme = { ...tokens.light, ...customTheme };
    this.notify();
  }

  /**
   * Subscribe to theme changes.
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /**
   * Notify all subscribers.
   */
  notify() {
    for (const callback of this.subscribers) {
      callback(this.theme, this.mode);
    }
  }
}

const engine = new ThemeEngine();
export default engine;
