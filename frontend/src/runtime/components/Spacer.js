import React from "react";

const Spacer = ({ size = 16, horizontal = false, style = {}, ...props }) => {
  const baseStyle = horizontal
    ? { width: size, height: "1px" }
    : { height: size, width: "1px" };

  return <div style={{ ...baseStyle, ...style }} {...props} />;
};

export default Spacer;
