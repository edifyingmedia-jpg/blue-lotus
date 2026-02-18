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
- `GET /api/health` - System health check
- `POST /api/builder/interpret` - Parse natural language prompt
- `POST /api/builder/execute` - Execute build instruction
- `GET /api/builder/suggestions/{id}` - AI suggestions
- `POST /api/builder/duplicate/{id}` - Duplicate project

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
    ├── engines/
    │   ├── credit_engine.py
    │   ├── plan_enforcement.py
    │   ├── generation_engine.py
    │   ├── publishing_engine.py
    │   └── export_engine.py
    ├── routes/
    │   ├── auth.py
    │   ├── projects.py
    │   ├── generation.py
    │   ├── publishing.py
    │   ├── export.py
    │   └── credits.py
    └── utils/
        └── auth.py (JWT utilities)
```

---

## What's Still Mocked

- **Generation Engine**: Returns mock structures (needs LLM integration)
- **Publishing Engine**: Returns mock URLs (needs deployment infrastructure)
- **Export Engine**: Returns mock download URLs (needs file packaging)
- **Billing**: Credit purchase works but Stripe not integrated

---

## Backlog / Future Tasks

### P0 - Critical
- [ ] Connect frontend to real backend APIs (replace mocked AuthContext)
- [ ] Integrate Stripe for billing

### P1 - Important
- [ ] LLM integration for Generation Engine
- [ ] Real deployment infrastructure for Publishing Engine
- [ ] File packaging for Export Engine
- [ ] Account Settings UI implementation

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
