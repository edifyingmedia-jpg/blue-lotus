/**
 * exportActions.js
 * ---------------------------------------------------------
 * Centralized export surface for all Builder-side actions.
 *
 * This file ensures the BuilderEngine, UI panels, and
 * EditorBridge can import actions deterministically without
 * relying on legacy registries or dynamic resolution.
 */

import addScreen from './addScreen';
import * as screenActions from './screenActions';

export {
  addScreen,
  screenActions
};

export default {
  addScreen,
  screenActions
};
