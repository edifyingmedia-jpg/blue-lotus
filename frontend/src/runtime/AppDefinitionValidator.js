// frontend/src/runtime/AppDefinitionValidator.js

/**
 * AppDefinitionValidator
 * ---------------------------------------------------------
 * Ensures the appDefinition, components, and routes are valid
 * before the runtime engine attempts to render anything.
 *
 * This prevents:
 *  - dangling component references
 *  - missing root components
 *  - invalid node structures
 *  - invalid route definitions
 *
 * It does NOT:
 *  - mutate the appDefinition
 *  - invent missing components
 *  - auto-correct invalid structures
 */

export function validateAppDefinition({ appDefinition, components, routes }) {
  const errors = [];

  // -----------------------------------------------------
  // 1. Validate appDefinition existence
  // -----------------------------------------------------
  if (!appDefinition) {
    errors.push("appDefinition is missing.");
    return errors;
  }

  // -----------------------------------------------------
  // 2. Validate rootComponentId
  // -----------------------------------------------------
  if (!appDefinition.rootComponentId) {
    errors.push("appDefinition.rootComponentId is not set.");
  } else if (!components?.[appDefinition.rootComponentId]) {
    errors.push(
      `Root component "${appDefinition.rootComponentId}" does not exist in components map.`
    );
  }

  // -----------------------------------------------------
  // 3. Validate components map
  // -----------------------------------------------------
  if (!components || typeof components !== "object") {
    errors.push("components map is missing or invalid.");
    return errors;
  }

  Object.entries(components).forEach(([id, node]) => {
    if (!node) {
      errors.push(`Component "${id}" is null or undefined.`);
      return;
    }

    if (!node.type) {
      errors.push(`Component "${id}" is missing required field "type".`);
    }

    if (node.children && !Array.isArray(node.children)) {
      errors.push(`Component "${id}" has invalid "children" (must be an array).`);
    }

    if (node.children) {
      node.children.forEach((childId) => {
        if (!components[childId]) {
          errors.push(
            `Component "${id}" references missing child component "${childId}".`
          );
        }
      });
    }
  });

  // -----------------------------------------------------
  // 4. Validate routes
  // -----------------------------------------------------
  if (!routes || typeof routes !== "object") {
    errors.push("routes map is missing or invalid.");
    return errors;
  }

  Object.entries(routes).forEach(([routeName, route]) => {
    if (!route.rootComponentId) {
      errors.push(`Route "${routeName}" is missing rootComponentId.`);
      return;
    }

    if (!components[route.rootComponentId]) {
      errors.push(
        `Route "${routeName}" references missing root component "${route.rootComponentId}".`
      );
    }
  });

  return errors;
}

/**
 * Convenience helper:
 * Returns true if no validation errors exist.
 */
export function isAppDefinitionValid(args) {
  return validateAppDefinition(args).length === 0;
}

export default {
  validateAppDefinition,
  isAppDefinitionValid,
};
