// frontend/src/runtime/editor/EditorTheme.js

/**
 * EditorTheme
 *
 * Provides global theme tokens for the Blue Lotus editor.
 * Supports:
 * - Dark mode (default)
 * - Light mode (future)
 * - Tri-Neon accent palette (cyan, purple, pink)
 *
 * All editor components should import from this file.
 */

export const Theme = {
  mode: "dark",

  colors: {
    // Backgrounds
    bg: "#000000",
    bgPanel: "#111111",
    bgElevated: "#181818",

    // Borders
    border: "#333333",

    // Text
    text: "#EEEEEE",
    textMuted: "#AAAAAA",

    // Tri-Neon Accents
    neonCyan: "#00F0FF",
    neonPurple: "#B400FF",
    neonPink: "#FF2EC4",

    // Interactive
    buttonBg: "#222222",
    buttonHover: "#2A2A2A",
  },

  spacing: {
    xs: "4px",
    sm: "6px",
    md: "10px",
    lg: "14px",
  },

  radius: {
    sm: "4px",
    md: "6px",
    lg: "10px",
  },

  fonts: {
    body: "Inter, sans-serif",
    mono: "JetBrains Mono, monospace",
  },

  /**
   * Returns a neon glow style for UI elements.
   */
  neonGlow(color = "neonCyan") {
    return `
      0 0 4px ${this.colors[color]},
      0 0 8px ${this.colors[color]},
      0 0 12px ${this.colors[color]}
    `;
  },

  /**
   * Future: theme switching logic
   */
  setMode(mode) {
    this.mode = mode;
  },
};
