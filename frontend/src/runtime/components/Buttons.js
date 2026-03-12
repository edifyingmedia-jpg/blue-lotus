import React from "react";
import useActionHandler from "../engine/useActionHandler";

export default function Button({
  text,
  children,
  action,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
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
  };

  const sizes = {
    sm: { padding: "8px 14px", fontSize: "14px" },
    md: { padding: "12px 20px", fontSize: "16px" },
    lg: { padding: "16px 24px", fontSize: "18px" },
  };

  return (
    <button
      onClick={disabled ? undefined : handleAction}
      disabled={disabled}
      style={{
        borderRadius: "8px",
        cursor: disabled ? "not-allowed" : "pointer",
        width: fullWidth ? "100%" : "auto",
        border: "none",
        ...variants[variant],
        ...sizes[size],
        ...style,
      }}
      {...props}
    >
      {text || children}
    </button>
  );
}
