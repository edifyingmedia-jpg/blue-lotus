// frontend/src/Builder/components/Canvas/Canvas.js

/**
 * Canvas.js
 * ---------------------------------------------------------
 * The Builder's live editing surface.
 *
 * Responsibilities:
 *  - Render the active screen from the DocumentModel
 *  - Handle selection, hover, and focus states
 *  - Forward interactions to BuilderEngine
 *  - Provide a deterministic editing environment
 */

import React, { useContext, useCallback } from 'react';
import { BuilderContext } from '../../../BuilderContext';
import ComponentRenderer from '../../ComponentRenderer';

export default function Canvas() {
  const {
    activeScreen,
    documentModel,
    builderEngine,
    selection,
    setSelection
  } = useContext(BuilderContext);

  /**
   * Handle component selection inside the canvas.
   */
  const handleSelect = useCallback(
    (componentId) => {
      setSelection(componentId);
      builderEngine.selectComponent(componentId);
    },
    [builderEngine, setSelection]
  );

  /**
   * Render the active screen's component tree.
   */
  const renderActiveScreen = () => {
    if (!activeScreen) {
      return <div className="canvas-empty">No screen selected</div>;
    }

    const screen = documentModel.screens.find(
      (s) => s.id === activeScreen
    );

    if (!screen) {
      return <div className="canvas-error">Screen not found</div>;
    }

    return (
      <ComponentRenderer
        components={screen.components}
        onSelect={handleSelect}
        selection={selection}
      />
    );
  };

  return (
    <div className="canvas-container">
      {renderActiveScreen()}
    </div>
  );
}
