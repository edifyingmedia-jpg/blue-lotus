import React from "react";

const CardMedia = ({
  src = "",
  height = 180,
  radius = 12,
  fit = "cover",
  style = {},
  alt = "media",
  ...props
}) => {
  const baseStyle = {
    width: "100%",
    height: height,
    borderRadius: radius,
    objectFit: fit,
    display: "block",
    ...style,
  };

  // If it's a video
  if (src.endsWith(".mp4") || src.endsWith(".webm")) {
    return (
      <video
        src={src}
        style={baseStyle}
        {...props}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }

  // Default: image
  return <img src={src} alt={alt} style={baseStyle} {...props} />;
};

export default CardMedia;
