// frontend/src/Builder/BuilderState.js

/**
 * BuilderState
 * ---------------------------------------------------------
 * Defines the initial state and reducer for the Builder Engine.
 */

export const initialBuilderState = {
  project: null,
  components: [],
  selected: null,
  history: [],
  future: []
};

export function builderReducer(state, action) {
  switch (action.type) {
    case "SET_PROJECT":
      return {
        ...state,
        project: action.project
      };

    case "SET_COMPONENTS":
      return {
        ...state,
        components: action.components
      };

    case "SELECT_COMPONENT":
      return {
        ...state,
        selected: action.id
      };

    case "UPDATE_COMPONENT":
      return {
        ...state,
        components: state.components.map((c) =>
          c.id === action.id ? { ...c, ...action.data } : c
        )
      };

    case "ADD_COMPONENT":
      return {
        ...state,
        components: [...state.components, action.component]
      };

    case "REMOVE_COMPONENT":
      return {
        ...state,
        components: state.components.filter((c) => c.id !== action.id),
        selected:
          state.selected === action.id ? null : state.selected
      };

    default:
      return state;
  }
}
