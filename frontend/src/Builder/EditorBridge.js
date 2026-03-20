// frontend/src/Builder/EditorBridge.js

/**
 * EditorBridge
 * ---------------------------------------------------------
 * Connects AI (TWIN) to the Builder Engine.
 *
 * Responsibilities:
 *  - Receive natural-language edit requests
 *  - Interpret high-level instructions
 *  - Dispatch structured actions to BuilderEngine
 *  - Provide a safe, predictable API for AI-driven editing
 */

import { useBuilder } from "./BuilderContext";

export default function EditorBridge() {
  const { builderState, actions } = useBuilder();

  /**
   * Apply an AI-driven instruction.
   * Example payload:
   * {
   *   type: "update",
   *   target: "selected",
   *   data: { props: { text: "Hello" } }
   * }
   */
  function apply(instruction) {
    if (!instruction || typeof instruction !== "object") {
      console.warn("EditorBridge: Invalid instruction", instruction);
      return;
    }

    const { type, target, data } = instruction;

    switch (type) {
      case "add":
        if (!data?.component) return;
        actions.addComponent(data.component);
        break;

      case "remove":
        if (target === "selected" && builderState.selected) {
          actions.removeComponent(builderState.selected);
        } else if (data?.id) {
          actions.removeComponent(data.id);
        }
        break;

      case "update":
        if (target === "selected" && builderState.selected) {
          actions.updateComponent(builderState.selected, data);
        } else if (data?.id) {
          actions.updateComponent(data.id, data.update);
        }
        break;

      case "select":
        if (data?.id) {
          actions.selectComponent(data.id);
        }
        break;

      default:
        console.warn("EditorBridge: Unknown instruction type:", type);
    }
  }

  return {
    apply,
    state: builderState,
  };
}
