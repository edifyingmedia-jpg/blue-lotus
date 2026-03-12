import Text from "./Text";
import Input from "./Input";
import Button from "./Button";
import Image from "./Image";
import Icon from "./Icon";

/**
 * Component registry
 * Maps component type names → actual React components.
 */
const registry = {
  Text,
  Input,
  Button,
  Image,
  Icon,
};

/**
 * resolveComponent
 * Returns the React component for a given type string.
 */
export default function resolveComponent(type) {
  return registry[type] || null;
}
