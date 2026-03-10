// frontend/src/runtime/components/UI/Heading.jsx

import React from "react";

const Heading = ({
  level = 1,
  children,
  glow = "cyan",
  align = "left",
}) => {
  const Tag = level === 2 ? "h2" : level === 3 ? "h3" : "h1";

  const size =
    level === 2
      ? "text-2xl"
      : level === 3
      ? "text-xl"
      : "text-3xl"; // default H1

  const glowRing =
    glow === "pink"
      ? "shadow-[0_0_18px_rgba(255,0,128,0.45)] text-pink-300"
      : glow === "purple"
      ? "shadow-[0_0_18px_rgba(128,0,255,0.45)] text-purple-300"
      : "shadow-[0_0_18px_rgba(0,255,255,0.45)] text-cyan-300"; // default cyan

  return (
    <Tag
      className={`
        ${size}
        font-semibold
        ${glowRing}
        text-${align}
        transition-all duration-300
      `}
    >
      {children}
    </Tag>
  );
};

export default Heading;
