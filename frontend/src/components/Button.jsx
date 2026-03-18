// frontend/src/components/Button.jsx

import React from "react";

/**
 * Button
 * ---------------------------------------------------------
 * Cinematic, emotionally intelligent button for Blue Lotus.
 * Supports neon variants, glow, icons, loading state,
 * and fully JSON-friendly props.
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
  neon: {
    background: "rgba(0, 255, 255, 0.15)",
    color: "#7df9ff",
    border: "1px solid rgba(125, 249, 255, 0.65)",
    boxShadow: "0 0 12px rgba(125, 249, 255, 0.55)",
  },
  glow: {
    background: "rgba(226, 155, 255, 0.15)",
    color: "#e29bff",
    border: "1px solid rgba(226, 155, 255, 0.65)",
    boxShadow: "0 0 14px rgba(226, 155, 255, 0.55)",
  },
  danger: {
    background: "rgba(255, 80, 80, 0.2)",
    color: "#ff5050",
    border: "1px solid rgba(255, 80, 80, 0.5)",
  },
  success: {
    background: "rgba(80, 255, 150, 0.2)",
    color: "#50ff96",
    border: "1px solid rgba(80, 255, 150, 0.5)",
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
  loading = false,
  leftIcon = null,
  rightIcon = null,
  rounded = "8px", // or "pill"
  opacity = 1,
  transform = "none",
  letterSpacing = "0px",
  style = {},
  onClick,
  ...rest
}) => {
  const content = children || text;

  return (
    <button
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        width: fullWidth ? "100%" : "auto",
        borderRadius: rounded === "pill" ? "999px" : rounded,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : opacity,
        textTransform: transform,
        letterSpacing,
        transition: "all 0.25s ease",
        ...VARIANTS[variant],
        ...SIZES[size],
        ...style,
      }}
      {...rest}
    >
      {loading ? (
        <span
          style={{
            width: "1.1em",
            height: "1.1em",
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.4)",
            borderTopColor: "transparent",
            animation: "spin 0.8s linear infinite",
          }}
        />
      ) : (
        <>
          {leftIcon && <span>{leftIcon}</span>}
          {content}
          {rightIcon && <span>{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
