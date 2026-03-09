// frontend/src/runtime/navigation.js

// Handles navigation events inside the runtime.
// This is intentionally simple and safe.

export function handleNavigation(target, screens, navigation) {
  if (!target) return;

  // If the target is a path ("/login", "/home", etc.)
  if (typeof target === "string" && target.startsWith("/")) {
    window.location.href = target;
    return;
  }

  // If the target is a screen ID
  const screen = screens.find((s) => s.id === target);

  if (screen) {
    const path = screen.path || `/${screen.id}`;
    window.location.href = path;
    return;
  }

  console.warn("Navigation target not found:", target);
}
