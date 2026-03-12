import React, { useState } from "react";
import useActionHandler from "../engine/useActionHandler";

const SearchBar = ({
  placeholder = "Search...",
  value = "",
  onChange = () => {},
  height = 40,
  radius = 12,
  background = "rgba(255, 255, 255, 0.08)",
  color = "white",
  style = {},
  action,
  ...props
}) => {
  const [internal, setInternal] = useState(value);
  const handleAction = useActionHandler(action);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInternal(newValue);
    onChange(newValue);
  };

  const containerStyle = {
    width: "100%",
    height,
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    borderRadius: radius,
    background,
    color,
    border: "1px solid rgba(255, 255, 255, 0.15)",
    ...style,
  };

  const inputStyle = {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color,
    fontSize: "1rem",
  };

  return (
    <div style={containerStyle} {...props}>
      <input
        type="text"
        value={internal}
        onChange={handleChange}
        onBlur={handleAction}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
};

export default SearchBar;
