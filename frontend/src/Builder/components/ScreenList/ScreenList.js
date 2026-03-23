// frontend/src/Builder/components/ScreenList/ScreenList.js

/**
 * ScreenList.js
 * ---------------------------------------------------------
 * Displays all screens in the project and allows the user
 * to select, rename, or delete screens.
 *
 * Responsibilities:
 *  - Render list of screens from DocumentModel
 *  - Highlight the active screen
 *  - Trigger screen selection
 *  - Provide UI hooks for rename/delete (future)
 */

import React, { useContext } from 'react';
import { BuilderContext } from '../../../BuilderContext';
import './ScreenList.css';
import AddScreenButton from './AddScreenButton';

export default function ScreenList() {
  const {
    documentModel,
    activeScreen,
    setActiveScreen,
    builderEngine
  } = useContext(BuilderContext);

  const handleSelect = (screenId) => {
    setActiveScreen(screenId);
    builderEngine.selectScreen(screenId);
  };

  return (
    <div className="screenlist-container">
      {documentModel.screens.map((screen) => (
        <div
          key={screen.id}
          className={
            'screenlist-item' +
            (screen.id === activeScreen ? ' selected' : '')
          }
          onClick={() => handleSelect(screen.id)}
        >
          <div className="screenlist-item-name">{screen.name}</div>
        </div>
      ))}

      <AddScreenButton />
    </div>
  );
}
