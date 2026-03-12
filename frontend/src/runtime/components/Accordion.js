import React, { useState } from "react";
import useActionHandler from "../engine/useActionHandler";

const Accordion = ({
  title = "",
  open = false,
  padding = 12,
  radius = 8,
  style = {},
  children,
  action,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(open);
  const handleAction = useActionHandler(action);

  const toggle = () => {
    setIsOpen(!isOpen);
    handleAction();
  };

  const containerStyle = {
    width: "100%",
    borderRadius: radius,
    border: "1px solid rgba(255, 255, 255, 0.15)",
    overflow: "hidden",
    ...style,
  };

  const headerStyle = {
    padding,
    cursor: "pointer",
    background: "rgba(255, 255, 255, 0.05)",
    fontWeight: "bold",
    color: "white",
  };

  const contentStyle = {
    padding,
    background: "rgba(255, 255, 255, 0.02)",
    color: "white",
    maxHeight: isOpen ? "500px" : "0px",
    opacity: isOpen ? 1 : 0,
    overflow: "hidden",
    transition: "all 0.25s ease",
  };

  return (
    <div style={containerStyle} {...props}>
      <div style={headerStyle} onClick={toggle}>
        {title}
      </div>

      <div style={contentStyle}>
        {children}
      </div>
    </div>
  );
};

export default Accordion;
