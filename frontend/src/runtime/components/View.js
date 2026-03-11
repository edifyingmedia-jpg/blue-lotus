import React from "react";

const View = ({
  children,
  direction = "column",
  align = "flex-start",
  justify = "flex-start",
  gap = 0,
  padding = 0,
  margin = 0,
  width = "100%",
  height = "auto",
  background = "transparent",
  radius = "0px",
  border = "none",
  className = "",
  style = {},
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        display: "flex",
        flexDirection: direction,
        alignItems: align,
        justifyContent: justify,
        gap,
        padding,
        margin,
        width,
        height,
        background,
        borderRadius: radius,
        border,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default View;
