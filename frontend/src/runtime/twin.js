// frontend/src/runtime/twin.js

import { askTwin } from "./twinClient";

export const TWIN = {
  async generate(prompt) {
    return await askTwin(prompt);
  }
};
