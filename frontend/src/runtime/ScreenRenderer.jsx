// frontend/src/runtime/ScreenRenderer.jsx

import React from "react";
import ComponentRegistry from "./components";
import { handleNavigation } from "./navigation";

const ScreenRenderer = ({ screen, screens, navigation, bundle, blueprint }) => {
  if (!screen) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-300">
        Screen not found.
      </div>
    );
  }

  // If the screen uses a template, render that template component
  if (screen.template) {
    const Template = ComponentRegistry.templates[screen.template];

    if (!Template) {
      return (
        <div className="w-full h-full flex items-center justify-center text-slate-300">
          Template "{screen.template}" not found.
        </div>
      );
    }

    return (
      <Template
        screen={screen}
        screens={screens}
        navigation={navigation}
        bundle={bundle}
        blueprint={blueprint}
        onNavigate={(target) =>
          handleNavigation(target, screens, navigation)
        }
      />
    );
  }

  // Otherwise, render components from the registry
  return (
    <div className="w-full h-full p-4 text-slate-200">
      {Array.isArray(screen.components) && screen.components.length > 0 ? (
        screen.components.map((node, index) => {
          const Component = ComponentRegistry[node.type];

          if (!Component) {
            return (
              <div
                key={index}
                className="text-red-300 text-sm border border-red-500/40 p-2 rounded-md mb-2"
              >
                Unknown component type: <strong>{node.type}</strong>
              </div>
            );
          }

          return (
            <Component
              key={index}
              {...node.props}
              onNavigate={(target) =>
                handleNavigation(target, screens, navigation)
              }
            />
          );
        })
      ) : (
        <div className="text-slate-400 text-sm">
          This screen has no components yet.
        </div>
      )}
    </div>
  );
};

export default ScreenRenderer;
