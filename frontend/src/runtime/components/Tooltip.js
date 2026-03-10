import React, { useState } from "react";

const Tooltip = ({
  text = "",
  position = "top", // top | bottom | left | right
  background = "rgba(0,0,0,0.85)",
  color = "white",
  radius = 6,
  padding = "6px 10px",
  offset = 8,
  style = {},
  children,
  ...props
}) => {
  const [visible, setVisible] = useState(false);

  const containerStyle = {
    position: "relative",
    display: "inline-block",
    ...style,
  };

  const tooltipStyle = {
    position: "absolute",
    whiteSpace: "nowrap",
    background,
    color,
    padding,
    borderRadius: radius,
    fontSize: 12,
    opacity: visible ? 1 : 0,
    pointerEvents: "none",
    transition: "opacity 0.15s ease",
    zIndex: 1000,
    ...(position === "top" && { bottom: `calc(100% + ${offset}px)`, left: "50%", transform: "translateX(-50%)" }),
    ...(position === "bottom" && { top: `calc(100% + ${offset}px)`, left: "50%", transform: "translateX(-50%)" }),
    ...(position === "left" && { right: `calc(100% + ${offset}px)`, top: "50%", transform: "translateY(-50%)" }),
    ...(position === "right" && { left: `calc(100% + ${offset}px)`, top: "50%", transform: "translateY(-50%)" }),
  };

  return (
    <div
      style={containerStyle}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      {...props}
    >
      {children}
      <div style={tooltipStyle}>{text}</div>
    </div>
  );
};

export default Tooltip;
