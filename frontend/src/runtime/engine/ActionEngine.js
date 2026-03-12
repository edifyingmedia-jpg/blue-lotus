import { useNavigation } from "./NavigationEngine";

/**
 * Central runtime action engine.
 * All actions triggered by components or screens flow through here.
 */

export function useActions() {
  const { navigate, goBack } = useNavigation();

  // Core dispatcher
  const run = async (action) => {
    if (!action || !action.type) return;

    try {
      switch (action.type) {
        case "navigate":
          return navigate(action.to);

        case "goBack":
          return goBack();

        case "alert":
          return window.alert(action.message || "");

        case "log":
          return console.log(action.message);

        case "toast":
          // Emits a toast event the ToastContainer listens for
          window.dispatchEvent(
            new CustomEvent("runtime-toast", {
              detail: {
                message: action.message,
                type: action.toastType || "default",
                duration: action.duration || 3000,
              },
            })
          );
          return;

        case "openModal":
          window.dispatchEvent(
            new CustomEvent("runtime-modal-open", {
              detail: action.modalId,
            })
          );
          return;

        case "closeModal":
          window.dispatchEvent(new CustomEvent("runtime-modal-close"));
          return;

        case "openDrawer":
          window.dispatchEvent(
            new CustomEvent("runtime-drawer-open", {
              detail: action.drawerId,
            })
          );
          return;

        case "closeDrawer":
          window.dispatchEvent(new CustomEvent("runtime-drawer-close"));
          return;

        case "setState":
          // Emits a state update event for screen-level state
          window.dispatchEvent(
            new CustomEvent("runtime-state-update", {
              detail: {
                key: action.key,
                value: action.value,
              },
            })
          );
          return;

        case "apiRequest":
          return await handleApiRequest(action);

        default:
          console.warn("Unknown action type:", action.type);
      }
    } catch (err) {
      console.error("ActionEngine error:", err);
    }
  };

  return { run };
}

/**
 * Handles API calls (GET/POST/etc.)
 * This can later be extended to Supabase, auth, etc.
 */
async function handleApiRequest(action) {
  const { url, method = "GET", body } = action;

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  // Emit event so screens can react to API results
  window.dispatchEvent(
    new CustomEvent("runtime-api-response", {
      detail: { action, data },
    })
  );

  return data;
}
