import React, { useState } from "react";
import useActionHandler from "../engine/useActionHandler";

const Tabs = ({
  tabs = [], // [{ label: "Tab 1", content: <div/> }]
  initial = 0,
  underlineColor = "cyan",
  gap = 16,
  padding = 12,
  style = {},
  action,
  ...props
}) => {
  const [active, setActive] = useState(initial);
  const handleAction = useActionHandler(action);

  const containerStyle = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    ...style,
  };

  const headerStyle = {
    display: "flex",
    flexDirection: "row",
    gap,
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    paddingBottom: 8,
    marginBottom: 12,
  };

  const tabStyle = (isActive) => ({
    padding,
    cursor: "pointer",
    color: "white",
    borderBottom: isActive
      ? `2px solid ${underlineColor}`
      : "2px solid transparent",
    fontWeight: isActive ? "bold" : "normal",
    transition: "all 0.2s ease",
  });

  const handleTabClick = (index) => {
    setActive(index);
    handleAction();
  };

  return (
    <div style={containerStyle} {...props}>
      <div style={headerStyle}>
        {tabs.map((tab, index) => (
          <div
            key={index}
            style={tabStyle(index === active)}
            onClick={() => handleTabClick(index)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      <div style={{ width: "100%" }}>
        {tabs[active] && tabs[active].content}
      </div>
    </div>
  );
};

export default Tabs;
