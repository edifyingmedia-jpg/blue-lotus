import React from "react";
import useActionHandler from "../engine/useActionHandler";

/**
 * Enhanced Button Component
 * - Variants (primary, secondary, ghost, neon)
 * - Sizes (sm, md, lg)
 * - Full-width support
 * - Disabled + loading states
 * - Icon support
 * - Neon glow mode
 * - Clean dark-mode defaults
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

  const variants = {
    primary: {
      background: "#4A6CF7",
      color: "white",
    },
    secondary: {
      background: "rgba(255,255,255,0.1)",
      color: "white",
      border: "1px solid rgba(255,255,255,0.2)",
    },
    ghost: {
      background: "transparent",
      color: "white",
      border: "1px solid rgba(255,255,255,0.2)",
    },
    neon: {
      background: "rgba(0,0,0,0.6)",
      color: "#00FFFF",
      border: "1px solid rgba(0,255,255,0.6)",
      boxShadow:
        "0 0 8px rgba(0,255,255,0.6), 0 0 16px rgba(255,0,255,0.4)",
    },
  };

  const sizes = {
    sm: { padding: "8px 14px", fontSize: "14px" },
    md: { padding: "12px 20px", fontSize: "16px" },
    lg: { padding: "16px 24px", fontSize: "18px" },
  };

  return (
    <button
      onClick={disabled || loading ? undefined : handleAction}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        width: fullWidth ? "100%" : "auto",
        borderRadius: "8px",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        border: "none",
        transition: "all 0.2s ease",
        ...(glow
          ? {
              boxShadow:
                "0 0 8px rgba(0,255,255,0.6), 0 0 16px rgba(255,0,255,0.4)",
            }
          : {}),
        ...variants[variant],
        ...sizes[size],
        ...style,
      }}
      {...props}
    >
      {/* Optional icon */}
      {icon && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: sizes[size].fontSize,
          }}
        >
          {icon}
        </span>
      )}

      {/* Text or children */}
      {loading ? "Loading..." : text || children}
    </button>
  );
}
