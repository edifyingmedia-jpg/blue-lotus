import React from "react";

const TextInput = ({
  value = "",
  onChange = () => {},
  placeholder = "",
  color = "#ffffff",
  background = "rgba(255,255,255,0.08)",
  border = "1px solid rgba(255,255,255,0.15)",
  radius = "8px",
  padding = "10px 12px",
  type = "text",
  autoCapitalize = "none",
  autoComplete = "off",
  autoCorrect = "off",
  className = "",
  style = {},
}) => {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      autoCapitalize={autoCapitalize}
      autoComplete={autoComplete}
      autoCorrect={autoCorrect}
      className={className}
      style={{
        width: "100%",
        color,
        background,
        border,
        borderRadius: radius,
        padding,
        outline: "none",
        fontSize: "1rem",
        lineHeight: "1.4",
        fontFamily: "inherit",
        ...style,
      }}
    />
  );
};

export default TextInput;
