import React from "react";

const TextArea = ({
  value = "",
  onChange = () => {},
  placeholder = "",
  color = "#ffffff",
  background = "rgba(255,255,255,0.08)",
  border = "1px solid rgba(255,255,255,0.15)",
  radius = "8px",
  padding = "10px",
  rows = 4,
  resize = "vertical",
  className = "",
  style = {},
}) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={className}
      style={{
        width: "100%",
        color,
        background,
        border,
        borderRadius: radius,
        padding,
        resize,
        outline: "none",
        fontSize: "1rem",
        lineHeight: "1.4",
        fontFamily: "inherit",
        ...style,
      }}
    />
  );
};

export default TextArea;
