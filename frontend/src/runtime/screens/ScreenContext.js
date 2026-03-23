// frontend/src/runtime/screens/ScreenContext.js

/**
 * ScreenContext.js
 * ---------------------------------------------------------
 * React context for exposing runtime screen state.
 *
 * Responsibilities:
 *  - Provide the active screen to the UI layer
 *  - Subscribe to SceneManager updates
 *  - Keep React in sync with runtime state
 */

import React, { createContext, useEffect, useState } from 'react';
import sceneManager from './SceneManager';

export const ScreenContext = createContext(null);

export function ScreenProvider({ children }) {
  const [activeScreen, setActiveScreen] = useState(
    sceneManager.getActiveScene()
  );

  useEffect(() => {
    const unsubscribe = sceneManager.subscribe(setActiveScreen);
    return unsubscribe;
  }, []);

  return (
    <ScreenContext.Provider value={{ activeScreen }}>
      {children}
    </ScreenContext.Provider>
  );
}
