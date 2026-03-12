import React, { useEffect } from "react";
import Toast from "./Toast";

const ToastContainer = ({
  toasts = [],
  position = "top-right", // "top-left", "top-right", "bottom-left", "bottom-right", "top-center", "bottom-center"
  removeToast = () => {},
  style = {},
}) => {
  // Positioning presets
  const positions = {
    "top-right": { top: 20, right: 20, flexDirection: "column" },
    "top-left": { top: 20, left: 20, flexDirection: "column" },
    "bottom-right": { bottom: 20, right: 20, flexDirection: "column-reverse" },
    "bottom-left": { bottom: 20, left: 20, flexDirection: "column-reverse" },
    "top-center": {
      top: 20,
      left: "50%",
      transform: "translateX(-50%)",
      flexDirection: "column",
    },
    "bottom-center": {
      bottom: 20,
      left: "50%",
      transform: "translateX(-50%)",
      flexDirection: "column-reverse",
    },
  };

  const containerStyle = {
    position: "fixed",
    zIndex: 2000,
    display: "flex",
    gap: "10px",
    pointerEvents: "none",
    ...positions[position],
    ...style,
  };

  return (
    <div style={containerStyle}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          action={toast.action}
          onClose={() => removeToast(toast.id)}
          style={{ pointerEvents: "auto" }}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
