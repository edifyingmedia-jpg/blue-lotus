// frontend/src/components/Image.jsx

import React, { useState } from "react";

/**
 * Image
 * ---------------------------------------------------------
 * Cinematic, stable image component for Blue Lotus.
 * Supports glow variants, aspect ratio, loading shimmer,
 * error fallback, and JSON-friendly props.
 */

const GLOW = {
  none: {},
  cyan: {
    boxShadow: "0 0 12px rgba(0, 255, 255, 0.45)",
  },
  purple: {
    boxShadow: "0 0 12px rgba(128, 0, 255, 0.45)",
  },
  pink: {
    boxShadow: "0 0 12px rgba(255, 0, 128, 0.45)",
  },
};

const Image = ({
  src,
  alt = "",
  width = "100%",
  height = "auto",
  radius = "8px",
  fit = "cover",          // cover | contain | fill | none | scale-down
  aspectRatio = null,     // e.g. "16/9"
  glow = "none",          // none | cyan | purple | pink
  blur = false,
  fallbackColor = "rgba(255,255,255,0.08)",
  style = {},
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
        borderRadius: radius,
        background: fallbackColor,
        ...(aspectRatio && {
          aspectRatio,
          height: "auto",
        }),
        ...GLOW[glow],
        transition: "all 0.3s ease",
        ...style,
      }}
    >
      {!loaded && !error && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.12), rgba(255,255,255,0.05))",
            animation: "shimmer 1.5s infinite",
          }}
        />
      )}

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
            display: loaded ? "block" : "none",
            filter: blur ? "blur(6px)" : "none",
            transition: "all 0.3s ease",
          }}
          {...rest}
        />
      )}

      {error && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.4)",
            fontSize: "0.9rem",
          }}
        >
          Image unavailable
        </div>
      )}
    </div>
  );
};

export default Image;
