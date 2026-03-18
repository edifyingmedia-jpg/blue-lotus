/**
 * resolveComponent.js
 * ---------------------------------------------------------
 * Maps JSON "type" fields to actual React components.
 *
 * This is the central registry for all runtime components.
 * Every component used in JSON screens must be registered here.
 */

import React from "react";

// Import your UI components here
// ---------------------------------------------------------
import Container from "../components/Container";
import Text from "../components/Text";
import Button from "../components/Button";
import Image from "../components/Image";
import Input from "../components/Input";
import Spacer from "../components/Spacer";

// Add more as your component library grows…

// Component registry
// ---------------------------------------------------------
const COMPONENT_MAP = {
  Container,
  Text,
  Button,
  Image,
  Input,
  Spacer,
};

/**
 * Resolve a component by its JSON "type"
 */
export default function resolveComponent(type) {
  if (!type || typeof type !== "string") {
    console.warn("[resolveComponent] Invalid type:", type);
    return null;
  }

  const Component = COMPONENT_MAP[type];

  if (!Component) {
    console.error(`[resolveComponent] Unknown component type: ${type}`);
    return null;
  }

  return Component;
}
