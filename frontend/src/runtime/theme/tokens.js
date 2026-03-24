/**
 * tokens.js
 * ----------------------------------------------------
 * Theme token definitions for the runtime.
 *
 * These tokens define:
 * - colors
 * - typography
 * - spacing
 * - radii
 * - shadows
 *
 * ThemeEngine loads these and exposes them to the app.
 */

const base = {
  colors: {
    primary: "#4A90E2",
    secondary: "#50E3C2",
    background: "#FFFFFF",
    surface: "#F7F7F7",
    text: "#1A1A1A",
    muted: "#999999",
    border: "#E0E0E0",
    danger: "#FF4D4F",
    warning: "#FAAD14",
    success: "#52C41A",
  },

  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
      xxl: 32,
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },

  radii: {
    sm: 4,
    md: 8,
    lg: 12,
    round: 999,
  },

  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 2px 4px rgba(0,0,0,0.08)",
    lg: "0 4px 12px rgba(0,0,0,0.12)",
  },
};

const light = {
  ...base,
  mode: "light",
  colors: {
    ...base.colors,
    background: "#FFFFFF",
    surface: "#F7F7F7",
    text: "#1A1A1A",
  },
};

const dark = {
  ...base,
  mode: "dark",
  colors: {
    ...base.colors,
    background: "#0D0D0D",
    surface: "#1A1A1A",
    text: "#FFFFFF",
    border: "#333333",
    muted: "#777777",
  },
};

export default {
  light,
  dark,
};
