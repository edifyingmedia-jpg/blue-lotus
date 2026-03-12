// frontend/src/runtime/components/Image.js

import React, { useState } from "react";
import useActionHandler from "../engine/useActionHandler";
import { theme } from "../../theme";

/**
 * Blue Lotus Cinematic Image Component
 * - Smooth fade‑in on load
 * - Loading shimmer
 * - Error fallback
 * - Tri‑Neon glow (optional)
 * - Radius, fit, full styling
 * - Click actions supported
 */

export default function Image({
  src,
  alt = "",
  action = null,
  width = "100%",
  height = "auto",
  radius = 8,
  fit = "cover",
  glow = true,
  intensity = 0.55,
  style = {},
  ...props
}) {
  const handleAction = useActionHandler(action);

  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const glowStyle = glow
    ? {
        boxShadow: `
          0 0 ${2 * intensity}px ${theme.colors.primary},
          0 0 ${4 * intensity}px ${theme.colors.primary},
          0 0 ${6 * intensity}px ${theme.colors.primary}
        `,
      }
    : {};

  const shimmerStyle = {
    background: "linear-gradient(90deg, #222 0%, #333 50%, #222 100%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.2s infinite",
  };

  const fallbackStyle = {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
  };

  return (
    <div
      onClick={handleAction}
      style={{
        width,
        height,
        borderRadius: radius,
        overflow: "hidden",
        position: "relative",
        cursor: action ? "pointer" : "default",
        transition: "all 0.25s ease",
        ...glowStyle,
        ...style,
      }}
      {...props}
    >
      {/* Loading shimmer */}
      {!loaded && !error && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            ...shimmerStyle,
          }}
        />
      )}

      {/* Error fallback */}
      {error && (
        <div style={{ position: "absolute", inset: 0, ...fallbackStyle }}>
          Image unavailable
        </div>
      )}

      {/* Actual image */}
      {!error && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: fit,
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.35s ease",
          }}
        />
      )}

      {/* Keyframes for shimmer */}
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}
      </style>
    </div>
  );
}
