import React, { useState } from "react";
import useActionHandler from "../engine/useActionHandler";

/**
 * Enhanced Icon Component
 * Supports:
 * - Emoji icons
 * - Remote URLs
 * - Inline SVG strings
 * - Local asset paths
 * - Neon glow
 * - Color + size control
 * - Error fallback
 */

export default function Icon({
  src = "",
  size = 20,
  color = "white",
  glow = false,
  style = {},
  action,
  ...props
}) {
  const handleAction = useActionHandler(action);
  const [error, setError] = useState(false);

  const isEmoji = src.length === 1 || src.length === 2;
  const isUrl = src.startsWith("http");
  const isSvg = src.trim().startsWith("<svg");

  // 1️⃣ Emoji icon
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
          ...(glow
            ? {
                textShadow:
                  "0 0 6px rgba(0,255,255,0.7), 0 0 12px rgba(255,0,255,0.5)",
              }
            : {}),
          ...style,
        }}
        {...props}
      >
        {src}
      </span>
    );
  }

  // 2️⃣ Inline SVG string
  if (isSvg) {
    return (
      <span
        onClick={handleAction}
        style={{
          width: size,
          height: size,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: action ? "pointer" : "default",
          ...(glow
            ? {
                filter:
                  "drop-shadow(0 0 6px rgba(0,255,255,0.7)) drop-shadow(0 0 12px rgba(255,0,255,0.5))",
              }
            : {}),
          ...style,
        }}
        dangerouslySetInnerHTML={{
          __html: src.replace("<svg", `<svg fill="${color}" width="${size}" height="${size}"`),
        }}
        {...props}
      />
    );
  }

  // 3️⃣ Remote URL or local asset
  if (isUrl || src.includes("/") || src.includes(".")) {
    return (
      <img
        src={error ? "" : src}
        onError={() => setError(true)}
        onClick={handleAction}
        alt=""
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          cursor: action ? "pointer" : "default",
          filter: glow
            ? "drop-shadow(0 0 6px rgba(0,255,255,0.7)) drop-shadow(0 0 12px rgba(255,0,255,0.5))"
            : "none",
          ...style,
        }}
        {...props}
      />
    );
  }

  // 4️⃣ Fallback (unknown icon type)
  return (
    <span
      onClick={handleAction}
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,255,255,0.1)",
        borderRadius: "4px",
        color,
        fontSize: size * 0.6,
        cursor: action ? "pointer" : "default",
        ...(glow
          ? {
              boxShadow:
                "0 0 6px rgba(0,255,255,0.7), 0 0 12px rgba(255,0,255,0.5)",
            }
          : {}),
        ...style,
      }}
      {...props}
    >
      ?
    </span>
  );
}
