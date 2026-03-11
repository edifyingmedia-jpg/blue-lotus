import ComponentRegistry from "./components";

/**
 * Resolves a JSON node into a real React component.
 * 
 * Example node:
 * {
 *   "type": "View",
 *   "props": { "padding": 20 },
 *   "children": [
 *     { "type": "Text", "props": { "text": "Hello" } }
 *   ]
 * }
 */

export function resolveComponent(node) {
  if (!node || typeof node !== "object") return null;

  const { type, props = {}, children = [] } = node;

  // Look up the component in the registry
  const Component = ComponentRegistry[type];

  if (!Component) {
    console.warn(`⚠ Unknown component type: ${type}`);
    return null;
  }

  // Render children recursively
  const resolvedChildren = Array.isArray(children)
    ? children.map((child, index) => (
        <React.Fragment key={index}>{resolveComponent(child)}</React.Fragment>
      ))
    : null;

  return <Component {...props}>{resolvedChildren}</Component>;
}
