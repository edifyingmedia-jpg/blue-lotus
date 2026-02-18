# Blue Lotus - Product Requirements Document

## Original Problem Statement
Build a no-code AI app builder called "Blue Lotus" - an AI-powered no-code, no-drag application builder. Users interact solely through natural language prompts (text or voice) to generate entire application structures (screens, data models, flows) without ever seeing or manipulating code or UI elements directly.

## User Personas
- **No-Code Entrepreneurs**: Users who want to build apps without coding
- **Rapid Prototypers**: Developers who need quick MVP prototypes
- **Business Users**: Non-technical users who need custom applications
- **Agencies**: Teams building multiple client projects
- **Platform Owners**: Administrators managing the platform (Owner Dashboard)

## Core Requirements
1. **Dark Theme** with blue secondary colors and blue lotus branding
2. **No-Code, No-Drag Philosophy**: Users interact solely via natural language
3. **AI-Orchestrated Builder**: Chat and voice-based interface for app generation
4. **Voice-First Experience**: Full voice control via OpenAI Whisper + TTS
5. **External Backend Integration**: Connect to Firebase, Supabase, REST APIs
6. **Owner Dashboard**: Platform administration for owners

---

## Implementation Status

### ✅ Phase 1-6: Frontend Foundation (Completed)
- Landing page with Blue Lotus branding
- Login/Signup with real backend auth (JWT)
- Dashboard with real project CRUD
- Builder interface
- Pricing & Legal pages

### ✅ Phase 7-10: Backend Core (Completed)
- FastAPI backend with MongoDB
- Auth system (signup, login, JWT tokens)
- Project CRUD operations
- Credit system with plan enforcement

### ✅ Phase 11-13: Voice System (Completed - December 2025)
- Voice Input Engine - OpenAI Whisper STT integration
- Speech-to-Intent Engine - Intent parsing
- Voice Orchestration Engine - Command routing
- Voice Feedback Engine - OpenAI TTS integration  
- Voice Safety Layer - Destructive action confirmation
- Voice Experience Engines - Error handling, accessibility, onboarding
- Voice Intelligence Engines - Help, workflows, component placement, debugging
- Voice Control Engines - Publishing, data modeling, navigation, review

### ✅ Phase 14: Frontend-Backend Integration (Completed - December 2025)
- AuthContext connected to real /api/auth/* endpoints
- Dashboard fetches real projects from /api/projects/
- Real credit display from user object
- Project creation, deletion, duplication working

### ✅ Phase 15: AI Generation System (Completed - December 2025)
- AI Project Generation Engine - GPT-5.2 for full project generation
- Intent Interpretation Engine - Extracts screens, flows, models
- Project Blueprint Compiler - Converts intent to structured blueprints
- AI Project Refinement Engine - Analyzes and improves projects
- AI Feature Expansion Engine - Adds features to existing projects
- AI App Evolution Engine - Roadmap generation
- AI Multi-Project Generator - Create variations

### ✅ Phase 16: Backend Integration System (Completed - December 2025)
- Backend Integration Engine - Connect to external APIs
- API Connector Engine - REST/GraphQL execution
- Backend Routing Engine - Route API calls to components
- Data Sync Engine - Sync UI with backend data
- Backend Security Engine - Protect API calls and credentials

### ✅ Phase 17: Publishing Engine Enhancement (Completed - December 2025)
- Real deployment workflow with validation
- Staging and production environments
- Build logs and deployment tracking
- URL generation with subdomains

### ✅ Phase 18: Stripe Billing Integration (Completed - December 2025)
- Billing Engine with 4 subscription plans (Free, Creator, Pro, Elite)
- 4 Credit packages (Starter, Growth, Pro, Enterprise)
- Stripe checkout session creation
- Payment status tracking
- Subscription management
- Webhook handling for payment events

### ✅ Phase 19: Owner Dashboard (Completed - December 2025)
- Admin Engine for platform management
- Owner-restricted access via email whitelist or role
- Core sections implemented:
  - **Overview**: Platform stats (users, projects, sessions, credits, revenue, system status)
  - **Users Management**: List, search, suspend, reactivate, delete users
  - **Projects Management**: List, search, archive, delete projects
  - **Billing**: Revenue overview, users by plan, recent transactions

---

## Master System Architecture

### Total Engines: 50

```
CORE ENGINES (5)
├── credit_engine.py          - Credit management & deduction
├── plan_enforcement.py       - Plan-based feature gating
├── generation_engine.py      - Template-based generation
├── publishing_engine.py      - Staging/production deployment
└── export_engine.py          - Project export

BILLING ENGINE (1)
└── billing_engine.py         - Stripe subscription & payments

ADMIN ENGINE (1)
└── admin_engine.py           - Owner Dashboard operations

BUILD ENGINES (4)
├── project_engine.py         - Project CRUD
├── data_model_engine.py      - Data model management
├── navigation_engine.py      - Navigation structure
└── ai_instruction_engine.py  - NL instruction parsing

ADVANCED ENGINES (4)
├── orchestration_engine.py           - System coordination
├── runtime_intelligence_engine.py    - Behavior analysis
├── canvas_engine.py                  - Screen rendering
└── component_library_engine.py       - UI components

CONTROL ENGINES (4)
├── ai_orchestration_engine.py        - AI task coordination
├── blueprint_generation_engine.py    - Blueprint creation
├── system_diagnostics_engine.py      - System health
└── platform_settings_engine.py       - Settings management

VOICE CORE ENGINES (6)
├── voice_input_engine.py             - Audio capture (Whisper)
├── speech_to_intent_engine.py        - STT + intent parsing
├── voice_orchestration_engine.py     - Voice command routing
├── voice_feedback_engine.py          - TTS responses (OpenAI)
├── voice_safety_layer.py             - Confirmation dialogs
└── voice_settings_engine.py          - Voice preferences

VOICE EXPERIENCE ENGINES (3)
├── voice_error_handling_engine.py    - Error recovery
├── voice_accessibility_engine.py     - A11y features
└── voice_onboarding_engine.py        - Voice-driven setup

VOICE INTELLIGENCE ENGINES (5)
├── voice_help_guidance_engine.py     - Help system
├── voice_multistep_workflow_engine.py - Multi-step tasks
├── voice_component_placement_engine.py - Place via voice
├── voice_debugging_engine.py          - Debug via voice
└── extended_voice_intelligence_engine.py - Advanced AI

VOICE CONTROL ENGINES (4)
├── voice_driven_publishing_engine.py  - Publish via voice
├── voice_driven_data_modeling_engine.py - Models via voice
├── voice_driven_navigation_engine.py   - Nav via voice
└── voice_driven_project_review_engine.py - Review via voice

AI GENERATION ENGINES (7)
├── ai_project_generation_engine.py    - Full project gen (GPT-5.2)
├── intent_interpretation_engine.py    - Extract app structure
├── project_blueprint_compiler.py      - Compile blueprints
├── ai_project_refinement_engine.py    - Improve projects
├── ai_feature_expansion_engine.py     - Add features
├── ai_app_evolution_engine.py         - Roadmap generation
├── ai_multi_project_generator_engine.py - Variations
└── project_generation_safety_layer.py  - Validation

BACKEND INTEGRATION ENGINES (5)
├── backend_integration_engine.py      - External API connections
├── api_connector_engine.py            - REST/GraphQL execution
├── backend_routing_engine.py          - Route to components
├── data_sync_engine.py                - Sync with backend
└── backend_security_engine.py         - Security & auth
```

---

## API Routes

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Current user

### Projects
- `GET /api/projects/` - List projects
- `POST /api/projects/` - Create project
- `GET /api/projects/{id}` - Get project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Billing (NEW)
- `GET /api/billing/plans` - Get subscription plans
- `GET /api/billing/plans/compare` - Plan comparison
- `GET /api/billing/credits/packages` - Credit packages
- `POST /api/billing/subscribe` - Create subscription checkout
- `POST /api/billing/credits/purchase` - Purchase credits
- `GET /api/billing/status/{session_id}` - Check payment status
- `GET /api/billing/info` - User billing info
- `GET /api/billing/transactions` - Transaction history

### Admin (NEW - Owner Only)
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/health` - System health
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/{id}` - User details
- `PUT /api/admin/users/{id}/role` - Update user role
- `PUT /api/admin/users/{id}/plan` - Update user plan
- `POST /api/admin/users/{id}/suspend` - Suspend user
- `POST /api/admin/users/{id}/reactivate` - Reactivate user
- `DELETE /api/admin/users/{id}` - Delete user
- `GET /api/admin/projects` - List all projects
- `POST /api/admin/projects/{id}/archive` - Archive project
- `DELETE /api/admin/projects/{id}` - Delete project
- `GET /api/admin/billing/overview` - Billing overview
- `GET /api/admin/analytics` - Platform analytics
- `GET /api/admin/transactions` - All transactions
- `POST /api/admin/transactions/{id}/refund` - Process refund

### AI Generation
- `POST /api/ai/generate` - Generate project from description
- `POST /api/ai/interpret` - Preview interpreted structure
- `POST /api/ai/feature/{project_id}` - Add feature
- `GET /api/ai/roadmap/{project_id}` - Get evolution roadmap
- `POST /api/ai/variations` - Generate variations
- `POST /api/ai/refine/{project_id}` - Get refinement suggestions

### Voice
- `POST /api/voice/session` - Start voice session
- `POST /api/voice/transcribe` - Transcribe audio (Whisper)
- `POST /api/voice/command` - Process voice command
- `POST /api/voice/tts` - Generate speech (TTS)

### Backend Integration
- `GET /api/backend/providers` - List providers
- `POST /api/backend/connections` - Create connection
- `POST /api/backend/connections/{id}/test` - Test connection
- `POST /api/backend/execute/{connection_id}` - Execute API call

### Publishing
- `POST /api/publishing/stage/{project_id}` - Deploy to staging
- `POST /api/publishing/production/{project_id}` - Deploy to production

---

## What's Real vs Mocked

### ✅ REAL (Working with Actual Logic)
- Auth system (JWT, MongoDB)
- Project CRUD (MongoDB)
- Credit system (deductions, limits)
- AI Generation (GPT-5.2 via Emergent LLM Key)
- Voice STT (OpenAI Whisper)
- Voice TTS (OpenAI)
- Backend Integration (HTTP client, security)
- Publishing workflow (deployment simulation)
- Billing system (Stripe integration)
- Owner Dashboard (admin engine with real queries)

### 🟡 SCAFFOLDED (Routes work, return mock data)
- Export engine (mock download URLs)
- Some voice commands (mock execution results)

---

## Tech Stack
- **Frontend**: React 18, Tailwind CSS, Shadcn/UI
- **Backend**: FastAPI, Pydantic, Motor (async MongoDB)
- **Database**: MongoDB
- **AI**: GPT-5.2 via Emergent LLM Key
- **Voice**: OpenAI Whisper (STT), OpenAI TTS
- **Payments**: Stripe
- **Auth**: JWT tokens

---

## Backlog

### P0 - Critical
- [x] Stripe payment integration ✅
- [x] Owner Dashboard ✅
- [ ] Real file export (code generation)
- [ ] Frontend UI for AI Project Generation

### P1 - Important
- [ ] Voice UI components in Builder page
- [ ] Account Settings UI
- [ ] Team management
- [ ] Frontend for Stripe Billing (user-facing pricing page integration)

### P2 - Nice to Have
- [ ] Analytics dashboard (extended)
- [ ] Usage reports
- [ ] Multi-language support
- [ ] System Settings in Owner Dashboard
- [ ] Compliance Center in Owner Dashboard
- [ ] Support Center in Owner Dashboard

---

## Brand Guidelines

### Colors
- Glow Blue: #4CC3FF (primary)
- Deep Blue: #003A66 (borders)
- Soft Blue: #7FDBFF (accents)
- Midnight: #020B14 (background)

### Typography
- Font: Inter
- Weights: 300-700

### Logo
- Transparent background
- Glow animation on idle
- Bloom animation on hover

---

## Owner Dashboard Access

Access is restricted to:
1. Users with `role` set to "owner" or "admin" in the database
2. Users whose email is in the `OWNER_EMAILS` environment variable

Current owner emails: `owner@bluelotus.ai, admin@bluelotus.ai`

Test credentials: `owner@bluelotus.ai / owner123`
