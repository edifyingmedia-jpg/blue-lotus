// frontend/src/runtime/components/UI/Divider.jsx

import React from "react";

const Divider = ({ glow = "cyan", thickness = "1px", margin = "1rem 0" }) => {
  const glowRing =
    glow === "pink"
      ? "shadow-[0_0_10px_rgba(255,0,128,0.45)]"
      : glow === "purple"
      ? "shadow-[0_0_10px_rgba(128,0,255,0.45)]"
      : "shadow-[0_0_10px_rgba(0,255,255,0.45)]"; // default cyan

  return (
    <div
      className={`
        w-full
        bg-slate-700
        ${glowRing}
        rounded-full
        transition-all duration-300
      `}
      style={{
        height: thickness,
        margin,
      }}
    />
  );
};

export default Divider;
