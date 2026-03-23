// frontend/src/Builder/components/ScreenList/AddScreenButton.js

/**
 * AddScreenButton.js
 * ---------------------------------------------------------
 * UI button for creating a new screen inside the Builder.
 *
 * Responsibilities:
 *  - Trigger addScreen action
 *  - Update DocumentModel through BuilderEngine
 *  - Select the newly created screen
 */

import React, { useContext } from 'react';
import { BuilderContext } from '../../../BuilderContext';
import { addScreen } from '../../../actions';

export default function AddScreenButton() {
  const { builderEngine, documentModel, setActiveScreen } =
    useContext(BuilderContext);

  const handleAdd = () => {
    const newScreen = addScreen(documentModel);
    builderEngine.refresh(); // ensure UI sync
    setActiveScreen(newScreen.id);
  };

  return (
    <button className="screenlist-add-button" onClick={handleAdd}>
      + Add Screen
    </button>
  );
}
