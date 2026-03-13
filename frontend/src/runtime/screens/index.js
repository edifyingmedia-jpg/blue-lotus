// frontend/src/runtime/screens/index.js
import Projects from "./Projects.json";
import Studio from "./Studio.json";
import Home from "./Home.json";
import Dashboard from "./Dashboard.json";

/**
 * Screen Registry
 * ---------------------------------------------------------
 * This file defines all screens available in the runtime.
 * Each screen is loaded from a JSON file.
 */

const screens = {
  Home,
  Dashboard,
 Studio,
 Projects,

  // Temporary navigation test screen
  Next: {
    components: [
      {
        type: "Text",
        value: "You navigated to the next screen!"
      },
      {
        type: "Button",
        label: "Go Back",
        action: {
          type: "goBack"
        }
      }
    ]
  }
};

export default screens;
