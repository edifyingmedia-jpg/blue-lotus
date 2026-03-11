import React from "react";

const Text = ({
  children,
  color = "#ffffff",
  size = "1rem",
  weight = "400",
  align = "left",
  lineHeight = "1.4",
  maxLines = null,
  selectable = true,
  className = "",
  style = {},
}) => {
  const clampStyles =
    maxLines != null
      ? {
          display: "-webkit-box",
          WebkitLineClamp: maxLines,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }
      : {};

  return (
    <span
      className={className}
      style={{
        color,
        fontSize: size,
        fontWeight: weight,
        textAlign: align,
        lineHeight,
        userSelect: selectable ? "text" : "none",
        ...clampStyles,
        ...style,
      }}
    >
      {children}
    </span>
  );
};

export default Text;
