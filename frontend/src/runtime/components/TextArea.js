import React from "react";
import useActionHandler from "../engine/useActionHandler";
import { theme } from "../../theme";

/**
 * Blue Lotus TextArea Component
 * - Supports change + submit actions
 * - Works with your Action Engine
 */

export default function TextArea({
  value = "",
  placeholder = "",
  action = null,
  onChangeAction = null,
  color = theme.colors.white,
  background = theme.colors.black,
  radius = 8,
  padding = 10,
  rows = 4,
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
    resize: "vertical",
    ...style,
  };

  return (
    <textarea
      style={combinedStyle}
      defaultValue={value}
      placeholder={placeholder}
      rows={rows}
      onChange={(e) => onChangeAction && handleChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && action) {
          e.preventDefault();
          handleSubmit();
        }
      }}
      {...props}
    />
  );
}
