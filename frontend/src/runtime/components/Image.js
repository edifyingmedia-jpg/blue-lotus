import React from "react";
import useActionHandler from "../engine/useActionHandler";

export default function Image({
  src,
  alt = "",
  action,
  style = {},
  ...props
}) {
  const handleAction = useActionHandler(action);

  return (
    <img
      src={src}
      alt={alt}
      onClick={handleAction}
      style={{
        width: "100%",
        height: "auto",
        borderRadius: "8px",
        cursor: action ? "pointer" : "default",
        ...style
      }}
      {...props}
    />
  );
}
