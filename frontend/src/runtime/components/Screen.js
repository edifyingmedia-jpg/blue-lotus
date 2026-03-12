import React from "react";
import Container from "./Container";
import { theme } from "../../theme";

/**
 * Blue Lotus Screen Component
 * - Root wrapper for every user-created screen
 * - Provides safe padding, scroll behavior, and background
 * - Wraps children in a Container for consistent layout
 */

export default function Screen({
  children,
  padding = 20,
  background = theme.colors.background,
  scroll = true,
  style = {},
  ...props
}) {
  const Wrapper = scroll ? "div" : "div";

  const screenStyle = {
    width: "100%",
    minHeight: "100vh",
    background,
    overflowY: scroll ? "auto" : "visible",
    boxSizing: "border-box",
    ...style,
  };

  return (
    <Wrapper style={screenStyle} {...props}>
      <Container padding={padding}>
        {children}
      </Container>
    </Wrapper>
  );
}
