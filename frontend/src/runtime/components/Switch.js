import React from "react";
import useActionHandler from "../engine/useActionHandler";

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
  action,
  ...props
}) => {
  const handleAction = useActionHandler(action);

  const toggle = () => {
    onChange(!checked);
    handleAction();
  };

  return (
    <div
      onClick={toggle}
      role="switch"
      aria-checked={checked}
      tabIndex={0}
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
      {...props}
    >
      <div
        style={{
          width: "18px",
          height: "18px",
          background: thumbColor,
          borderRadius: "50%",
          position: "absolute",
          top: "2px",
          left: checked ? "22px" : "2px",
          transition: "left 0.25s ease",
          cursor: "pointer",
        }}
      />
    </div>
  );
};

export default Switch;
