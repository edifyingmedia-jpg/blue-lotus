// frontend/src/runtime/components/UI/Container.jsx

import React from "react";

const Container = ({
  children,
  maxWidth = "800px",
  padding = "1.5rem",
  center = true,
}) => {
  return (
    <div
      style={{
        maxWidth,
        padding,
        margin: center ? "0 auto" : undefined,
      }}
      className={`
        w-full
        transition-all duration-300
      `}
    >
      {children}
    </div>
  );
};

export default Container;
