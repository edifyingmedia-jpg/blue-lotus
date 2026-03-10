// frontend/src/runtime/components/index.js

import Text from "./UI/Text";
import Buttons from "./UI/Buttons";
import Input from "./UI/Input";
import Card from "./UI/Card";
import Image from "./UI/Image";
import Heading from "./UI/Heading";
import Divider from "./UI/Divider";
import Container from "./UI/Container";
import Column from "./UI/Column";
import Row from "./Row";
import Spacer from "./Spacer";
import TextBlock from "./TextBlock";

const ComponentRegistry = {
  // Text component
 Text,
 Input,
 Card,
 Image,
 Heading,
 Divider,
 Container,
 Column,
 Row,
 Spacer,
 TextBlock,

  // Button variants
  PrimaryButton: Buttons.PrimaryButton,
  SecondaryButton: Buttons.SecondaryButton,
  GhostButton: Buttons.GhostButton,
  DangerButton: Buttons.DangerButton,

  // Screen templates (empty for now)
  templates: {},
};

export default ComponentRegistry;
