// frontend/src/runtime/components/Modal.js

import React, { useEffect } from "react";
import useActionHandler from "../engine/useActionHandler";
import { theme } from "../../theme";

/**
 * Blue Lotus Tri‑Neon Modal
 * - Backdrop
 * - Centered modal box
 * - Neon glow
 * - ESC close
 * - Click‑outside close
 * - onOpen action
 */

export default function Modal({
  visible = false,
  width = "80%",
  maxWidth = 480,
  padding = 24,
  radius = 12,
  glow = true,
  intensity = 0.55,
  style = {},
  children,
  onClose = () => {},
  action,
  ...props
}) {
  const handleAction = useActionHandler(action);

  // Trigger action when modal becomes visible
  useEffect(() => {
    if (visible && action) handleAction();
  }, [visible]);

  const neonColor = theme.colors.white;

  const glowStyle = glow
    ? {
        boxShadow: `
          0 0 ${2 * intensity}px ${neonColor},
          0 0 ${4 * intensity}px ${neonColor},
          0 0 ${6 * intensity}px ${neonColor}
        `,
      }
    : {};

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width,
          maxWidth,
          padding,
          borderRadius: radius,
          background: theme.colors.black,
          color: theme.colors.white,
          transition: "all 0.2s ease-out",
          ...glowStyle,
          ...style,
        }}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}
