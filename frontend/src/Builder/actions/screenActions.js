/**
 * screenActions.js
 * ---------------------------------------------------------
 * Builder-side actions for manipulating screens inside the
 * project DocumentModel.
 *
 * These actions:
 *  - Rename screens
 *  - Delete screens
 *  - Duplicate screens
 *  - Update screen metadata
 *
 * All logic here is Builder-only and does NOT touch runtime
 * engines or runtime screen loading.
 */

import { v4 as uuid } from 'uuid';

/**
 * Rename a screen.
 *
 * @param {Object} documentModel
 * @param {string} screenId
 * @param {string} newName
 */
export function renameScreen(documentModel, screenId, newName) {
  if (!documentModel || !screenId) {
    throw new Error('renameScreen: documentModel and screenId are required.');
  }

  const screen = documentModel.screens?.find(s => s.id === screenId);
  if (!screen) {
    throw new Error(`renameScreen: screen ${screenId} not found.`);
  }

  screen.name = newName;
  return screen;
}

/**
 * Delete a screen.
 *
 * @param {Object} documentModel
 * @param {string} screenId
 */
export function deleteScreen(documentModel, screenId) {
  if (!documentModel || !screenId) {
    throw new Error('deleteScreen: documentModel and screenId are required.');
  }

  const before = documentModel.screens?.length || 0;

  documentModel.screens = (documentModel.screens || []).filter(
    s => s.id !== screenId
  );

  const after = documentModel.screens.length;

  return before !== after;
}

/**
 * Duplicate a screen.
 *
 * @param {Object} documentModel
 * @param {string} screenId
 */
export function duplicateScreen(documentModel, screenId) {
  if (!documentModel || !screenId) {
    throw new Error('duplicateScreen: documentModel and screenId are required.');
  }

  const original = documentModel.screens?.find(s => s.id === screenId);
  if (!original) {
    throw new Error(`duplicateScreen: screen ${screenId} not found.`);
  }

  const newId = uuid();
  const clone = {
    ...original,
    id: newId,
    name: `${original.name}_Copy`,
    components: JSON.parse(JSON.stringify(original.components))
  };

  documentModel.screens.push(clone);
  return clone;
}

/**
 * Update arbitrary screen metadata.
 *
 * @param {Object} documentModel
 * @param {string} screenId
 * @param {Object} updates
 */
export function updateScreen(documentModel, screenId, updates = {}) {
  if (!documentModel || !screenId) {
    throw new Error('updateScreen: documentModel and screenId are required.');
  }

  const screen = documentModel.screens?.find(s => s.id === screenId);
  if (!screen) {
    throw new Error(`updateScreen: screen ${screenId} not found.`);
  }

  Object.assign(screen, updates);
  return screen;
}

export default {
  renameScreen,
  deleteScreen,
  duplicateScreen,
  updateScreen
};
