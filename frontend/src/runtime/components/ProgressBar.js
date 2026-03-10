import React from "react";

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
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

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
            fontSize: "0.75rem",
            color: "#fff",
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
