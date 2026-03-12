// frontend/src/runtime/components/Screen.js

import React from "react";
import Container from "./Container";
import { theme } from "../../theme";

/**
 * Blue Lotus Tri‑Neon Screen Component
 * - Root wrapper for every user-created screen
 * - Provides safe padding, scroll behavior, and background
 * - Wraps children in a Container for consistent layout
 */

export default function Screen({
  children,
  padding = 20,
  background = theme.colors.background,
  scroll = true,
  glow = false,
  intensity = 0.55,
  style = {},
  ...props
}) {
  const Wrapper = "div";

  const glowStyle = glow
    ? {
        boxShadow: `
          0 0 ${2 * intensity}px ${theme.colors.primary},
          0 0 ${4 * intensity}px ${theme.colors.primary},
          0 0 ${6 * intensity}px ${theme.colors.primary}
        `,
      }
    : {};

  const screenStyle = {
    width: "100%",
    minHeight: "100vh",
    background,
    overflowY: scroll ? "auto" : "visible",
    boxSizing: "border-box",
    ...glowStyle,
    ...style,
  };

  return (
    <Wrapper style={screenStyle} {...props}>
      <Container padding={padding}>{children}</Container>
    </Wrapper>
  );
}
