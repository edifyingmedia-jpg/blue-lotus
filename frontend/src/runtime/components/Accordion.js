import React, { useState } from "react";

const Accordion = ({
  title = "",
  open = false,
  padding = 12,
  radius = 8,
  style = {},
  children,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(open);

  const containerStyle = {
    width: "100%",
    borderRadius: radius,
    border: "1px solid rgba(255, 255, 255, 0.15)",
    overflow: "hidden",
    ...style,
  };

  const headerStyle = {
    padding: padding,
    cursor: "pointer",
    background: "rgba(255, 255, 255, 0.05)",
    fontWeight: "bold",
    color: "white",
  };

  const contentStyle = {
    padding: padding,
    display: isOpen ? "block" : "none",
    background: "rgba(255, 255, 255, 0.02)",
    color: "white",
  };

  return (
    <div style={containerStyle} {...props}>
      <div style={headerStyle} onClick={() => setIsOpen(!isOpen)}>
        {title}
      </div>

      <div style={contentStyle}>{children}</div>
    </div>
  );
};

export default Accordion;
