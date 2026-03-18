/**
 * Engine.js
 * Core runtime engine for Blue Lotus
 * ---------------------------------------------------------
 * Responsibilities:
 * - Initialize runtime environment
 * - Load project + document via ProjectLoader
 * - Manage active screen + renderer
 * - Delegate navigation to NavigationEngine
 * - Provide a clean event bus for UI + editor modules
 */

import ProjectLoader from "./ProjectLoader";
import NavigationEngine from "./NavigationEngine";
import ScreenRenderer from "./ScreenRenderer";
import EventBus from "./EventBus"; // If not created yet, I can generate it next.

export default class Engine {
  constructor(config = {}) {
    this.config = config;

    // Core subsystems
    this.projectLoader = new ProjectLoader();
    this.navigation = new NavigationEngine();
    this.renderer = new ScreenRenderer();
    this.events = new EventBus();

    // State
    this.project = null;
    this.document = null;
    this.activeScreen = null;

    // Bindings
    this.handleNavigation = this.handleNavigation.bind(this);
    this.handleEvent = this.handleEvent.bind(this);
  }

  /**
   * Boot the engine
   */
  async init() {
    try {
      const { project, document } = await this.projectLoader.load();

      this.project = project;
      this.document = document;

      // Initialize navigation with project context
      this.navigation.init({
        project,
        document,
        onNavigate: this.handleNavigation,
      });

      // Render initial screen
      const initialScreen = this.navigation.getInitialScreen();
      await this.mountScreen(initialScreen);

      console.log("[Engine] Initialized");
    } catch (err) {
      console.error("[Engine] Failed to initialize:", err);
      throw err;
    }
  }

  /**
   * Mount a screen into the renderer
   */
  async mountScreen(screenName, params = {}) {
    this.activeScreen = screenName;

    await this.renderer.render({
      screen: screenName,
      project: this.project,
      document: this.document,
      params,
      events: this.events,
    });

    console.log(`[Engine] Mounted screen: ${screenName}`);
  }

  /**
   * Handle navigation events from NavigationEngine
   */
  async handleNavigation(action) {
    const { type, screen, params } = action;

    switch (type) {
      case "PUSH":
      case "REPLACE":
      case "RESET":
        await this.mountScreen(screen, params);
        break;

      case "MODAL":
        // Future modal system
        console.log("[Engine] Modal navigation not yet implemented");
        break;

      default:
        console.warn("[Engine] Unknown navigation action:", action);
    }
  }

  /**
   * Handle global events
   */
  handleEvent(eventName, payload) {
    this.events.emit(eventName, payload);
  }

  /**
   * Public API for external modules
   */
  getAPI() {
    return {
      navigate: this.navigation.navigate,
      emit: this.handleEvent,
      getProject: () => this.project,
      getDocument: () => this.document,
      getActiveScreen: () => this.activeScreen,
    };
  }
}
