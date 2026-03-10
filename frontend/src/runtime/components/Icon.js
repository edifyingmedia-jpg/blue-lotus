import React from "react";

const Icon = ({
  src = "",
  size = 20,
  color = "white",
  style = {},
  ...props
}) => {
  const isEmoji = src.length === 1 || src.length === 2;

  // Emoji icon
  if (isEmoji) {
    const emojiStyle = {
      fontSize: size,
      lineHeight: 1,
      display: "inline-block",
      ...style,
    };
    return (
      <span style={emojiStyle} {...props}>
        {src}
      </span>
    );
  }

  // URL-based icon (PNG/SVG)
  if (src.startsWith("http")) {
    const imgStyle = {
      width: size,
      height: size,
      objectFit: "contain",
      display: "inline-block",
      ...style,
    };
    return <img src={src} style={imgStyle} {...props} />;
  }

  // Inline SVG path
  const svgStyle = {
    width: size,
    height: size,
    fill: color,
    display: "inline-block",
    ...style,
  };

  return (
    <svg viewBox="0 0 24 24" style={svgStyle} {...props}>
      <path d={src} />
    </svg>
  );
};

export default Icon;
