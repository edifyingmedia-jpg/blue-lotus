// frontend/src/runtime/components/UI/Card.jsx

import React from "react";

const Card = ({ children, padding = "p-4", glow = "cyan" }) => {
  const glowRing =
    glow === "pink"
      ? "shadow-[0_0_15px_rgba(255,0,128,0.4)]"
      : glow === "purple"
      ? "shadow-[0_0_15px_rgba(128,0,255,0.4)]"
      : "shadow-[0_0_15px_rgba(0,255,255,0.4)]"; // default cyan

  return (
    <div
      className={`
        ${padding}
        rounded-xl
        bg-black/40
        border border-slate-700
        backdrop-blur-md
        transition-all duration-300
        ${glowRing}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
