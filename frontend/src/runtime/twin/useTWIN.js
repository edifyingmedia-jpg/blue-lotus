/**
 * useTWIN.js
 * ----------------------------------------------------
 * React hook that exposes TWIN orchestration functions
 * to the UI layer. This is owner-only and only active
 * inside the Blue Lotus builder environment.
 *
 * End users of generated apps NEVER have access to TWIN.
 */

import { useMemo } from "react";
import TWINActionEngine from "./ActionEngine";

export default function useTWIN() {
  // Expose a stable API surface
  return useMemo(() => {
    return {
      run: (action, payload) => TWINActionEngine.run(action, payload),

      // Convenience wrappers
      generateProject: (payload) =>
        TWINActionEngine.generateProject(payload),

      validateProject: (payload) =>
        TWINActionEngine.validateProject(payload),

      loadProject: (payload) =>
        TWINActionEngine.loadProject(payload),

      syncSchema: (payload) =>
        TWINActionEngine.syncSchema(payload),

      repairSchema: (payload) =>
        TWINActionEngine.repairSchema(payload),

      generateBuilder: (payload) =>
        TWINActionEngine.generateBuilder(payload),

      repairBuilder: (payload) =>
        TWINActionEngine.repairBuilder(payload),

      startDeployment: (payload) =>
        TWINActionEngine.startDeployment(payload),

      verifyDeployment: (payload) =>
        TWINActionEngine.verifyDeployment(payload),

      rollbackDeployment: (payload) =>
        TWINActionEngine.rollbackDeployment(payload),
    };
  }, []);
}
