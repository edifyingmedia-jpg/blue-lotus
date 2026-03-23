// frontend/src/Builder/components/ComponentRenderer.js

/**
 * ComponentRenderer.js
 * ---------------------------------------------------------
 * Renders a single component node inside the Builder Canvas.
 *
 * Responsibilities:
 *  - Resolve the component type using ComponentRegistry
 *  - Render the component with its props
 *  - Render children recursively
 *  - Handle selection highlighting
 */

import React, { useContext } from 'react';
import { BuilderContext } from '../BuilderContext';
import ComponentRegistry from './ComponentRegistry';

export default function ComponentRenderer({ node }) {
  const { selectedComponent, setSelectedComponent } = useContext(BuilderContext);

  if (!node) return null;

  const Component = ComponentRegistry[node.type];
  if (!Component) {
    console.warn(`Unknown component type: ${node.type}`);
    return null;
  }

  const isSelected = selectedComponent === node.id;

  const handleClick = (e) => {
    e.stopPropagation();
    setSelectedComponent(node.id);
  };

  return (
    <div
      className={`component-wrapper${isSelected ? ' selected' : ''}`}
      onClick={handleClick}
    >
      <Component {...node.props}>
        {Array.isArray(node.children) &&
          node.children.map((child) => (
            <ComponentRenderer key={child.id} node={child} />
          ))}
      </Component>
    </div>
  );
}
