// frontend/src/runtime/screens/index.js

/**
 * Screen Registry
 * ---------------------------------------------------------
 * This file defines all screens available in the runtime.
 * Each screen contains a list of components to render.
 */

const screens = {
  Home: {
    components: [
      {
        type: "Text",
        value: "Welcome to Blue Lotus Runtime",
      },
      {
        type: "Button",
        label: "Go to Next Screen",
        action: {
          type: "navigate",
          screen: "Next",
        },
      },
    ],
  },

  Next: {
    components: [
      {
        type: "Text",
        value: "You navigated to the next screen!",
      },
      {
        type: "Button",
        label: "Go Back",
        action: {
          type: "goBack",
        },
      },
    ],
  },
};

export default screens;
