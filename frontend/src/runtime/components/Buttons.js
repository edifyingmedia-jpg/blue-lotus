import React from "react";
import useActionHandler from "../engine/useActionHandler";

export default function Button({ text, action, ...props }) {
  const handleAction = useActionHandler(action);

  return (
    <button
      onClick={handleAction}
      style={{
        padding: "12px 20px",
        borderRadius: "8px",
        background: "#4A6CF7",
        color: "white",
        border: "none",
        cursor: "pointer",
        fontSize: "16px",
        ...props.style
      }}
    >
      {text}
    </button>
  );
}
