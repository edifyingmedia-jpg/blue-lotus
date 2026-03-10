import React from "react";

const Select = ({
  options = [],
  value,
  onChange = () => {},
  placeholder = "Select...",
  radius = "8px",
  background = "rgba(255,255,255,0.1)",
  color = "#fff",
  border = "1px solid rgba(255,255,255,0.15)",
  className = "",
  style = {},
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
      style={{
        width: "100%",
        padding: "8px 12px",
        borderRadius: radius,
        background,
        color,
        border,
        outline: "none",
        cursor: "pointer",
        fontSize: "0.9rem",
        ...style,
      }}
    >
      {placeholder && (
        <option value="" disabled hidden>
          {placeholder}
        </option>
      )}

      {options.map((opt) => (
        <option
          key={opt.value}
          value={opt.value}
          style={{ color: "#000" }}
        >
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
