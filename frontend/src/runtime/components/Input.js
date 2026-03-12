import React from "react";
import useActionHandler from "../engine/useActionHandler";

export default function Input({
  value = "",
  placeholder = "",
  action,
  style = {},
  onChange,
  ...props
}) {
  const handleAction = useActionHandler(action);

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={handleChange}
      onBlur={handleAction}
      style={{
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #444",
        background: "#1A1A1A",
        color: "#FFFFFF",
        fontSize: "16px",
        outline: "none",
        ...style,
      }}
      {...props}
    />
  );
}
