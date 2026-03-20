// frontend/src/runtime/resolver/resolverComponents.js

/**
 * resolverComponents.js
 * ---------------------------------------------------------
 * Runtime component resolver for Blue Lotus.
 *
 * This maps component type strings (e.g., "Button", "Text")
 * to actual React components used in the runtime renderer.
 *
 * This is NOT the Builder registry.
 * This is used by:
 *   - Renderer.js
 *   - DynamicScreen.js
 *   - ScreenEngine.js
 *   - ActionEngine.js
 */

import Button from "../../components/Button";
import Text from "../../components/Text";
import Input from "../../components/Input";
import TextArea from "../../components/TextArea";
import Image from "../../components/Image";
import Card from "../../components/Card";
import CardMedia from "../../components/CardMedia";
import Tabs from "../../components/Tabs";
import Accordion from "../../components/Accordion";
import Drawer from "../../components/Drawer";
import Modal from "../../components/Modal";
import Navbar from "../../components/Navbar";
import BottomTabs from "../../components/BottomTabs";
import Toast from "../../components/Toast";
import ProgressBar from "../../components/ProgressBar";
import Spinner from "../../components/Spinner";
import ScreenContainer from "../../components/ScreenContainer";

/**
 * Component map
 * ---------------------------------------------------------
 * This is the authoritative runtime registry.
 */
const components = {
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
 * Resolve a component by type.
 */
export default function resolverComponents(type) {
  const Component = components[type];

  if (!Component) {
    console.warn(`Runtime resolver: Unknown component type "${type}"`);
    return null;
  }

  return Component;
}
