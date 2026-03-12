import React from "react";
import useActionHandler from "../engine/useActionHandler";

export default function Card({ children, action, style, ...props }) {
  const handleAction = useActionHandler(action);

  return (
    <div
      onClick={handleAction}
      style={{
        padding: "16px",
        borderRadius: "12px",
        background: "#1E1E1E",
        border: "1px solid #333",
        cursor: action ? "pointer" : "default",
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
}
