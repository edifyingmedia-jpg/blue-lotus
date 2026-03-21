// frontend/src/Builder/BuilderContext.js

/**
 * BuilderContext
 * ---------------------------------------------------------
 * Global state + actions for the Blue Lotus Builder.
 * Provides selection, screen switching, prop updates,
 * component tree manipulation, and project-level actions.
 */

import React, { createContext, useContext, useReducer } from "react";
import SceneManager from "./SceneManager";
import ProjectLoader from "./ProjectLoader";

const BuilderContext = createContext(null);

export function useBuilder() {
  return useContext(BuilderContext);
}

// ---------------------------------------------------------
// Reducer
// ---------------------------------------------------------

function reducer(state, action) {
  switch (action.type) {
    case "LOAD_PROJECT":
      return {
        ...state,
        ...ProjectLoader.load(action.project),
      };

    case "SET_CURRENT_SCREEN":
      return {
        ...state,
        currentScreen: action.screenId,
      };

    case "SELECT_COMPONENT":
      return {
        ...state,
        selected: action.id,
      };

    case "UPDATE_COMPONENT_PROPS": {
      const { screenId, componentId, props } = action;

      const screen = state.screens[screenId];
      if (!screen) return state;

      const updateNode = (node) => {
        if (node.id === componentId) {
          return { ...node, props: { ...node.props, ...props } };
        }
        return {
          ...node,
          children: node.children?.map(updateNode) || [],
        };
      };

      return {
        ...state,
        screens: {
          ...state.screens,
          [screenId]: {
            ...screen,
            root: updateNode(screen.root),
          },
        },
      };
    }

    case "ADD_SCREEN": {
      const newScreen = SceneManager.createScreen();
      return {
        ...state,
        screens: {
          ...state.screens,
          [newScreen.id]: newScreen,
        },
        currentScreen: newScreen.id,
      };
    }

    default:
      return state;
  }
}

// ---------------------------------------------------------
// Provider
// ---------------------------------------------------------

export function BuilderProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    screens: {},
    currentScreen: null,
    selected: null,
  });

  const actions = {
    loadProject: (project) =>
      dispatch({ type: "LOAD_PROJECT", project }),

    setCurrentScreen: (screenId) =>
      dispatch({ type: "SET_CURRENT_SCREEN", screenId }),

    selectComponent: (id) =>
      dispatch({ type: "SELECT_COMPONENT", id }),

    updateComponentProps: (componentId, props) =>
      dispatch({
        type: "UPDATE_COMPONENT_PROPS",
        screenId: state.currentScreen,
        componentId,
        props,
      }),

    addScreen: () =>
      dispatch({ type: "ADD_SCREEN" }),
  };

  return (
    <BuilderContext.Provider value={{ builderState: state, actions }}>
      {children}
    </BuilderContext.Provider>
  );
}

export default BuilderContext;
