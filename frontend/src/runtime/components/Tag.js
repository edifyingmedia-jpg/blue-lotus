import React from "react";

const Tag = ({
  label = "",
  color = "#7f5af0",
  background = "rgba(127, 90, 240, 0.15)",
  radius = "12px",
  padding = "4px 10px",
  className = "",
  style = {},
}) => {
  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        padding,
        borderRadius: radius,
        background,
        color,
        fontSize: "0.8rem",
        fontWeight: 500,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {label}
    </span>
  );
};

export default Tag;
