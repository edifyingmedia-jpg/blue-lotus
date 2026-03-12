import React, { useState } from "react";
import useActionHandler from "../engine/useActionHandler";

const BottomTabs = ({
  tabs = [], // [{ label, icon, action }]
  initial = 0,
  height = 64,
  background = "rgba(0,0,0,0.65)",
  blur = true,
  activeColor = "#7f5af0",
  inactiveColor = "rgba(255,255,255,0.6)",
  style = {},
  ...props
}) => {
  const [active, setActive] = useState(initial);

  const containerStyle = {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100vw",
    height,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    background,
    backdropFilter: blur ? "blur(10px)" : "none",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    zIndex: 1000,
    ...style,
  };

  const tabStyle = (isActive) => ({
    flex: 1,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: isActive ? activeColor : inactiveColor,
    fontSize: "0.8rem",
    cursor: "pointer",
    transition: "color 0.2s ease",
    userSelect: "none",
  });

  const handlePress = (index, action) => {
    setActive(index);
    const run = useActionHandler(action);
    run();
  };

  return (
    <div style={containerStyle} {...props}>
      {tabs.map((tab, index) => (
        <div
          key={index}
          style={tabStyle(index === active)}
          onClick={() => handlePress(index, tab.action)}
        >
          {tab.icon && (
            <span style={{ fontSize: 20, marginBottom: 4 }}>{tab.icon}</span>
          )}
          {tab.label}
        </div>
      ))}
    </div>
  );
};

export default BottomTabs;
