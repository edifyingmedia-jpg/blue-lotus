// frontend/src/Builder/components/TreeView/TreeNode.js

/**
 * TreeNode.js
 * ---------------------------------------------------------
 * A single row in the TreeView.
 *
 * Responsibilities:
 *  - Display the component's type or label
 *  - Highlight when selected
 *  - Trigger selection when clicked
 */

import React from 'react';

export default function TreeNode({ component, isSelected, onSelect }) {
  return (
    <div
      className={
        'treenode-item' + (isSelected ? ' selected' : '')
      }
      onClick={onSelect}
    >
      {component.type}
    </div>
  );
}
