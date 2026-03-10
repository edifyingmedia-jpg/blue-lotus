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
import CardSection from "./CardSection";
import Grid from "./Grid";
import Overlay from "./Overlay";
import NeonFrame from "./NeonFrame";
import Avatar from "./Avatar";
import Badge from "./Badge";
import CardMedia from "./CardMedia";
import CardActions from "./CardActions";
import Modal from "./Modal";
import OverlayPanel from "./OverlayPanel";
import ProgressBar from "./ProgressBar";
import Icon from "./Icon";

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
 CardSection,
 Grid,
 Overlay,
 NeonFrame,
 Avatar,
 Badge,
 CardMedia,
 CardActions,
 Modal,
 OverlayPanel,
 ProgressBar,
 Icon,

  // Button variants
  PrimaryButton: Buttons.PrimaryButton,
  SecondaryButton: Buttons.SecondaryButton,
  GhostButton: Buttons.GhostButton,
  DangerButton: Buttons.DangerButton,

  // Screen templates (empty for now)
  templates: {},
};

export default ComponentRegistry;
