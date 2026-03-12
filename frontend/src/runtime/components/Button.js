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
      border: "none",
    },
    secondary: {
      background: theme.colors.surface2,
      color: theme.colors.text,
      border: `1px solid ${theme.colors.border}`,
    },
    ghost: {
      background: "transparent",
      color: theme.colors.text,
      border: `1px solid ${theme.colors.border}`,
    },
    neon: {
      background: theme.colors.neonPink,
      color: theme.colors.black,
      border: "none",
      boxShadow: glow
        ? `0 0 12px ${theme.colors.neonPink}, 0 0 24px ${theme.colors.neonPink}`
        : "none",
    },
  };

  // Size styles
  const sizes = {
    sm: {
      padding: "8px 14px",
      fontSize: theme.fontSizes.sm,
    },
    md: {
      padding: "10px 18px",
      fontSize: theme.fontSizes.md,
    },
    lg: {
      padding: "14px 22px",
      fontSize: theme.fontSizes.lg,
    },
  };

  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    borderRadius: theme.radii.md,
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? "100%" : "auto",
    transition: "all 0.18s ease-out",
    fontFamily: theme.fonts.body,
    fontWeight: 500,
    userSelect: "none",
  };

  const loadingSpinner = (
    <span
      style={{
        width: "14px",
        height: "14px",
        border: `2px solid ${theme.colors.white}`,
        borderTopColor: "transparent",
        borderRadius: "50%",
        display: "inline-block",
        animation: "spin 0.8s linear infinite",
      }}
    />
  );

  return (
    <button
      onClick={!disabled && !loading ? handleAction : undefined}
      style={{
        ...base,
        ...variants[variant],
        ...sizes[size],
        ...style,
      }}
      {...props}
    >
      {loading ? (
        loadingSpinner
      ) : (
        <>
          {icon && <span style={{ display: "flex" }}>{icon}</span>}
          {text || children}
        </>
      )}
    </button>
  );
}
