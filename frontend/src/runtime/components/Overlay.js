import React from "react";

const Overlay = ({
  visible = false,
  opacity = 0.5,
  color = "black",
  style = {},
  children,
  ...props
}) => {
  if (!visible) return null;

  const baseStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: color,
    opacity: opacity,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    ...style,
  };

  return (
    <div style={baseStyle} {...props}>
      {children}
    </div>
  );
};

export default Overlay;
