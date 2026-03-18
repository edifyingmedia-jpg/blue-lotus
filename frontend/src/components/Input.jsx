// frontend/src/components/Input.jsx

import React, { useState } from "react";

/**
 * Input
 * ---------------------------------------------------------
 * Cinematic, emotionally intelligent input for Blue Lotus.
 * Supports variants, icons, multiline, password toggle,
 * focus glow, and JSON-friendly props.
 */

const VARIANTS = {
  default: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.25)",
    color: "#ffffff",
  },
  subtle: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#ffffff",
  },
  neon: {
    background: "rgba(0, 255, 255, 0.12)",
    border: "1px solid rgba(125, 249, 255, 0.65)",
    color: "#7df9ff",
    boxShadow: "0 0 10px rgba(125, 249, 255, 0.4)",
  },
  glow: {
    background: "rgba(226, 155, 255, 0.12)",
    border: "1px solid rgba(226, 155, 255, 0.65)",
    color: "#e29bff",
    boxShadow: "0 0 12px rgba(226, 155, 255, 0.4)",
  },
  danger: {
    background: "rgba(255, 80, 80, 0.12)",
    border: "1px solid rgba(255, 80, 80, 0.5)",
    color: "#ff5050",
  },
  success: {
    background: "rgba(80, 255, 150, 0.12)",
    border: "1px solid rgba(80, 255, 150, 0.5)",
    color: "#50ff96",
  },
};

const Input = ({
  value = "",
  placeholder = "",
  type = "text",
  variant = "default",
  multiline = false,
  autoResize = false,
  leftIcon = null,
  rightIcon = null,
  rounded = "8px", // or "pill"
  disabled = false,
  error = false,
  opacity = 1,
  letterSpacing = "0px",
  transform = "none",
  onChange,
  style = {},
  ...rest
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const isPassword = type === "password";

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange && onChange(newValue);
  };

  const sharedStyles = {
    width: "100%",
    padding: leftIcon || rightIcon ? "12px 16px 12px 42px" : "12px 16px",
    borderRadius: rounded === "pill" ? "999px" : rounded,
    outline: "none",
    fontSize: "1rem",
    color: VARIANTS[variant].color,
    opacity: disabled ? 0.5 : opacity,
    letterSpacing,
    textTransform: transform,
    transition: "all 0.25s ease",
    resize: autoResize ? "vertical" : "none",
    ...(error && {
      border: "1px solid rgba(255, 80, 80, 0.7)",
      boxShadow: "0 0 8px rgba(255, 80, 80, 0.4)",
    }),
    ...VARIANTS[variant],
    ...style,
  };

  const Element = multiline ? "textarea" : "input";

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {leftIcon && (
        <span
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            opacity: 0.8,
          }}
        >
          {leftIcon}
        </span>
      )}

      <Element
        type={isPassword ? "password" : type}
        value={internalValue}
        placeholder={placeholder}
        onChange={handleChange}
        disabled={disabled}
        style={sharedStyles}
        {...rest}
      />

      {rightIcon && (
        <span
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            opacity: 0.8,
          }}
        >
          {rightIcon}
        </span>
      )}
    </div>
  );
};

export default Input;
