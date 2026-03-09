// frontend/src/runtime/components/UI/Text.jsx

import React from "react";

const Text = ({ value, size = "base", color = "white", align = "left" }) => {
  const sizeClass = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
  }[size] || "text-base";

  const colorClass = {
    white: "text-white",
    slate: "text-slate-300",
    neon: "text-cyan-300",
    danger: "text-red-400",
  }[color] || "text-white";

  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align] || "text-left";

  return (
    <div className={`${sizeClass} ${colorClass} ${alignClass}`}>
      {value}
    </div>
  );
};

export default Text;
