import React from "react";
import useActionHandler from "../engine/useActionHandler";

export default function Checkbox({
  checked = false,
  onChange = () => {},
  action,
  size = 20,
  color = "#7f5af0",
  borderColor = "rgba(255,255,255,0.4)",
  style = {},
  ...props
}) {
  const handleAction = useActionHandler(action);

  const toggle = () => {
    const newValue = !checked;
    onChange(newValue);
    handleAction();
  };

  return (
    <div
      onClick={toggle}
      style={{
        width: size,
        height: size,
        borderRadius: "4px",
        border: `2px solid ${borderColor}`,
        background: checked ? color : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.2s ease",
        ...style
      }}
      {...props}
    >
      {checked && (
        <span
          style={{
            color: "#fff",
            fontSize: size * 0.7,
            lineHeight: 1,
            userSelect: "none"
          }}
        >
          ✓
        </span>
      )}
    </div>
  );
}
