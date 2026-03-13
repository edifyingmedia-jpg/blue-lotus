// navigation.js
// UI-friendly wrapper around NavigationEngine for Blue Lotus

export default function navigation(engine) {
  return {
    goTo: (screenId) => engine.push(screenId),
    replace: (screenId) => engine.replace(screenId),
    back: () => engine.pop(),
    reset: (screenId = "Login") => engine.reset(screenId),
    logout: () => engine.handleLogout(),
    current: () => engine.current
  };
}
