/**
 * registerComponents.js
 * Blue Lotus — AI‑Driven No‑Code Builder
 *
 * This file registers ALL real UI components with ComponentRegistry
 * so the AI + ActionDispatcher can safely create them.
 */

import ComponentRegistry from "./ComponentRegistry";

// UI primitives
import Button from "../components/Button.jsx";
import Text from "../components/Text.jsx";
import Input from "../components/Input.jsx";
import Image from "../components/Image.jsx";
import Container from "../components/Container.jsx";
import Spacer from "../components/Spacer.jsx";

// Editor UI
import EditorSurface from "../components/EditorSurface.jsx";
import SceneEditor from "../components/SceneEditor.jsx";
import SceneList from "../components/SceneList.jsx";
import Toolbar from "../components/Toolbar.jsx";
import StatusStrip from "../components/StatusStrip.jsx";

// Voice / AI UI
import CommandPalette from "../components/CommandPalette.jsx";
import VoiceInputPanel from "../components/VoiceInputPanel.jsx";
import MicrophoneButton from "../components/MicrophoneButton.jsx";
import ListeningIndicator from "../components/ListeningIndicator.jsx";
import VoiceConfirmationDialog from "../components/VoiceConfirmationDialog.jsx";
import VoiceModeToggle from "../components/VoiceModeToggle.jsx";
import WaveformVisualizer from "../components/WaveformVisualizer.jsx";

// Marketing / Landing Page
import HeroSection from "../components/HeroSection.jsx";
import CTASection from "../components/CTASection.jsx";
import FeaturesSection from "../components/FeaturesSection.jsx";
import PricingSection from "../components/PricingSection.jsx";
import ShowcaseSection from "../components/ShowcaseSection.jsx";
import TestimonialsSection from "../components/TestimonialsSection.jsx";
import HowItWorksSection from "../components/HowItWorksSection.jsx";
import WhySection from "../components/WhySection.jsx";
import Footer from "../components/Footer.jsx";
import MadeWithBlueLotus from "../components/MadeWithBlueLotus.jsx";

// SaaS / Billing / Account
import CreditUsageTracker from "../components/CreditUsageTracker.jsx";
import PlanRestrictionBadge from "../components/PlanRestrictionBadge.jsx";
import ProjectLimitsCard from "../components/ProjectLimitsCard.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import TeamManagement from "../components/TeamManagement.jsx";
import UpgradePaywall from "../components/UpgradePaywall.jsx";
import UpgradePromptModal from "../components/UpgradePromptModal.jsx";
import UserAgreementModal from "../components/UserAgreementModal.jsx";

// Branding
import Logo from "../components/Logo.jsx";

/**
 * Register all components with the registry.
 */
export default function registerComponents() {
  ComponentRegistry.registerMany({
    // UI primitives
    Button,
    Text,
    Input,
    Image,
    Container,
    Spacer,

    // Editor UI
    EditorSurface,
    SceneEditor,
    SceneList,
    Toolbar,
    StatusStrip,

    // Voice / AI UI
    CommandPalette,
    VoiceInputPanel,
    MicrophoneButton,
    ListeningIndicator,
    VoiceConfirmationDialog,
    VoiceModeToggle,
    WaveformVisualizer,

    // Marketing / Landing Page
    HeroSection,
    CTASection,
    FeaturesSection,
    PricingSection,
    ShowcaseSection,
    TestimonialsSection,
    HowItWorksSection,
    WhySection,
    Footer,
    MadeWithBlueLotus,

    // SaaS / Billing / Account
    CreditUsageTracker,
    PlanRestrictionBadge,
    ProjectLimitsCard,
    ProtectedRoute,
    TeamManagement,
    UpgradePaywall,
    UpgradePromptModal,
    UserAgreementModal,

    // Branding
    Logo,
  });

  console.log("ComponentRegistry: All components registered.");
}
