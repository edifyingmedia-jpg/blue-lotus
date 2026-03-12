import React, { useEffect } from "react";
import useActionHandler from "../engine/useActionHandler";

const Drawer = ({
  visible = false,
  side = "right", // "left", "right", "bottom"
  width = 320,
  height = 300,
  padding = 20,
  radius = 12,
  style = {},
  children,
  onClose = () => {},
  action,
  ...props
}) => {
  const handleAction = useActionHandler(action);

  // Trigger action when drawer becomes visible
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

  // Drawer positioning logic
  const positions = {
    right: {
      top: 0,
      right: 0,
      width,
      height: "100vh",
      borderRadius: `${radius}px 0 0 ${radius}px`,
      transform: "translateX(0)",
    },
    left: {
      top: 0,
      left: 0,
      width,
      height: "100vh",
      borderRadius: `0 ${radius}px ${radius}px 0`,
      transform: "translateX(0)",
    },
    bottom: {
      bottom: 0,
      left: 0,
      width: "100vw",
      height,
      borderRadius: `${radius}px ${radius}px 0 0`,
      transform: "translateY(0)",
    },
  };

  const drawerStyle = {
    position: "fixed",
    background: "rgba(0,0,0,0.85)",
    backdropFilter: "blur(8px)",
    padding,
    boxShadow: "0 0 20px rgba(0,0,0,0.4)",
    transition: "transform 0.3s ease",
    zIndex: 1001,
    ...positions[side],
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
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={drawerStyle}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};

export default Drawer;
