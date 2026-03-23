/**
 * index.js
 * ---------------------------------------------------------
 * Entry point for Builder-side actions.
 *
 * Provides a clean, deterministic export surface for all
 * Builder actions used by the BuilderEngine, EditorBridge,
 * and UI panels.
 */

import addScreen from './addScreen';
import * as screenActions from './screenActions';
import actions from './exportActions';

export {
  addScreen,
  screenActions,
  actions
};

export default actions;
