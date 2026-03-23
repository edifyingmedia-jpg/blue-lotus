// frontend/src/runtime/screens/DynamicScreen.js

/**
 * DynamicScreen.js
 * ---------------------------------------------------------
 * Runtime screen wrapper responsible for:
 *  - Loading a screen definition by name
 *  - Passing it into the ScreenEngine
 *  - Rendering it via ScreenRenderer
 *
 * This file is runtime‑critical and must remain deterministic.
 */

import React, { useEffect, useState } from 'react';
import ScreenEngine from './ScreenEngine';
import ScreenRenderer from './ScreenRenderer';

export default function DynamicScreen({ screenName }) {
  const [screen, setScreen] = useState(null);

  useEffect(() => {
    if (!screenName) return;

    const loadedScreen = ScreenEngine.load(screenName);
    setScreen(loadedScreen);
  }, [screenName]);

  if (!screen) return null;

  return <ScreenRenderer screen={screen} />;
}
