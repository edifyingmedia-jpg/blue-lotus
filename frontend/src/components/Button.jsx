// frontend/src/components/Button.jsx

import React from "react";

/**
 * Button
 * ---------------------------------------------------------
 * A clean, stable, emotionally intelligent button for Blue Lotus.
 *
 * Features:
 * - Primary, Secondary, and Ghost variants
 * - Smooth transitions
 * - Full-width option
 * - Disabled state
 * - Works with JSON screen definitions
 */

const VARIANTS = {
  primary: {
    background: "#4A6CF7",
    color: "#ffffff",
    border: "none",
  },
  secondary: {
    background: "rgba(255,255,255,0.12)",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.25)",
  },
  ghost: {
    background: "transparent",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.25)",
  },
};

const SIZES = {
  sm: { padding: "8px 14px", fontSize: "0.9rem" },
  md: { padding: "12px 20px", fontSize: "1rem" },
  lg: { padding: "16px 26px", fontSize: "1.1rem" },
};

const Button = ({
  children,
  text,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  style = {},
  onClick,
  ...rest
}) => {
  const content = children || text;

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: fullWidth ? "100%" : "auto",
        borderRadius: "8px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        transition: "all 0.25s ease",
        ...VARIANTS[variant],
        ...SIZES[size],
        ...style,
      }}
      {...rest}
    >
      {content}
    </button>
  );
};

export default Button;
