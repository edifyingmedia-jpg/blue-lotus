import React, { useState } from "react";

const Slider = ({
  value = 0,
  min = 0,
  max = 100,
  step = 1,
  onChange = () => {},
  height = 6,
  trackColor = "rgba(255, 255, 255, 0.2)",
  fillColor = "cyan",
  thumbColor = "white",
  radius = 4,
  style = {},
  ...props
}) => {
  const [internal, setInternal] = useState(value);

  const handleChange = (e) => {
    const newValue = Number(e.target.value);
    setInternal(newValue);
    onChange(newValue);
  };

  const containerStyle = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    ...style,
  };

  const trackStyle = {
    width: "100%",
    height,
    borderRadius: radius,
    background: trackColor,
    position: "relative",
  };

  const fillStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    height,
    width: `${((internal - min) / (max - min)) * 100}%`,
    background: fillColor,
    borderRadius: radius,
    pointerEvents: "none",
  };

  const inputStyle = {
    position: "absolute",
    width: "100%",
    height,
    opacity: 0,
    cursor: "pointer",
  };

  const thumbStyle = {
    position: "absolute",
    top: -6,
    left: `calc(${((internal - min) / (max - min)) * 100}% - 8px)`,
    width: 16,
    height: 16,
    borderRadius: "50%",
    background: thumbColor,
    pointerEvents: "none",
    transition: "left 0.1s ease",
  };

  return (
    <div style={containerStyle} {...props}>
      <div style={trackStyle}>
        <div style={fillStyle} />
        <div style={thumbStyle} />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={internal}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>
    </div>
  );
};

export default Slider;
