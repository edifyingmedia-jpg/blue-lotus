// frontend/src/runtime/components/UI/Column.jsx

import React from "react";

const Column = ({
  children,
  gap = "1rem",
  align = "stretch",
  justify = "flex-start",
  fullHeight = false,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap,
        alignItems: align,
        justifyContent: justify,
        height: fullHeight ? "100%" : "auto",
      }}
      className="transition-all duration-300"
    >
      {children}
    </div>
  );
};

export default Column;
