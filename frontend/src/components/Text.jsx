import React from "react";

/**
 * Text
 * ---------------------------------------------------------
 * Cinematic, flexible typography for Blue Lotus.
 * Supports variants, neon accents, truncation, clamping,
 * semantic tags, and emotionally intelligent styling.
 */

const Text = ({
  children,
  as = "p",                // semantic tag: p, span, h1–h6
  size = "1rem",
  weight = 400,
  color = "#ffffff",
  align = "left",
  opacity = 1,
  letterSpacing = "0px",
  transform = "none",      // uppercase, lowercase, capitalize
  inline = false,
  maxLines = null,         // line clamp
  truncate = false,        // single-line ellipsis
  variant = "default",     // default | subtle | neon | dim | glow
  style = {},
  ...rest
}) => {
  const Tag = as;

  // Variant styling
  const variantStyles = {
    default: {},
    subtle: { opacity: 0.75 },
    dim: { opacity: 0.55 },
    neon: {
      color: "#7df9ff",
      textShadow: "0 0 8px rgba(125, 249, 255, 0.75)",
    },
    glow: {
      color: "#e29bff",
      textShadow: "0 0 12px rgba(226, 155, 255, 0.85)",
    },
  };

  // Line clamp
  const clampStyles =
    maxLines != null
      ? {
          display: "-webkit-box",
          WebkitLineClamp: maxLines,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }
      : {};

  // Truncate (single line)
  const truncateStyles = truncate
    ? {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }
    : {};

  return (
    <Tag
      style={{
        fontSize: size,
        fontWeight: weight,
        color,
        textAlign: align,
        opacity,
        letterSpacing,
        textTransform: transform,
        lineHeight: 1.5,
        margin: inline ? "0" : "0 0 0.5rem 0",
        display: inline ? "inline" : "block",
        transition: "all 0.25s ease",
        ...variantStyles[variant],
        ...clampStyles,
        ...truncateStyles,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Text;
