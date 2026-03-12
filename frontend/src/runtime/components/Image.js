import React, { useState } from "react";
import useActionHandler from "../engine/useActionHandler";

/**
 * Enhanced Image Component
 * - fallback image
 * - loading shimmer
 * - error placeholder
 * - objectFit support
 * - aspectRatio support
 * - blur-up placeholder
 * - neon glow variant
 */

export default function Image({
  src,
  alt = "",
  action,
  style = {},
  objectFit = "cover",
  aspectRatio = null, // e.g. "16/9", "1/1", "4/3"
  radius = "8px",
  glow = false, // neon glow effect
  blur = false, // blur-up placeholder
  fallback = null,
  ...props
}) {
  const handleAction = useActionHandler(action);

  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const finalSrc = error && fallback ? fallback : src;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        borderRadius: radius,
        aspectRatio: aspectRatio || "auto",
        ...style,
      }}
      onClick={handleAction}
    >
      {/* Blur-up placeholder */}
      {blur && !loaded && !error && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#111",
            filter: "blur(20px)",
            opacity: 0.4,
          }}
        />
      )}

      {/* Loading shimmer */}
      {!loaded && !error && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 100%)",
            animation: "shimmer 1.5s infinite",
          }}
        />
      )}

      {/* Actual image */}
      <img
        src={finalSrc}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{
          width: "100%",
          height: "100%",
          objectFit,
          display: loaded ? "block" : "none",
          cursor: action ? "pointer" : "default",
          borderRadius: radius,
          ...(glow
            ? {
                boxShadow:
                  "0 0 12px rgba(0,255,255,0.6), 0 0 24px rgba(255,0,255,0.4)",
              }
            : {}),
        }}
        {...props}
      />

      {/* Error placeholder */}
      {error && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#222",
            color: "#fff",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: radius,
          }}
        >
          Image failed to load
        </div>
      )}

      {/* Shimmer animation */}
      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </div>
  );
}
