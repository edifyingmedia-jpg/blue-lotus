/**
 * Blue Lotus — Tri‑Neon Global Theme Tokens
 * Unified design system for all components and screens.
 */

const colors = {
  // Core neutrals
  background: "#0A0A0F",
  surface: "rgba(255,255,255,0.04)",
  surfaceHover: "rgba(255,255,255,0.08)",
  border: "rgba(255,255,255,0.12)",
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.6)",

  // Tri‑Neon signature colors
  neonCyan: "#00FFFF",
  neonPink: "#FF00FF",
  neonPurple: "#9D4BFF",

  // Utility
  danger: "#FF4D4D",
  success: "#4DFF88",
  warning: "#FFD84D",
};

const radii = {
  xs: "4px",
  sm: "6px",
  md: "8px",
  lg: "12px",
  xl: "20px",
  full: "999px",
};

const spacing = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  xxl: "32px",
};

const typography = {
  fontFamily: "'Inter', sans-serif",

  sizes: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "20px",
    xl: "24px",
    xxl: "32px",
  },

  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

const shadows = {
  soft: "0 4px 12px rgba(0,0,0,0.25)",
  medium: "0 6px 20px rgba(0,0,0,0.35)",
  strong: "0 10px 30px rgba(0,0,0,0.45)",
};

const neon = {
  cyan: "0 0 8px rgba(0,255,255,0.7), 0 0 16px rgba(0,255,255,0.4)",
  pink: "0 0 8px rgba(255,0,255,0.7), 0 0 16px rgba(255,0,255,0.4)",
  purple: "0 0 8px rgba(157,75,255,0.7), 0 0 16px rgba(157,75,255,0.4)",
};

const motion = {
  fast: "150ms ease",
  normal: "250ms ease",
  slow: "400ms ease",
};

export const tokens = {
  colors,
  radii,
  spacing,
  typography,
  shadows,
  neon,
  motion,
};

export default tokens;
