import React from "react";
import useActionHandler from "../engine/useActionHandler";

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
  action,
  ...props
}) => {
  const handleAction = useActionHandler(action);

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      onBlur={handleAction}
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
      {...props}
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
