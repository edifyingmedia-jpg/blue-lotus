// frontend/src/runtime/editor/EditorScrollStyles.js

/**
 * EditorScrollStyles
 *
 * Injects global scrollbar styling for the Blue Lotus editor.
 * Uses the Tri-Neon theme colors and dark-mode surfaces.
 */

import { Theme } from "./EditorTheme";

export function injectEditorScrollStyles() {
  const style = document.createElement("style");
  style.innerHTML = `
    /* Scrollbar Track */
    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }

    ::-webkit-scrollbar-track {
      background: ${Theme.colors.bgPanel};
      border-radius: ${Theme.radius.md};
    }

    /* Scrollbar Thumb */
    ::-webkit-scrollbar-thumb {
      background: ${Theme.colors.neonPurple};
      border-radius: ${Theme.radius.md};
      box-shadow: 0 0 6px ${Theme.colors.neonPurple};
      transition: background 0.2s ease, box-shadow 0.2s ease;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: ${Theme.colors.neonPink};
      box-shadow: ${Theme.neonGlow("neonPink")};
    }

    /* Scrollbar Corner */
    ::-webkit-scrollbar-corner {
      background: ${Theme.colors.bgPanel};
    }
  `;

  document.head.appendChild(style);
}
