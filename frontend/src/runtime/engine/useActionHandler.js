import { useActions } from "./ActionEngine";

export default function useActionHandler(action) {
  const actions = useActions();

  if (!action) return () => {};

  return () => {
    switch (action.type) {
      case "navigate":
        actions.navigate(action.to);
        break;

      case "alert":
        actions.alert(action.message);
        break;

      case "log":
        actions.log(action.message);
        break;

      default:
        console.warn("Unknown action:", action);
    }
  };
}
