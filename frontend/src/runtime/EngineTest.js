/**
 * EngineTest.js
 * ---------------------------------------------------------
 * A simple, safe test harness for the Blue Lotus runtime.
 * Run with:
 *    node frontend/src/runtime/EngineTest.js
 */

import ProjectLoader from "./ProjectLoader";
import Engine from "./Engine";
import EventBus from "./EventBus";

async function run() {
  console.log("=== Blue Lotus Runtime Test ===");

  // 1. Load project + document
  const loader = new ProjectLoader();
  const { project, document } = await loader.load();

  console.log("Loaded project:", project?.name || "(no name)");
  console.log("Loaded document:", document?.title || "(no title)");

  // 2. Create event bus
  const events = new EventBus();

  // 3. Create engine
  const engine = new Engine({
    project,
    document,
    events,
  });

  // 4. Initialize engine
  await engine.init();

  // 5. Test navigation actions
  console.log("\n--- Navigation Tests ---");

  console.log("Initial screen:", engine.navigation.getCurrentScreen());

  engine.navigation.push("Home");
  console.log("After PUSH:", engine.navigation.getCurrentScreen());

  engine.navigation.replace("Dashboard");
  console.log("After REPLACE:", engine.navigation.getCurrentScreen());

  engine.navigation.reset("Login");
  console.log("After RESET:", engine.navigation.getCurrentScreen());

  // 6. Emit a test event
  console.log("\n--- EventBus Test ---");
  events.on("ping", (payload) => {
    console.log("Received event: ping →", payload);
  });

  events.emit("ping", { ok: true });

  console.log("\n=== Runtime Test Complete ===");
}

run().catch((err) => {
  console.error("EngineTest failed:", err);
});
