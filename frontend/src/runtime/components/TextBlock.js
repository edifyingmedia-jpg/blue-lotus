import React from "react";

const TextBlock = ({ text = "", style = {}, ...props }) => {
  const baseStyle = {
    fontSize: 16,
    lineHeight: 1.5,
    width: "100%",
    ...style,
  };

  return (
    <div style={baseStyle} {...props}>
      {text}
    </div>
  );
};

export default TextBlock;
