import React, { useEffect } from "react";
import useActionHandler from "../engine/useActionHandler";

const Toast = ({
  message = "",
  type = "info", // "success", "error", "warning", "info"
  duration = 3000,
  onClose = () => {},
  action,
  style = {},
  ...props
}) => {
  const handleAction = useActionHandler(action);

  // Trigger action when toast appears
  useEffect(() => {
    if (action) handleAction();
  }, []);

  // Auto-dismiss
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const colors = {
    success: "#2cb67d",
    error: "#ff6b6b",
    warning: "#f4d35e",
    info: "#7f5af0",
  };

  return (
    <div
      style={{
        padding: "12px 18px",
        borderRadius: "8px",
        background: "rgba(0,0,0,0.75)",
        borderLeft: `4px solid ${colors[type] || colors.info}`,
        color: "white",
        fontSize: "0.95rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        backdropFilter: "blur(6px)",
        animation: "toast-slide-in 0.25s ease",
        ...style,
      }}
      {...props}
    >
      {message}

      <style>
        {`
          @keyframes toast-slide-in {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Toast;
