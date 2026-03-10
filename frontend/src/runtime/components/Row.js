import React from "react";

const Row = ({ children, style = {}, ...props }) => {
  const baseStyle = {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    ...style,
  };

  return (
    <div style={baseStyle} {...props}>
      {children}
    </div>
  );
};

export default Row;
