// frontend/src/Builder/components/TreeView/TreeView.js

/**
 * TreeView.js
 * ---------------------------------------------------------
 * Minimal component tree outline for the Builder.
 *
 * Responsibilities:
 *  - Display a list of components on the active screen
 *  - Highlight the selected component
 *  - Trigger component selection
 */

import React, { useContext } from 'react';
import { BuilderContext } from '../../../BuilderContext';
import TreeNode from './TreeNode';
import './TreeView.css';

export default function TreeView() {
  const {
    documentModel,
    activeScreen,
    selectedComponent,
    setSelectedComponent
  } = useContext(BuilderContext);

  const screen = documentModel.screens.find(s => s.id === activeScreen);
  if (!screen) return null;

  return (
    <div className="treeview-container">
      {screen.components.map((component) => (
        <TreeNode
          key={component.id}
          component={component}
          isSelected={component.id === selectedComponent}
          onSelect={() => setSelectedComponent(component.id)}
        />
      ))}
    </div>
  );
}
