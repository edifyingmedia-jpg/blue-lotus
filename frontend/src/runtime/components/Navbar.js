import React from "react";
import useActionHandler from "../engine/useActionHandler";

const Navbar = ({
  title = "",
  left = null,      // { label, icon, action }
  right = null,     // { label, icon, action }
  height = 56,
  padding = "0 16px",
  background = "rgba(0,0,0,0.6)",
  blur = true,
  style = {},
  ...props
}) => {
  const handleLeft = useActionHandler(left?.action);
  const handleRight = useActionHandler(right?.action);

  const barStyle = {
    height,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding,
    background,
    backdropFilter: blur ? "blur(8px)" : "none",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    color: "white",
    ...style,
  };

  const sideStyle = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
    userSelect: "none",
  };

  const titleStyle = {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "1.1rem",
    pointerEvents: "none",
  };

  const renderSide = (side, handler) => {
    if (!side) return <div style={{ width: 40 }} />;

    return (
      <div style={sideStyle} onClick={handler}>
        {side.icon && (
          <span style={{ fontSize: 18, display: "flex" }}>{side.icon}</span>
        )}
        {side.label && <span>{side.label}</span>}
      </div>
    );
  };

  return (
    <div style={barStyle} {...props}>
      {renderSide(left, handleLeft)}
      <div style={titleStyle}>{title}</div>
      {renderSide(right, handleRight)}
    </div>
  );
};

export default Navbar;
