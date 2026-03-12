import React from "react";
import useActionHandler from "../engine/useActionHandler";
import { theme } from "../../theme";

/**
 * Blue Lotus Button Component
 * - Variants: primary, secondary, ghost, neon
 * - Sizes: sm, md, lg
 * - Full‑width support
 * - Disabled + loading states
 * - Optional left icon
 * - Neon glow mode
 * - Uses Tri‑Neon token system + theme
 */

export default function Button({
  text,
  children,
  action,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  icon = null,
  glow = false,
  style = {},
  ...props
}) {
  const handleAction = useActionHandler(action);

  // Variant styles
  const variants = {
    primary: {
      background: theme.colors.primary,
      color: theme.colors.white,
    },
    secondary: {
      background: theme.colors.secondary,
      color: theme.colors.white,
    },
    ghost: {
      background: "transparent",
      color: theme.colors.primary,
      border: `1px solid ${theme.colors.primary}`,
    },
    neon: {
      background: theme.colors.black,
      color: theme.colors.cyan,
      boxShadow: glow ? `0 0 12px ${theme.colors.cyan}` : "none",
    },
  };

  // Size styles
  const sizes = {
    sm: { padding: "6px 12px", fontSize: 14 },
    md: { padding: "10px 16px", fontSize: 16 },
    lg: { padding: "14px 20px", fontSize: 18 },
  };

  const combinedStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 8,
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? "100%" : "auto",
    ...variants[variant],
    ...sizes[size],
    ...style,
  };

  return (
    <button
      style={combinedStyle}
      onClick={() => !disabled && !loading && handleAction()}
      {...props}
    >
      {loading ? "Loading..." : icon ? <>{icon} {text || children}</> : (text || children)}
    </button>
  );
}
