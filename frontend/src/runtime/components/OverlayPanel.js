import React from "react";

const OverlayPanel = ({
  visible = false,
  side = "right", // "left" | "right" | "top" | "bottom"
  width = 320,
  height = 320,
  padding = 24,
  radius = 12,
  style = {},
  children,
  ...props
}) => {
  if (!visible) return null;

  const positions = {
    right: { top: 0, right: 0, height: "100vh", width: width },
    left: { top: 0, left: 0, height: "100vh", width: width },
    top: { top: 0, left: 0, width: "100vw", height: height },
    bottom: { bottom: 0, left: 0, width: "100vw", height: height },
  };

  const baseStyle = {
    position: "fixed",
    background: "rgba(0, 0, 0, 0.85)",
    backdropFilter: "blur(6px)",
    borderRadius: radius,
    padding: padding,
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    ...positions[side],
    ...style,
  };

  return (
    <div style={baseStyle} {...props}>
      {children}
    </div>
  );
};

export default OverlayPanel;
