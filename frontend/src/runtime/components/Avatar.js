import React from "react";

const Avatar = ({
  src = "",
  size = 64,
  radius = "50%",
  alt = "avatar",
  style = {},
  ...props
}) => {
  const baseStyle = {
    width: size,
    height: size,
    borderRadius: radius,
    objectFit: "cover",
    display: "block",
    ...style,
  };

  return <img src={src} alt={alt} style={baseStyle} {...props} />;
};

export default Avatar;
