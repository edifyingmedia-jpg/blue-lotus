/* frontend/src/runtime/components/index.js */

/* ----------------------------- Imports ----------------------------- */

import Accordion from "./Accordion";
import Avatar from "./Avatar";
import Badge from "./Badge";
import Breadcrumbs from "./Breadcrumbs";
import Button from "./Buttons"; // main button export
import { 
  PrimaryButton, 
  SecondaryButton, 
  GhostButton, 
  DangerButton 
} from "./Buttons";

import Card from "./Card";
import CardActions from "./CardActions";
import CardMedia from "./CardMedia";
import CardSection from "./CardSection";

import Chip from "./Chip";
import Column from "./Column";
import Container from "./Container";
import Divider from "./Divider";

import Grid from "./Grid";
import Heading from "./Heading";
import Icon from "./Icon";
import Image from "./Image";
import Input from "./Input";

import ListItem from "./ListItem";
import Menu from "./Menu";
import Modal from "./Modal";

import NeonFrame from "./NeonFrame";
import Overlay from "./Overlay";
import OverlayPanel from "./OverlayPanel";
import Popover from "./Popover";

import ProgressBar from "./ProgressBar";
import Row from "./Row";
import SearchBar from "./SearchBar";
import SegmentedControl from "./SegmentedControl";
import Select from "./Select";
import Slider from "./Slider";
import Spacer from "./Spacer";
import Spinner from "./Spinner";
import Stepper from "./Stepper";
import Switch from "./Switch";

import Tabs from "./Tabs";
import Tag from "./Tag";
import TagList from "./TagList";
import Text from "./Text";
import TextArea from "./TextArea";
import TextBlock from "./TextBlock";
import TextInput from "./TextInput";

import Toggle from "./Toggle";
import Tooltip from "./Tooltip";
import View from "./View";

/* ----------------------------- Registry ----------------------------- */

const ComponentRegistry = {
  Accordion,
  Avatar,
  Badge,
  Breadcrumbs,

  Button,
  PrimaryButton,
  SecondaryButton,
  GhostButton,
  DangerButton,

  Card,
  CardActions,
  CardMedia,
  CardSection,

  Chip,
  Column,
  Container,
  Divider,

  Grid,
  Heading,
  Icon,
  Image,
  Input,

  ListItem,
  Menu,
  Modal,

  NeonFrame,
  Overlay,
  OverlayPanel,
  Popover,

  ProgressBar,
  Row,
  SearchBar,
  SegmentedControl,
  Select,
  Slider,
  Spacer,
  Spinner,
  Stepper,
  Switch,

  Tabs,
  Tag,
  TagList,
  Text,
  TextArea,
  TextBlock,
  TextInput,

  Toggle,
  Tooltip,
  View,
};

export default ComponentRegistry;
