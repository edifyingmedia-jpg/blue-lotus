import React from "react";

const SegmentedControl = ({
  options = [],
  value,
  onChange = () => {},
  height = "36px",
  radius = "8px",
  background = "rgba(255,255,255,0.1)",
  activeColor = "#7f5af0",
  inactiveColor = "rgba(255,255,255,0.4)",
  textColor = "#fff",
  className = "",
  style = {},
}) => {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        background,
        borderRadius: radius,
        overflow: "hidden",
        height,
        ...style,
      }}
    >
      {options.map((opt) => {
        const isActive = opt.value === value;

        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              cursor: "pointer",
              background: isActive ? activeColor : "transparent",
              color: textColor,
              opacity: isActive ? 1 : 0.7,
              transition: "all 0.25s ease",
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedControl;
