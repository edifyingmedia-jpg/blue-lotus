import React, { useState } from "react";
import useActionHandler from "../engine/useActionHandler";

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
  action,
  ...props
}) => {
  const [internal, setInternal] = useState(value);
  const handleAction = useActionHandler(action);

  const handleChange = (e) => {
    const newValue = Number(e.target.value);
    setInternal(newValue);
    onChange(newValue);
    handleAction();
  };

  return (
    <div style={{ width: "100%", ...style }} {...props}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={internal}
        onChange={handleChange}
        style={{
          width: "100%",
          appearance: "none",
          height,
          borderRadius: radius,
          background: trackColor,
          outline: "none",
          cursor: "pointer",
        }}
      />

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: ${thumbColor};
          cursor: pointer;
          margin-top: -6px;
        }

        input[type="range"]::-webkit-slider-runnable-track {
          height: ${height}px;
          border-radius: ${radius}px;
          background: linear-gradient(
            to right,
            ${fillColor} ${(internal - min) / (max - min) * 100}%,
            ${trackColor} ${(internal - min) / (max - min) * 100}%
          );
        }
      `}</style>
    </div>
  );
};

export default Slider;
