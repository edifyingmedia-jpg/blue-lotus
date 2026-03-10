// frontend/src/runtime/components/index.js

import Text from "./UI/Text";
import Buttons from "./UI/Buttons";
import Input from "./UI/Input";
import Card from "./UI/Card";
import Image from "./UI/Image";
import Heading from "./UI/Heading";

const ComponentRegistry = {
  // Text component
 Text,
 Input,
 Card,
 Image,
 Heading,

  // Button variants
  PrimaryButton: Buttons.PrimaryButton,
  SecondaryButton: Buttons.SecondaryButton,
  GhostButton: Buttons.GhostButton,
  DangerButton: Buttons.DangerButton,

  // Screen templates (empty for now)
  templates: {},
};

export default ComponentRegistry;
