import React from "react";

const ProgressBar = ({
  value = 0,
  height = 8,
  radius = 4,
  background = "rgba(255, 255, 255, 0.1)",
  color = "cyan",
  style = {},
  ...props
}) => {
  const containerStyle = {
    width: "100%",
    height: height,
    background: background,
    borderRadius: radius,
    overflow: "hidden",
    ...style,
  };

  const barStyle = {
    width: `${Math.min(Math.max(value, 0), 100)}%`,
    height: "100%",
    background: color,
    transition: "width 0.3s ease",
  };

  return (
    <div style={containerStyle} {...props}>
      <div style={barStyle} />
    </div>
  );
};

export default ProgressBar;
