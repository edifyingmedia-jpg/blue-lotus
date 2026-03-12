/**
 * Blue Lotus — Full Tri‑Neon Theme
 * Unified design system for all components, screens, and generators.
 *
 * This file exports:
 * - tokens (raw design values)
 * - theme (semantic mappings)
 * - utilities (helpers for components)
 */

//
// ─────────────────────────────────────────────────────────────
//   1. RAW TOKENS — THE SOURCE OF TRUTH
// ─────────────────────────────────────────────────────────────
//

export const tokens = {
  colors: {
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
  },

  radii: {
    xs: "4px",
    sm: "6px",
    md: "8px",
    lg: "12px",
    xl: "20px",
    full: "999px",
  },

  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    xxl: "32px",
  },

  typography: {
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
  },

  shadows: {
    soft: "0 4px 12px rgba(0,0,0,0.25)",
    medium: "0 6px 20px rgba(0,0,0,0.35)",
    strong: "0 10px 30px rgba(0,0,0,0.45)",
  },

  neon: {
    cyan: "0 0 8px rgba(0,255,255,0.7), 0 0 16px rgba(0,255,255,0.4)",
    pink: "0 0 8px rgba(255,0,255,0.7), 0 0 16px rgba(255,0,255,0.4)",
    purple: "0 0 8px rgba(157,75,255,0.7), 0 0 16px rgba(157,75,255,0.4)",
  },

  motion: {
    fast: "150ms ease",
    normal: "250ms ease",
    slow: "400ms ease",
  },
};

//
// ─────────────────────────────────────────────────────────────
//   2. SEMANTIC THEME — HUMAN‑MEANINGFUL MAPPINGS
// ─────────────────────────────────────────────────────────────
//

export const theme = {
  app: {
    background: tokens.colors.background,
    text: tokens.colors.textPrimary,
  },

  card: {
    background: tokens.colors.surface,
    border: tokens.colors.border,
    radius: tokens.radii.lg,
    padding: tokens.spacing.lg,
    shadow: tokens.shadows.soft,
  },

  input: {
    background: "rgba(255,255,255,0.08)",
    border: tokens.colors.border,
    radius: tokens.radii.md,
    padding: tokens.spacing.md,
    color: tokens.colors.textPrimary,
    placeholder: tokens.colors.textSecondary,
  },

  button: {
    primary: {
      background: "#4A6CF7",
      color: "#FFFFFF",
    },
    secondary: {
      background: "rgba(255,255,255,0.1)",
      color: "#FFFFFF",
      border: "1px solid rgba(255,255,255,0.2)",
    },
    ghost: {
      background: "transparent",
      color: "#FFFFFF",
      border: "1px solid rgba(255,255,255,0.2)",
    },
    neon: {
      background: "rgba(0,0,0,0.6)",
      color: tokens.colors.neonCyan,
      border: `1px solid ${tokens.colors.neonCyan}`,
      glow: tokens.neon.cyan,
    },
  },
};

//
// ─────────────────────────────────────────────────────────────
//   3. UTILITIES — HELPERS FOR COMPONENTS
// ─────────────────────────────────────────────────────────────
//

export const utils = {
  // Apply neon glow by color name
  neonGlow(color = "cyan") {
    return {
      boxShadow: tokens.neon[color] || tokens.neon.cyan,
    };
  },

  // Flex helpers
  flexCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  flexColumn: {
    display: "flex",
    flexDirection: "column",
  },

  flexRow: {
    display: "flex",
    flexDirection: "row",
  },

  // Spacing helpers
  pad(size = "md") {
    return { padding: tokens.spacing[size] };
  },

  margin(size = "md") {
    return { margin: tokens.spacing[size] };
  },

  // Typography helpers
  text(size = "md", weight = "regular") {
    return {
      fontSize: tokens.typography.sizes[size],
      fontWeight: tokens.typography.weights[weight],
      fontFamily: tokens.typography.fontFamily,
    };
  },
};

//
// ─────────────────────────────────────────────────────────────
//   4. DEFAULT EXPORT — EVERYTHING IN ONE PLACE
// ─────────────────────────────────────────────────────────────
//

export default {
  tokens,
  theme,
  utils,
};
