import React, { useState } from "react";

const Chip = ({
  label = "",
  selected = false,
  onSelect = () => {},
  onRemove = null, // optional
  color = "cyan",
  background = "rgba(255, 255, 255, 0.08)",
  selectedBackground = "rgba(0, 255, 255, 0.15)",
  radius = 12,
  padding = "6px 12px",
  style = {},
  ...props
}) => {
  const [isSelected, setIsSelected] = useState(selected);

  const toggle = () => {
    const newValue = !isSelected;
    setIsSelected(newValue);
    onSelect(newValue);
  };

  const containerStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding,
    borderRadius: radius,
    cursor: "pointer",
    background: isSelected ? selectedBackground : background,
    border: `1px solid ${isSelected ? color : "rgba(255, 255, 255, 0.2)"}`,
    color: "white",
    fontSize: 13,
    transition: "all 0.2s ease",
    ...style,
  };

  const removeStyle = {
    cursor: "pointer",
    opacity: 0.7,
    fontWeight: "bold",
  };

  return (
    <div style={containerStyle} onClick={toggle} {...props}>
      <span>{label}</span>

      {onRemove && (
        <span
          style={removeStyle}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          ×
        </span>
      )}
    </div>
  );
};

export default Chip;
