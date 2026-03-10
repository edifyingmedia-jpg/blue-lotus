import React, { useState, useRef, useEffect } from "react";

const Popover = ({
  content = null,
  position = "bottom", // top | bottom | left | right
  offset = 10,
  background = "rgba(0,0,0,0.85)",
  color = "white",
  radius = 10,
  padding = 12,
  style = {},
  children,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const toggle = () => setOpen(!open);

  // Close when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const containerStyle = {
    position: "relative",
    display: "inline-block",
    ...style,
  };

  const popoverStyle = {
    position: "absolute",
    background,
    color,
    padding,
    borderRadius: radius,
    whiteSpace: "nowrap",
    zIndex: 1000,
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
    opacity: open ? 1 : 0,
    pointerEvents: open ? "auto" : "none",
    transition: "opacity 0.15s ease",
    ...(position === "top" && {
      bottom: `calc(100% + ${offset}px)`,
      left: "50%",
      transform: "translateX(-50%)",
    }),
    ...(position === "bottom" && {
      top: `calc(100% + ${offset}px)`,
      left: "50%",
      transform: "translateX(-50%)",
    }),
    ...(position === "left" && {
      right: `calc(100% + ${offset}px)`,
      top: "50%",
      transform: "translateY(-50%)",
    }),
    ...(position === "right" && {
      left: `calc(100% + ${offset}px)`,
      top: "50%",
      transform: "translateY(-50%)",
    }),
  };

  return (
    <div style={containerStyle} ref={ref} {...props}>
      <div onClick={toggle}>{children}</div>

      <div style={popoverStyle}>
        {content}
      </div>
    </div>
  );
};

export default Popover;
