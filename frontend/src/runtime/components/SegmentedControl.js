import React, { useState } from "react";

const SegmentedControl = ({
  options = [], // ["One", "Two", "Three"] or [{ label, value }]
  initial = 0,
  color = "cyan",
  background = "rgba(255, 255, 255, 0.08)",
  radius = 10,
  padding = 8,
  gap = 4,
  onChange = () => {},
  style = {},
  ...props
}) => {
  const [active, setActive] = useState(initial);

  const containerStyle = {
    display: "flex",
    flexDirection: "row",
    gap,
    padding,
    background,
    borderRadius: radius,
    width: "100%",
    ...style,
  };

  const segmentStyle = (isActive) => ({
    flex: 1,
    textAlign: "center",
    padding: "8px 12px",
    borderRadius: radius - 4,
    cursor: "pointer",
    background: isActive ? color : "transparent",
    color: isActive ? "black" : "white",
    fontWeight: isActive ? "bold" : "normal",
    transition: "all 0.2s ease",
  });

  const handleClick = (i) => {
    setActive(i);
    const opt = options[i];
    onChange(opt.value ?? opt);
  };

  return (
    <div style={containerStyle} {...props}>
      {options.map((opt, i) => {
        const label = typeof opt === "string" ? opt : opt.label;
        return (
          <div
            key={i}
            style={segmentStyle(i === active)}
            onClick={() => handleClick(i)}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};

export default SegmentedControl;
