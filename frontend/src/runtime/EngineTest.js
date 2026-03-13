// EngineTest.js
// Simple isolated test of your NavigationEngine

import NavigationEngine from "./NavigationEngine";

const engine = new NavigationEngine("Login");

console.log("Initial:", engine.current);

// Test push
engine.push("Home");
console.log("After push:", engine.current);

// Test replace
engine.replace("Dashboard");
console.log("After replace:", engine.current);

// Test pop
engine.pop();
console.log("After pop:", engine.current);

// Test reset
engine.reset("Login");
console.log("After reset:", engine.current);

// Test logout
engine.push("Home");
engine.push("Settings");
engine.handleLogout();
console.log("After logout:", engine.current);
