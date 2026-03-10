// frontend/src/runtime/components/UI/Image.jsx

import React from "react";

const Image = ({
  src,
  alt = "",
  rounded = "md",
  glow = "cyan",
  width = "100%",
  height = "auto",
}) => {
  const glowRing =
    glow === "pink"
      ? "shadow-[0_0_12px_rgba(255,0,128,0.45)]"
      : glow === "purple"
      ? "shadow-[0_0_12px_rgba(128,0,255,0.45)]"
      : "shadow-[0_0_12px_rgba(0,255,255,0.45)]"; // default cyan

  const radius =
    rounded === "full"
      ? "rounded-full"
      : rounded === "lg"
      ? "rounded-lg"
      : rounded === "xl"
      ? "rounded-xl"
      : "rounded-md"; // default md

  return (
    <img
      src={src}
      alt={alt}
      style={{ width, height }}
      className={`
        ${radius}
        ${glowRing}
        transition-all duration-300
        object-cover
      `}
    />
  );
};

export default Image;
