import React, { useEffect, useState } from "react";

const Snackbar = ({
  message = "",
  open = false,
  duration = 3000,
  variant = "info", // info | success | error
  onClose = () => {},
  radius = 10,
  padding = "12px 16px",
  style = {},
  ...props
}) => {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    setVisible(open);
    if (open && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  const colors = {
    info: "rgba(0, 180, 255, 0.9)",
    success: "rgba(0, 255, 180, 0.9)",
    error: "rgba(255, 80, 80, 0.9)",
  };

  const containerStyle = {
    position: "fixed",
    bottom: 24,
    left: "50%",
    transform: "translateX(-50%)",
    background: colors[variant] || colors.info,
    color: "black",
    padding,
    borderRadius: radius,
    fontSize: 14,
    fontWeight: "bold",
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? "auto" : "none",
    transition: "opacity 0.25s ease, transform 0.25s ease",
    zIndex: 2000,
    ...style,
  };

  return (
    <div
      style={{
        ...containerStyle,
        transform: visible
          ? "translateX(-50%) translateY(0)"
          : "translateX(-50%) translateY(20px)",
      }}
      {...props}
    >
      {message}
    </div>
  );
};

export default Snackbar;
