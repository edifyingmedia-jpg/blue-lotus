/**
 * theme.js
 * ----------------------------------------------------
 * Lightweight theme utilities for runtime components.
 *
 * This module provides:
 * - getTheme(): returns the active theme object
 * - getMode(): returns "light" | "dark" | "custom"
 * - getToken(path): safely access nested theme tokens
 *
 * This is intentionally minimal and synchronous.
 */

import ThemeEngine from "./ThemeEngine";

/**
 * Get the full active theme object.
 */
export function getTheme() {
  return ThemeEngine.getTheme();
}

/**
 * Get the current theme mode.
 */
export function getMode() {
  return ThemeEngine.getMode();
}

/**
 * Safely access a nested theme token using dot notation.
 *
 * Example:
 *   getToken("colors.primary")
 *   getToken("spacing.md")
 */
export function getToken(path) {
  if (!path) return undefined;

  const theme = ThemeEngine.getTheme();
  const parts = path.split(".");

  let current = theme;
  for (const part of parts) {
    if (current && Object.prototype.hasOwnProperty.call(current, part)) {
      current = current[part];
    } else {
      return undefined;
    }
  }

  return current;
}

export default {
  getTheme,
  getMode,
  getToken,
};
