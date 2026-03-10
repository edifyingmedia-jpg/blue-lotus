import React from "react";

const Switch = ({
  checked = false,
  onChange = () => {},
  width = "42px",
  height = "22px",
  radius = "22px",
  activeColor = "#7f5af0",
  inactiveColor = "rgba(255,255,255,0.25)",
  thumbColor = "#fff",
  className = "",
  style = {},
}) => {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={className}
      style={{
        width,
        height,
        borderRadius: radius,
        background: checked ? activeColor : inactiveColor,
        position: "relative",
        cursor: "pointer",
        transition: "background 0.25s ease",
        ...style,
      }}
    >
      <div
        style={{
          width: "18px",
          height: "18px",
          background: thumbColor,
          borderRadius: "50%",
          position: "absolute",
          top: "2px",
          left: checked ? `calc(${width} - 20px)` : "2px",
          transition: "left 0.25s ease",
        }}
      />
    </div>
  );
};

export default Switch;
