import React from "react";
import useActionHandler from "../engine/useActionHandler";
import { theme } from "../../theme";

/**
 * Blue Lotus Input Component
 * - Supports change + submit actions
 * - Works with your Action Engine
 */

export default function Input({
  value = "",
  placeholder = "",
  action = null,
  onChangeAction = null,
  color = theme.colors.white,
  background = theme.colors.black,
  radius = 8,
  padding = 10,
  style = {},
  ...props
}) {
  const handleSubmit = useActionHandler(action);
  const handleChange = useActionHandler(onChangeAction);

  const combinedStyle = {
    width: "100%",
    padding,
    borderRadius: radius,
    background,
    color,
    border: `1px solid ${theme.colors.primary}`,
    outline: "none",
    ...style,
  };

  return (
    <input
      style={combinedStyle}
      defaultValue={value}
      placeholder={placeholder}
      onChange={(e) => onChangeAction && handleChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && action) handleSubmit();
      }}
      {...props}
    />
  );
}
