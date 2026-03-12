import Button from "../components/Button";
import Text from "../components/Text";
import Input from "../components/Input";
import TextArea from "../components/TextArea";
import Image from "../components/Image";
import Card from "../components/Card";
import CardMedia from "../components/CardMedia";
import Tabs from "../components/Tabs";
import Accordion from "../components/Accordion";
import Drawer from "../components/Drawer";
import Modal from "../components/Modal";
import Navbar from "../components/Navbar";
import BottomTabs from "../components/BottomTabs";
import Toast from "../components/Toast";
import ProgressBar from "../components/ProgressBar";
import Spinner from "../components/Spinner";
import ScreenContainer from "../components/ScreenContainer";

/**
 * Maps component type strings to actual React components.
 * This is the central registry for the entire runtime.
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

export default function resolveComponent(type) {
  const Component = components[type];

  if (!Component) {
    console.warn(`Unknown component type: ${type}`);
    return null;
  }

  return Component;
}
