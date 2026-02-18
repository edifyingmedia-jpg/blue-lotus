# Blue Lotus - Product Requirements Document

## Original Problem Statement
Build a clone of the Emergent website rebranded as "Blue Lotus" - an AI-powered no-code, no-drag application builder. The core philosophy is that users interact solely through natural language prompts to generate entire application structures (screens, data models, flows) without ever seeing or manipulating code or UI elements directly.

## User Personas
- **No-Code Entrepreneurs**: Users who want to build apps without coding
- **Rapid Prototypers**: Developers who need quick MVP prototypes
- **Business Users**: Non-technical users who need custom applications

## Core Requirements
1. **Dark Theme** with blue secondary colors and blue lotus branding
2. **No-Code, No-Drag Philosophy**: Users interact solely via natural language
3. **AI-Orchestrated Builder**: Chat-based interface for app generation
4. **Enterprise-Ready Legal Documentation**: Full suite of legal policies

---

## What's Been Implemented

### ✅ Phase 1: Landing Page & Branding (Completed)
- Custom Blue Lotus logo (transparent background, glow animation)
- Dark theme with brand colors (#4CC3FF, #003A66, #7FDBFF, #020B14)
- Hero section with marketing copy
- Features, How It Works, CTA sections
- Footer with navigation links
- "Made with Blue Lotus" badge

### ✅ Phase 2: Multi-Page App Structure (Completed)
- Login/Signup pages
- Dashboard with project listing
- New Project creation flow
- Settings page with tabs
- Pricing page

### ✅ Phase 3: No-Code Builder Interface (Completed)
- Left panel: AI Chat + Project Navigator
- Right panel: Read-only preview
- Chat-based command interface
- Project structure visualization

### ✅ Phase 4: Legal Documentation (Completed)
- 17 legal pages (Terms, Privacy, GDPR, CCPA, DPA, etc.)
- Legal navigation page
- Compliance Center for data rights
- User Agreement modal on signup

### ✅ Phase 5: Pricing & Credits System UI (Completed)
- Complete pricing page with 4 tiers
- Credit add-on packs
- Feature comparison table
- Credit usage rules documentation

### ✅ Phase 6: Checkout & Payment Flow UI (Completed)
- Multi-step checkout wizard
- Plan selection and payment forms
- Confirmation screen

### ✅ Phase 7: Onboarding Flow (Completed)
- 6-step onboarding wizard
- Welcome, Account Setup, Credits Intro, Project Type, Project Brief, Review Structure
- Progress tracking

### ✅ Phase 8: Brand System (Completed - February 2025)
- Blue Lotus logo with transparent background
- Brand color palette enforced: Glow Blue (#4CC3FF), Deep Blue (#003A66), Soft Blue (#7FDBFF), Midnight (#020B14)
- Logo glow animation (pulse + bloom on hover)
- No purple/violet colors - pure blue theme
- Inter typography

### ✅ Phase 9: Backend Core Engines (Completed - February 2025)
**Built complete FastAPI backend with MongoDB:**

#### Core Operational Engines (5):
1. **Credit Engine** (`/app/backend/engines/credit_engine.py`)
   - 4 credit sources with deduction priority
   - Daily bonus refresh, purchased never expire

2. **Plan Enforcement Engine** (`/app/backend/engines/plan_enforcement.py`)
   - 4 tiers: Free, Creator, Pro, Elite
   - Export/publish/project limits

3. **Project Engine** (`/app/backend/engines/project_engine.py`)
   - Project CRUD, duplication, status management
   - Structure generation, statistics

4. **Data Model Engine** (`/app/backend/engines/data_model_engine.py`)
   - 8 field types: text, number, boolean, date, image, file, reference, list
   - 3 relationship types: one_to_one, one_to_many, many_to_many
   - Circular reference detection, validation

5. **Navigation Engine** (`/app/backend/engines/navigation_engine.py`)
   - 5 navigation types: stack, tabs, drawer, modal, custom_flow
   - Orphan screen detection, depth validation
   - Tab bar and drawer management

#### AI Engines (2):
6. **AI Instruction Engine** (`/app/backend/engines/ai_instruction_engine.py`)
   - Natural language parsing into structured tasks
   - 10 instruction types: create_screen, create_page, generate_flow, etc.
   - Confidence scoring, validation, suggestions
   - Never delete without confirmation

7. **AI Orchestration Engine** (`/app/backend/engines/ai_orchestration_engine.py`)
   - Full AI coordination across all builder contexts
   - Intent analysis and routing
   - Confirmation for destructive operations
   - Multi-step conversation context

#### Output Engines (3 - Mocked):
8. **Generation Engine** - Mock structures (ready for LLM)
9. **Publishing Engine** - Mock URLs (ready for deployment infra)
10. **Export Engine** - Mock downloads (ready for file packaging)

### ✅ Phase 10: Advanced Backend Engines (Completed - December 2025)

#### Build Engines (4):
11. **Orchestration Engine** (`/app/backend/engines/orchestration_engine.py`)
    - System event coordination
    - Event handlers with priority
    - Action routing and logging

12. **Runtime Intelligence Engine** (`/app/backend/engines/runtime_intelligence_engine.py`)
    - User behavior analysis
    - Intent prediction and suggestions
    - Stalled workflow detection
    - Prompt optimization

13. **Canvas Engine** (`/app/backend/engines/canvas_engine.py`)
    - Builder preview rendering
    - Component placement and layout

14. **Component Library Engine** (`/app/backend/engines/component_library_engine.py`)
    - Component registry and discovery
    - Category management

#### Control Engines (3):
15. **Blueprint Generation Engine** (`/app/backend/engines/blueprint_generation_engine.py`)
    - Screen/Page/Flow blueprint generation from natural language
    - 7 blueprint types: screen, page, flow, data_model, navigation, full_app, component
    - Template-based generation with validation
    - Blueprint versioning and history

16. **System Diagnostics Engine** (`/app/backend/engines/system_diagnostics_engine.py`)
    - Comprehensive health monitoring for all 17 engines
    - Data integrity checks
    - Performance metrics tracking
    - Diagnostic logging with severity levels

17. **Platform Settings Engine** (`/app/backend/engines/platform_settings_engine.py`)
    - 24+ user settings across 7 categories
    - Global, User, Project, Team scopes
    - Settings validation, import/export
    - UI config generation for settings pages

#### API Endpoints
- `POST /api/auth/signup` - User registration with 20 starter credits
- `POST /api/auth/login` - Authentication with JWT
- `GET /api/auth/me` - Current user profile
- `GET/POST /api/projects/` - Project CRUD
- `POST /api/generate/` - AI generation (deducts credits)
- `POST /api/publish/` - Deploy to staging/production
- `POST /api/export/` - Export project
- `GET /api/credits/balance` - Credit balance with refresh timer
- `POST /api/credits/purchase` - Buy credit packs
- `GET /api/plans` - Available plans
- `GET /api/health` - System health check (17 engines)
- `POST /api/builder/interpret` - Parse natural language prompt
- `POST /api/builder/execute` - Execute build instruction
- `GET /api/builder/suggestions/{id}` - AI suggestions
- `POST /api/builder/duplicate/{id}` - Duplicate project

**New Blueprint Endpoints:**
- `POST /api/blueprints/generate` - Generate blueprint from spec
- `GET /api/blueprints/` - List all blueprints
- `GET /api/blueprints/{id}` - Get specific blueprint
- `POST /api/blueprints/{id}/validate` - Validate blueprint
- `POST /api/blueprints/{id}/apply` - Apply blueprint
- `DELETE /api/blueprints/{id}` - Delete blueprint

**New Diagnostics Endpoints:**
- `GET /api/diagnostics/health` - Full system health report
- `GET /api/diagnostics/integrity` - Data integrity check
- `GET /api/diagnostics/logs` - Diagnostic logs
- `GET /api/diagnostics/errors` - Recent errors
- `GET /api/diagnostics/metrics` - Performance metrics
- `POST /api/diagnostics/resolve/{id}` - Resolve diagnostic
- `POST /api/diagnostics/cleanup` - Cleanup old diagnostics

**New Settings Endpoints:**
- `GET /api/settings/definitions` - All setting definitions
- `GET /api/settings/user` - User settings
- `GET /api/settings/user/ui` - Settings UI config
- `PUT /api/settings/user/{key}` - Update single setting
- `PUT /api/settings/user` - Bulk update settings
- `DELETE /api/settings/user/{key}` - Reset to default
- `GET /api/settings/project/{id}` - Project settings
- `PUT /api/settings/project/{id}/{key}` - Update project setting
- `GET /api/settings/global` - Global settings
- `GET /api/settings/export` - Export user settings
- `POST /api/settings/import` - Import user settings
- `GET /api/settings/history` - Settings change history

### ✅ Phase 11: Voice Creation System (Completed - December 2025)
**Full voice-driven app building with REAL OpenAI Whisper & TTS integration:**

#### Voice Engines (6):
18. **Voice Input Engine** (`/app/backend/engines/voice_input_engine.py`)
    - Microphone capture and audio processing
    - Push-to-talk, hold-to-record, continuous modes
    - Audio validation (format, size limits)
    - Session management

19. **Speech-to-Intent Engine** (`/app/backend/engines/speech_to_intent_engine.py`)
    - Natural language voice command parsing
    - 8 intent types: create_screen, create_page, generate_flow, modify_navigation, update_data_model, refine_content, explain_project, ask_for_help
    - Confidence scoring, pattern matching
    - Credit cost awareness

20. **Voice Orchestration Engine** (`/app/backend/engines/voice_orchestration_engine.py`)
    - Routes voice commands to correct subsystems
    - Coordinates with AI Orchestration Engine
    - Maintains multi-step conversation context
    - Provides voice/text feedback

21. **Voice Feedback Engine** (`/app/backend/engines/voice_feedback_engine.py`) - **REAL OpenAI TTS**
    - Converts AI responses to speech
    - 9 voices: alloy, ash, coral, echo, fable, nova, onyx, sage, shimmer
    - Speed control (0.25x - 4x)
    - Response caching

22. **Voice Safety Layer** (`/app/backend/engines/voice_safety_layer.py`)
    - Prevents accidental destructive actions
    - Confirmation required for deletes/overwrites
    - 60-second confirmation timeout
    - Voice or text confirmation accepted

23. **Voice Settings Engine** (`/app/backend/engines/voice_settings_engine.py`)
    - User voice preferences storage
    - Voice modes: voice_on, voice_off, input_only, output_only
    - Input modes: push_to_talk, hold_to_record, continuous
    - TTS voice and speed preferences

#### Voice API Endpoints:
- `GET /api/voice/config` - Voice feature configuration
- `POST /api/voice/session/start` - Start voice session
- `POST /api/voice/session/{id}/stop` - Stop voice session
- `POST /api/voice/transcribe` - **REAL** transcribe audio (OpenAI Whisper)
- `POST /api/voice/process` - Process voice command
- `POST /api/voice/speak` - **REAL** generate speech (OpenAI TTS)
- `POST /api/voice/speak/stream` - Stream audio response
- `GET /api/voice/settings` - Get voice settings
- `PUT /api/voice/settings` - Update voice settings
- `POST /api/voice/settings/toggle` - Toggle voice mode
- `GET /api/voice/commands` - Supported voice commands
- `GET /api/voice/voices` - Available TTS voices

#### Frontend Voice Components:
- `VoiceContext.jsx` - Voice state management
- `MicrophoneButton.jsx` - Main voice input control with pulse animation
- `WaveformVisualizer.jsx` - Real-time audio level visualization
- `ListeningIndicator.jsx` - Status indicator (listening/processing/speaking)
- `VoiceModeToggle.jsx` - Voice mode dropdown
- `VoiceConfirmationDialog.jsx` - Safety confirmation modal
- `VoiceInputPanel.jsx` - Complete voice input UI

### ✅ Phase 12: Voice Experience System (Completed - December 2025)
**Voice-driven onboarding, accessibility, and error handling:**

#### Voice Experience Engines (3):
24. **Voice Error Handling Engine** (`/app/backend/engines/voice_error_handling_engine.py`)
    - 12 error types: unclear_speech, background_noise, partial_command, ambiguous_intent, etc.
    - 7 recovery actions: ask_clarification, repeat_prompt, fallback_text, etc.
    - Sensitive data sanitization for voice output
    - Retry management with max attempts

25. **Voice Accessibility Engine** (`/app/backend/engines/voice_accessibility_engine.py`)
    - WCAG 2.1 AA and ADA Section 508 compliance
    - Screen reader announcements
    - Keyboard shortcuts (V to toggle, Escape to cancel)
    - High contrast, reduced motion, large controls modes
    - ARIA labels for all voice components

26. **Voice Onboarding Engine** (`/app/backend/engines/voice_onboarding_engine.py`)
    - 4-step voice-guided onboarding flow
    - Welcome → Project Type → Description → Structure Ready
    - Voice/text mode selection
    - Hands-free project setup

### ✅ Phase 13: Advanced Voice Intelligence (Completed - December 2025)
**Multi-step workflows, component placement, debugging, and enhanced intelligence:**

#### Voice Intelligence Engines (5):
27. **Voice Help & Guidance Engine** (`/app/backend/engines/voice_help_guidance_engine.py`)
    - 9 help categories: getting_started, screens, pages, data_models, etc.
    - Contextual help detection
    - Proactive suggestions based on user state
    - Project state explanations
    - Step-by-step walkthroughs

28. **Voice Multi-Step Workflow Engine** (`/app/backend/engines/voice_multistep_workflow_engine.py`)
    - 5 workflow templates: checkout_flow, onboarding_flow, signup_flow, data_model_binding, crud_screens
    - Session memory for workflow context
    - Branching workflows based on responses
    - Confirmation before finalizing

29. **Voice Component Placement Engine** (`/app/backend/engines/voice_component_placement_engine.py`)
    - 24 component types: button, text, image, form, list, card, etc.
    - 10 position types: above, below, left_of, right_of, inside, centered, etc.
    - Data model binding via voice
    - Property modification via speech

30. **Voice Debugging Engine** (`/app/backend/engines/voice_debugging_engine.py`)
    - 8 issue types: navigation, data_binding, component, missing_model, broken_flow, etc.
    - 4 explanation modes: simple_voice, detailed_voice, text_only, step_by_step
    - Project health analysis
    - Spoken debugging summaries

31. **Extended Voice Intelligence Engine** (`/app/backend/engines/extended_voice_intelligence_engine.py`)
    - User state detection: focused, exploring, confused, frustrated, completing
    - Intent refinement with conversational mapping
    - Workflow prediction based on recent actions
    - Command disambiguation
    - Proactive suggestions

---

## Architecture

```
/app
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── ui/ (shadcn)
│       │   ├── Logo.jsx (brand logo with animation)
│       │   ├── MadeWithBlueLotus.jsx
│       │   └── ...
│       ├── context/
│       │   ├── AuthContext.js
│       │   ├── PlanEnforcementContext.jsx
│       │   └── RolesContext.jsx
│       ├── pages/
│       │   ├── Onboarding.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Builder.jsx
│       │   ├── Pricing.jsx
│       │   └── ...
│       └── data/
│           ├── mock.js
│           └── legal.js
│
└── backend/
    ├── server.py (main FastAPI app)
    ├── models/
    │   └── schemas.py (Pydantic models)
    ├── engines/ (23 total)
    │   ├── credit_engine.py
    │   ├── plan_enforcement.py
    │   ├── project_engine.py
    │   ├── data_model_engine.py
    │   ├── navigation_engine.py
    │   ├── ai_instruction_engine.py
    │   ├── ai_orchestration_engine.py
    │   ├── generation_engine.py
    │   ├── publishing_engine.py
    │   ├── export_engine.py
    │   ├── orchestration_engine.py
    │   ├── runtime_intelligence_engine.py
    │   ├── canvas_engine.py
    │   ├── component_library_engine.py
    │   ├── blueprint_generation_engine.py
    │   ├── system_diagnostics_engine.py
    │   ├── platform_settings_engine.py
    │   ├── voice_input_engine.py
    │   ├── speech_to_intent_engine.py
    │   ├── voice_orchestration_engine.py
    │   ├── voice_feedback_engine.py (OpenAI TTS)
    │   ├── voice_safety_layer.py
    │   └── voice_settings_engine.py
    ├── routes/ (14 total)
    │   ├── auth.py
    │   ├── projects.py
    │   ├── generation.py
    │   ├── publishing.py
    │   ├── export.py
    │   ├── credits.py
    │   ├── builder.py
    │   ├── intelligence.py
    │   ├── canvas.py
    │   ├── components.py
    │   ├── blueprints.py
    │   ├── diagnostics.py
    │   ├── settings.py
    │   └── voice.py
    ├── tests/
    │   └── test_new_engines.py
    └── utils/
        └── auth.py (JWT utilities)
```

---

## What's Still Mocked

- **Generation Engine**: Returns mock structures (needs LLM integration)
- **Publishing Engine**: Returns mock URLs (needs deployment infrastructure)
- **Export Engine**: Returns mock download URLs (needs file packaging)
- **Billing**: Credit purchase works but Stripe not integrated
- **Voice Command Execution**: Voice commands are parsed and routed, but actual screen/page creation returns mocked results
- **All 23 engines contain mocked business logic** - scaffolded and ready for real implementation

**REAL Integrations (Working):**
- **OpenAI Whisper** (Speech-to-Text) - Transcribes audio via Emergent LLM Key
- **OpenAI TTS** (Text-to-Speech) - Generates voice responses via Emergent LLM Key

---

## Backlog / Future Tasks

### P0 - Critical
- [ ] Connect frontend to real backend APIs (replace mocked AuthContext)
- [ ] Implement real backend logic in all 17 engines (replace mocked data with MongoDB operations)
- [ ] Integrate Stripe for billing

### P1 - Important
- [ ] LLM integration for Generation Engine (use Emergent LLM Key)
- [ ] Real deployment infrastructure for Publishing Engine
- [ ] File packaging for Export Engine
- [ ] Account Settings UI implementation (connect to /api/settings)

### P2 - Nice to Have
- [ ] Team management UI
- [ ] Role-based access control enforcement
- [ ] Analytics dashboard
- [ ] Usage reports

---

## Brand Guidelines

### Colors
- Glow Blue: #4CC3FF (primary)
- Deep Blue: #003A66 (borders, secondary)
- Soft Blue: #7FDBFF (accents)
- Midnight: #020B14 (background)

### Logo
- Transparent background (enforced)
- Glow animation on idle
- Bloom animation on hover
- Minimum size: 24px

### Typography
- Font: Inter
- Weights: 300-700
- No serif fonts

### Restrictions
- No purple/violet
- No external branding
- No auto-generated badges
