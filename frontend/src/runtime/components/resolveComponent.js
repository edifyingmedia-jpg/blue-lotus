import Text from "./Text";
import Input from "./Input";
import TextArea from "./TextArea";
import Button from "./Button";
import Image from "./Image";
import Icon from "./Icon";

/**
 * Component Registry
 * Maps JSON component types → actual React components.
 * This is the heart of the runtime renderer.
 *
 * Add new components here as you expand the system.
 */

const registry = {
  Text,
  Input,
  TextArea,
  Button,
  Image,
  Icon,
};

/**
 * resolveComponent
 * Returns the React component for a given type string.
 * If the type is unknown, returns null (Screen.js handles the error display).
 */

export default function resolveComponent(type) {
  return registry[type] || null;
}
