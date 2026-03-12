import React from "react";
import useActionHandler from "../engine/useActionHandler";

const ProgressBar = ({
  value = 0,
  max = 100,
  height = "8px",
  radius = "6px",
  background = "rgba(255,255,255,0.15)",
  color = "#7f5af0",
  showLabel = false,
  className = "",
  style = {},
  action,
}) => {
  const handleAction = useActionHandler(action);

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  // Trigger action when progress completes
  if (percentage === 100 && action) {
    handleAction();
  }

  return (
    <div
      className={className}
      style={{
        width: "100%",
        background,
        borderRadius: radius,
        overflow: "hidden",
        height,
        position: "relative",
        ...style,
      }}
    >
      <div
        style={{
          width: `${percentage}%`,
          height: "100%",
          background: color,
          transition: "width 0.3s ease",
        }}
      />

      {showLabel && (
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            fontSize: "0.75rem",
            pointerEvents: "none",
          }}
        >
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
