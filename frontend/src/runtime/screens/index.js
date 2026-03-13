// frontend/src/runtime/screens/index.js

import Home from "./Home.json";

/**
 * Screen Registry
 * ---------------------------------------------------------
 * This file defines all screens available in the runtime.
 * Each screen is loaded from a JSON file.
 */

const screens = {
  Home,

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
