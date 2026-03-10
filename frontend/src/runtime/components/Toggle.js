import React, { useState } from "react";

const Toggle = ({
  value = false,
  onChange = () => {},
  width = 44,
  height = 24,
  colorOn = "cyan",
  colorOff = "rgba(255, 255, 255, 0.3)",
  knobColor = "white",
  style = {},
  ...props
}) => {
  const [internal, setInternal] = useState(value);

  const toggle = () => {
    const newValue = !internal;
    setInternal(newValue);
    onChange(newValue);
  };

  const containerStyle = {
    width,
    height,
    borderRadius: height / 2,
    background: internal ? colorOn : colorOff,
    position: "relative",
    cursor: "pointer",
    transition: "background 0.2s ease",
    ...style,
  };

  const knobStyle = {
    width: height - 4,
    height: height - 4,
    borderRadius: "50%",
    background: knobColor,
    position: "absolute",
    top: 2,
    left: internal ? width - height + 2 : 2,
    transition: "left 0.2s ease",
  };

  return (
    <div style={containerStyle} onClick={toggle} {...props}>
      <div style={knobStyle} />
    </div>
  );
};

export default Toggle;
