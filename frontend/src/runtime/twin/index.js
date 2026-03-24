/**
 * index.js (TWIN)
 * ----------------------------------------------------
 * Public export surface for the TWIN orchestration system.
 *
 * This file exposes:
 * - ActionEngine (execution layer)
 * - ActionDispatcher (routing layer)
 * - BindingEngine (binding resolution)
 * - TWINLogic (core orchestration logic)
 * - useTWIN (React hook for owner-only UI access)
 */

export { default as ActionDispatcher } from "./ActionDispatcher";
export { default as ActionEngine } from "./ActionEngine";
export { default as BindingEngine } from "./BindingEngine";
export { default as TWINLogic } from "./TWINLogic";
export { default as useTWIN } from "./useTWIN";
