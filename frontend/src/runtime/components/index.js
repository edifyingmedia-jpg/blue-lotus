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
import TagList from "./TagList";
import ListItem from "./ListItem";
import Accordion from "./Accordion";
import Tabs from "./Tabs";
import Stepper from "./Stepper";
import Toggle from "./Toggle";
import SearchBar from "./SearchBar";
import Breadcrumbs from "./Breadcrumbs";
import SegmentedControl from "./SegmentedControl";
import Chip from "./Chip";
import Slider from "./Slider";
import Menu from "./Menu";
import Tooltip from "./Tooltip";
import Popover from "./Popover";
import ProgressBar from "./ProgressBar";
import SegmentedControl from "./SegmentedControl";
import Select from "./Select";
import Spinner from "./Spinner";
import Switch from "./Switch";
import Tag from "./Tag";
import Text from "./Text";
import TextArea from "./TextArea";

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
 TagList,
 ListItem,
 Accordion,
 Tabs,
 Stepper,
 Toggle,
 SearchBar,
 Breadcrumbs,
 SegmentedControl,
 Chip,
 Slider,
 Menu,
 Tooltip,
 Popover,
 ProgressBar,
 SegmentedControl,
 Select,
 Spinner,
 Switch,
 Tag,
 Text,
 TextArea,

  // Button variants
  PrimaryButton: Buttons.PrimaryButton,
  SecondaryButton: Buttons.SecondaryButton,
  GhostButton: Buttons.GhostButton,
  DangerButton: Buttons.DangerButton,

  // Screen templates (empty for now)
  templates: {},
};

export default ComponentRegistry;
