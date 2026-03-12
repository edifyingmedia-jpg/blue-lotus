// frontend/src/runtime/components/Navigation.js

import React from "react";
import { useNavigate } from "react-router-dom";
import useActionHandler from "../engine/useActionHandler";
import { theme } from "../../theme";

/**
 * Blue Lotus Navigation Component
 * - Wraps NavigationEngine actions
 * - Supports push, replace, goBack
 * - Supports dynamic params
 * - Tri‑Neon styling for buttons/links
 */

export default function Navigation({
  to = "",
  type = "push", // push | replace | back
  params = {},
  children,
  style = {},
  glow = true,
  intensity = 0.55,
  color = theme.colors.cyan,
  action = null,
  ...props
}) {
  const navigate = useNavigate();
  const handleAction = useActionHandler(action);

  const neonColor = color;

  const glowStyle = glow
    ? {
        textShadow: `
          0 0 ${1 * intensity}px ${neonColor},
          0 0 ${2 * intensity}px ${neonColor},
          0 0 ${3 * intensity}px ${neonColor},
          0 0 ${4 * intensity}px ${neonColor}
        `,
      }
    : {};

  const handleNavigation = () => {
    if (action) handleAction();

    if (type === "back") {
      navigate(-1);
      return;
    }

    if (type === "replace") {
      navigate(to, { replace: true, state: params });
      return;
    }

    // default: push
    navigate(to, { state: params });
  };

  return (
    <span
      onClick={handleNavigation}
      style={{
        cursor: "pointer",
        color: neonColor,
        transition: "all 0.18s ease-out",
        ...glowStyle,
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
}
