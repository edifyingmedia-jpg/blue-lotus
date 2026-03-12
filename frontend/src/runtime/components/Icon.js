import React from "react";
import useActionHandler from "../engine/useActionHandler";

const Icon = ({
  src = "",
  size = 20,
  color = "white",
  style = {},
  action,
  ...props
}) => {
  const handleAction = useActionHandler(action);

  const isEmoji = src.length === 1 || src.length === 2;
  const isUrl = src.startsWith("http");
  const isSvg = src.trim().startsWith("<svg");

  // Emoji icon
  if (isEmoji) {
    return (
      <span
        onClick={handleAction}
        style={{
          fontSize: size,
          lineHeight: 1,
          display: "inline-block",
          cursor: action ? "pointer" : "default",
          color,
          ...style
        }}
        {...props}
      >
        {src}
      </span>
    );
  }

  // Inline SVG string
  if (isSvg) {
    return (
      <span
        onClick={handleAction}
        style={{
          width: size,
          height: size,
          display: "inline-block",
          cursor: action ? "pointer" : "default",
          ...style
        }}
        dangerouslySetInnerHTML={{ __html: src }}
        {...props}
      />
    );
  }

  // URL-based icon (PNG/SVG)
  if (isUrl) {
    return (
      <img
        src={src}
        onClick={handleAction}
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          display: "inline-block",
          cursor: action ? "pointer" : "default",
          ...style
        }}
        {...props}
      />
    );
  }

  // Fallback: render nothing
  return null;
};

export default Icon;
