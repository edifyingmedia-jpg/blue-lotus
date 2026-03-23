// frontend/src/Builder/actions/addScreen.js

/**
 * addScreen.js
 * ---------------------------------------------------------
 * Builder-side action for creating a new screen inside the
 * active project DocumentModel.
 *
 * This action:
 *  - Generates a unique screen ID
 *  - Creates a valid screen object
 *  - Inserts it into the DocumentModel
 *  - Returns the new screen metadata for UI updates
 *
 * This file contains *no runtime logic* and does not
 * interact with the runtime ScreenEngine or ScreenLoader.
 */

import { v4 as uuid } from 'uuid';

/**
 * Creates a new screen inside the project document.
 *
 * @param {Object} documentModel - The active project model
 * @param {Object} options - Optional screen metadata
 * @returns {Object} The newly created screen object
 */
export function addScreen(documentModel, options = {}) {
  if (!documentModel) {
    throw new Error('addScreen: documentModel is required.');
  }

  const screenId = uuid();
  const screenName = options.name || `Screen_${screenId.slice(0, 8)}`;

  const newScreen = {
    id: screenId,
    name: screenName,
    type: 'screen',
    components: [],
    params: {},
    ...options
  };

  // Insert into the DocumentModel
  documentModel.screens = documentModel.screens || [];
  documentModel.screens.push(newScreen);

  return newScreen;
}

export default addScreen;
