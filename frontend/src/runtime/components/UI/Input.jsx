// frontend/src/runtime/components/UI/Input.jsx

import React from "react";

const Input = ({
  value = "",
  placeholder = "Enter text...",
  onChange,
  color = "cyan",
}) => {
  const glowColor =
    color === "pink"
      ? "focus:ring-pink-400 focus:border-pink-400"
      : color === "purple"
      ? "focus:ring-purple-400 focus:border-purple-400"
      : "focus:ring-cyan-400 focus:border-cyan-400"; // default cyan

  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange && onChange(e.target.value)}
      className={`
        w-full px-4 py-2 rounded-md bg-black/40 text-white
        border border-slate-700
        placeholder-slate-500
        outline-none transition-all duration-200
        ${glowColor}
        focus:ring-2
      `}
    />
  );
};

export default Input;
