// frontend/src/runtime/index.js

/**
 * Runtime Export Barrel
 * ---------------------------------------------------------
 * Centralizes exports for the entire runtime subsystem.
 */

export * from "./engine";
export * from "./resolver";
export * from "./state";
export * from "./view"; // screen runtime engine
export { default as screens } from "./screens"; // JSON screen registry
