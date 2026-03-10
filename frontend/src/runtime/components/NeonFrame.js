import React from "react";

const NeonFrame = ({
  color = "cyan",
  glow = 12,
  radius = 12,
  padding = 16,
  style = {},
  children,
  ...props
}) => {
  const baseStyle = {
    border: `1px solid ${color}`,
    borderRadius: radius,
    padding: padding,
    boxShadow: `0 0 ${glow}px ${color}`,
    width: "100%",
    ...style,
  };

  return (
    <div style={baseStyle} {...props}>
      {children}
    </div>
  );
};

export default NeonFrame;
