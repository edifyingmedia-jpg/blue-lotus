// frontend/src/runtime/components/Navigation.js

import React, { useState, useEffect, useCallback } from "react";
import { theme } from "../../theme";

/**
 * Blue Lotus Cinematic Navigation
 * - Stack-based navigation
 * - Smooth fade transitions
 * - Optional slide animation
 * - History support
 * - Safe, predictable, Emergent-style behavior
 */

export default function Navigation({
  initial = null,
  children,
  animation = "fade", // "fade" | "slide"
  duration = 220,
  style = {},
}) {
  const screens = React.Children.toArray(children);

  const findScreen = useCallback(
    (name) => screens.find((s) => s.props.name === name),
    [screens]
  );

  const [stack, setStack] = useState(
    initial ? [initial] : screens.length ? [screens[0].props.name] : []
  );

  const current = stack[stack.length - 1];
  const CurrentScreen = findScreen(current);

  const navigate = useCallback(
    (name) => {
      if (!findScreen(name)) return;
      setStack((prev) => [...prev, name]);
    },
    [findScreen]
  );

  const goBack = useCallback(() => {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  // Expose navigation globally (Emergent-style)
  useEffect(() => {
    window.$nav = { navigate, back: goBack };
  }, [navigate, goBack]);

  const transitionStyle =
    animation === "slide"
      ? {
          transform: "translateX(0)",
          transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
        }
      : {
          opacity: 1,
          transition: `opacity ${duration}ms ease`,
        };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        key={current}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1,
          ...(animation === "slide"
            ? { transform: "translateX(0%)" }
            : {}),
          ...transitionStyle,
        }}
      >
        {CurrentScreen}
      </div>
    </div>
  );
}
