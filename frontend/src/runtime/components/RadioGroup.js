import React from "react";
import useActionHandler from "../engine/useActionHandler";

export default function RadioGroup({
  value,
  options = [],
  onChange = () => {},
  action,
  size = 18,
  color = "#7f5af0",
  borderColor = "rgba(255,255,255,0.4)",
  style = {},
  ...props
}) {
  const handleAction = useActionHandler(action);

  const handleSelect = (newValue) => {
    onChange(newValue);
    handleAction();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", ...style }} {...props}>
      {options.map((opt) => {
        const isSelected = value === opt.value;

        return (
          <div
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              gap: "10px"
            }}
          >
            <div
              style={{
                width: size,
                height: size,
                borderRadius: "50%",
                border: `2px solid ${borderColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease"
              }}
            >
              {isSelected && (
                <div
                  style={{
                    width: size * 0.55,
                    height: size * 0.55,
                    borderRadius: "50%",
                    background: color,
                    transition: "all 0.2s ease"
                  }}
                />
              )}
            </div>

            <span style={{ color: "#fff", fontSize: "0.95rem" }}>{opt.label}</span>
          </div>
        );
      })}
    </div>
  );
}
