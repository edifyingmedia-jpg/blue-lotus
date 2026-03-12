import { useNavigation } from "./NavigationEngine";

export function useActions() {
  const { navigate } = useNavigation();

  return {
    navigate,
    alert: (msg) => window.alert(msg),
    log: (msg) => console.log(msg),
  };
}
