import React, { useState } from "react";

const Stepper = ({
  steps = [], // [{ label: "Step 1", content: <div/> }]
  initial = 0,
  color = "cyan",
  gap = 16,
  padding = 12,
  style = {},
  ...props
}) => {
  const [active, setActive] = useState(initial);

  const containerStyle = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    ...style,
  };

  const headerStyle = {
    display: "flex",
    flexDirection: "row",
    gap: gap,
    marginBottom: 16,
  };

  const stepStyle = (isActive) => ({
    padding: padding,
    cursor: "pointer",
    borderRadius: 8,
    border: `1px solid ${isActive ? color : "rgba(255, 255, 255, 0.2)"}`,
    background: isActive ? "rgba(0, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.05)",
    color: "white",
    fontWeight: isActive ? "bold" : "normal",
    transition: "all 0.2s ease",
  });

  return (
    <div style={containerStyle} {...props}>
      <div style={headerStyle}>
        {steps.map((s, i) => (
          <div
            key={i}
            style={stepStyle(i === active)}
            onClick={() => setActive(i)}
          >
            {s.label}
          </div>
        ))}
      </div>

      <div>
        {steps[active] && steps[active].content}
      </div>
    </div>
  );
};

export default Stepper;
