// frontend/src/Builder/components/ComponentRegistry.js

/**
 * ComponentRegistry
 * ---------------------------------------------------------
 * Central lookup table for all renderable UI components.
 * The Builder uses this registry to translate JSON nodes
 * (e.g., { type: "Button", props: {...} }) into real React
 * components at runtime.
 *
 * New components should be added here so the Builder,
 * Renderer, and AI systems can use them.
 */

import { Button } from "../ui/Button";
import { Text } from "../ui/Text";
import { Input } from "../ui/Input";
import { TextArea } from "../ui/TextArea";
import { Image } from "../ui/Image";
import { Card } from "../ui/Card";
import { CardMedia } from "../ui/CardMedia";
import { Tabs } from "../ui/Tabs";
import { Accordion } from "../ui/Accordion";
import { Drawer } from "../ui/Drawer";
import { Modal } from "../ui/Modal";
import { Navbar } from "../ui/Navbar";
import { BottomTabs } from "../ui/BottomTabs";
import { Toast } from "../ui/Toast";
import { ProgressBar } from "../ui/ProgressBar";
import { Spinner } from "../ui/Spinner";
import { ScreenContainer } from "../ui/ScreenContainer";

/**
 * The registry object.
 * Keys = component type strings
 * Values = actual React components
 */
export const ComponentRegistry = {
  Button,
  Text,
  Input,
  TextArea,
  Image,
  Card,
  CardMedia,
  Tabs,
  Accordion,
  Drawer,
  Modal,
  Navbar,
  BottomTabs,
  Toast,
  ProgressBar,
  Spinner,
  ScreenContainer,
};

/**
 * Lookup helper
 */
export function resolveComponent(type) {
  return ComponentRegistry[type] || null;
}
