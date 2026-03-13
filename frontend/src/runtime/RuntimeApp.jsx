// RuntimeApp.jsx
// Clean, modern runtime root for Blue Lotus

import React, { useEffect, useState } from "react";
import NavigationEngine from "./NavigationEngine";
import ScreenRenderer from "./ScreenRenderer";
import navigation from "./navigation";

const engine = new NavigationEngine("Login");

export default function RuntimeApp() {
  const [currentScreen, setCurrentScreen] = useState(engine.current);

  useEffect(() => {
    // Listen for navigation changes
    const unsubscribe = engine.onChange((screenId) => {
      setCurrentScreen(screenId);
    });

    return unsubscribe;
  }, []);

  return (
    <div style={styles.appContainer}>
      <ScreenRenderer
        screenId={currentScreen}
        navigation={navigation(engine)}
        engine={engine}
      />
    </div>
  );
}

const styles = {
  appContainer: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    backgroundColor: "#000", // Cinematic base
  },
};
