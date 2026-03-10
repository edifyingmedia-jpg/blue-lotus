import React from "react";

const CardSection = ({ children, style = {}, ...props }) => {
  const baseStyle = {
    padding: 16,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    ...style,
  };

  return (
    <div style={baseStyle} {...props}>
      {children}
    </div>
  );
};

export default CardSection;
