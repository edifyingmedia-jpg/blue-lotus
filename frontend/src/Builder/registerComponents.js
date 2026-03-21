// frontend/src/Builder/registerComponents.js

/**
 * registerComponents.js
 * ---------------------------------------------------------
 * Centralized registration of all UI components for the Builder
 * and runtime resolver. Maps string types to actual React components.
 */

import ComponentRegistry from "./ComponentRegistry";

// UI primitives
import Button from "../components/Button";
import Text from "../components/Text";
import Input from "../components/Input";
import TextArea from "../components/TextArea";
import Image from "../components/Image";

// Layout + containers
import Card from "../components/Card";
import CardMedia from "../components/CardMedia";
import Container from "../components/Container";

// Navigation
import Tabs from "../components/Tabs";
import Accordion from "../components/Accordion";
import Drawer from "../components/Drawer";
import Modal from "../components/Modal";
import Navbar from "../components/Navbar";
import BottomTabs from "../components/BottomTabs";

// Feedback
import Toast from "../components/Toast";
import ProgressBar from "../components/ProgressBar";
import Spinner from "../components/Spinner";

// Screen wrapper
import ScreenContainer from "../components/ScreenContainer";

export default function registerComponents() {
  ComponentRegistry.register("Button", Button);
  ComponentRegistry.register("Text", Text);
  ComponentRegistry.register("Input", Input);
  ComponentRegistry.register("TextArea", TextArea);
  ComponentRegistry.register("Image", Image);

  ComponentRegistry.register("Card", Card);
  ComponentRegistry.register("CardMedia", CardMedia);
  ComponentRegistry.register("Container", Container);

  ComponentRegistry.register("Tabs", Tabs);
  ComponentRegistry.register("Accordion", Accordion);
  ComponentRegistry.register("Drawer", Drawer);
  ComponentRegistry.register("Modal", Modal);
  ComponentRegistry.register("Navbar", Navbar);
  ComponentRegistry.register("BottomTabs", BottomTabs);

  ComponentRegistry.register("Toast", Toast);
  ComponentRegistry.register("ProgressBar", ProgressBar);
  ComponentRegistry.register("Spinner", Spinner);

  ComponentRegistry.register("ScreenContainer", ScreenContainer);
}
