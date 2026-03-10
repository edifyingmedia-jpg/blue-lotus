import React, { useState } from "react";

const Tabs = ({
  tabs = [], // [{ label: "Tab 1", content: <div/> }]
  initial = 0,
  underlineColor = "cyan",
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
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    paddingBottom: 8,
    marginBottom: 12,
  };

  const tabStyle = (isActive) => ({
    padding: padding,
    cursor: "pointer",
    color: "white",
    borderBottom: isActive ? `2px solid ${underlineColor}` : "2px solid transparent",
    fontWeight: isActive ? "bold" : "normal",
    transition: "all 0.2s ease",
  });

  return (
    <div style={containerStyle} {...props}>
      <div style={headerStyle}>
        {tabs.map((t, i) => (
          <div
            key={i}
            style={tabStyle(i === active)}
            onClick={() => setActive(i)}
          >
            {t.label}
          </div>
        ))}
      </div>

      <div>
        {tabs[active] && tabs[active].content}
      </div>
    </div>
  );
};

export default Tabs;
