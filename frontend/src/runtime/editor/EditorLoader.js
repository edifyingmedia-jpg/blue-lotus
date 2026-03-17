// frontend/src/runtime/editor/EditorLoader.js

/**
 * EditorLoader
 *
 * Dynamically injects the Blue Lotus editor into any host environment.
 * This allows the editor to run:
 * - inside InkNest
 * - inside Blink
 * - inside standalone pages
 * - inside future builder apps
 *
 * The loader:
 * 1. Creates a root container if missing
 * 2. Injects the editor entry point
 * 3. Ensures idempotent mounting (no duplicates)
 */

export function loadBlueLotusEditor() {
  const ROOT_ID = "blue-lotus-root";

  // Prevent duplicate mounts
  if (document.getElementById(ROOT_ID)) {
    console.warn("[Blue Lotus] Editor already mounted.");
    return;
  }

  // Create container
  const container = document.createElement("div");
  container.id = ROOT_ID;
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.position = "relative";
  container.style.background = "#000";

  document.body.appendChild(container);

  // Dynamically import the editor entry point
  import("./index.jsx")
    .then(() => {
      console.log("[Blue Lotus] Editor mounted successfully.");
    })
    .catch((err) => {
      console.error("[Blue Lotus] Failed to mount editor:", err);
    });
}

/**
 * Auto-load if the host environment sets:
 * <body data-blue-lotus-auto>
 */
export function autoLoadIfEnabled() {
  const auto = document.body?.dataset?.blueLotusAuto;
  if (auto !== undefined) {
    loadBlueLotusEditor();
  }
}

// Run auto-loader immediately
autoLoadIfEnabled();
