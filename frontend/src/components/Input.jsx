// frontend/src/components/Input.jsx

import React from "react";

/**
 * Input
 * ---------------------------------------------------------
 * A clean, stable input field for Blue Lotus.
 *
 * Features:
 * - Supports placeholder, value, onChange
 * - Smooth transitions
 * - Soft, cinematic styling
 * - Works with JSON screen definitions
 */

const Input = ({
  value = "",
  placeholder = "",
  type = "text",
  onChange,
  style = {},
  ...rest
}) => {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange && onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "12px 16px",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.25)",
        background: "rgba(255,255,255,0.08)",
        color: "#ffffff",
        fontSize: "1rem",
        outline: "none",
        transition: "all 0.25s ease",
        backdropFilter: "blur(6px)",
        ...style,
      }}
      {...rest}
    />
  );
};

export default Input;
