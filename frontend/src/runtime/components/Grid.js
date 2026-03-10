import React from "react";

const Grid = ({
  columns = 2,
  gap = 16,
  style = {},
  children,
  ...props
}) => {
  const baseStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: gap,
    width: "100%",
    ...style,
  };

  return (
    <div style={baseStyle} {...props}>
      {children}
    </div>
  );
};

export default Grid;
