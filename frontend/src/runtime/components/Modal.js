import React, { useEffect } from "react";
import useActionHandler from "../engine/useActionHandler";

const Modal = ({
  visible = false,
  width = "80%",
  maxWidth = 480,
  padding = 24,
  radius = 12,
  style = {},
  children,
  onClose = () => {},
  action,
  ...props
}) => {
  const handleAction = useActionHandler(action);

  // Trigger action when modal becomes visible
  useEffect(() => {
    if (visible && action) handleAction();
  }, [visible]);

  // Close on ESC
  useEffect(() => {
    if (!visible) return;

    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [visible]);

  if (!visible) return null;

  const baseStyle = {
    background: "rgba(0, 0, 0, 0.85)",
    borderRadius: radius,
    padding,
    width,
    maxWidth,
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(6px)",
    position: "relative",
    zIndex: 1001,
    ...style,
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={baseStyle}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
