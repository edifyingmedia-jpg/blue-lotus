import React from "react";
import { theme } from "../../theme";

/**
 * Blue Lotus Container Component
 * - Core layout wrapper for all screens and components
 * - Flexbox-based layout system
 * - Supports direction, alignment, spacing, padding, margin, and background
 * - Fully theme-aware (Tri‑Neon token system)
 */

export default function Container({
  children,
  direction = "column",
  align = "flex-start",
  justify = "flex-start",
  gap = 0,
  padding = 0,
  margin = 0,
  width = "100%",
  height = "auto",
  background = "transparent",
  borderRadius = theme.radii.md,
  style = {},
  ...props
}) {
  const containerStyle = {
    display: "flex",
    flexDirection: direction,
    alignItems: align,
    justifyContent: justify,
    gap,
    padding,
    margin,
    width,
    height,
    background,
    borderRadius,
    fontFamily: theme.fonts.body,
    boxSizing: "border-box",
    ...style,
  };

  return (
    <div style={containerStyle} {...props}>
      {children}
    </div>
  );
}
