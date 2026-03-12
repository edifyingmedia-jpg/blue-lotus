import React from "react";

export default function CardSection({ children, style, ...props }) {
  return (
    <div
      style={{
        padding: "12px 0",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
}
