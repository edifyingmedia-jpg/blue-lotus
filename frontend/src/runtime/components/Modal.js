import React from "react";

const Modal = ({
  visible = false,
  width = "80%",
  maxWidth = 480,
  padding = 24,
  radius = 12,
  style = {},
  children,
  ...props
}) => {
  if (!visible) return null;

  const baseStyle = {
    background: "rgba(0, 0, 0, 0.85)",
    borderRadius: radius,
    padding: padding,
    width: width,
    maxWidth: maxWidth,
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(6px)",
    ...style,
  };

  return (
    <div style={baseStyle} {...props}>
      {children}
    </div>
  );
};

export default Modal;
