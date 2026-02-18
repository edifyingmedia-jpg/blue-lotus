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

#### Credit Engine (`/app/backend/engines/credit_engine.py`)
- 4 credit sources: Monthly, Bonus, Purchased, Starter
- Deduction priority: Bonus → Monthly → Purchased → Starter
- Daily bonus refresh (24h cycle, no rollover)
- Purchased credits never expire

#### Plan Enforcement Engine (`/app/backend/engines/plan_enforcement.py`)
- Free: 3 projects, no export/publish
- Creator: 10 projects, staging only, $9.99/mo
- Pro: 25 projects, production, $19.99/mo
- Elite: 100 projects, unlimited publish, team seats, $29.99/mo

#### Generation Engine (`/app/backend/engines/generation_engine.py`)
- Screen generation: 3 credits
- Page generation: 5 credits
- Flow generation: 8 credits
- Refinement: 1 credit
- (Currently mocked - ready for LLM integration)

#### Publishing Engine (`/app/backend/engines/publishing_engine.py`)
- Staging deployment (Creator+)
- Production deployment (Pro+)
- URL generation for deployments

#### Export Engine (`/app/backend/engines/export_engine.py`)
- Full app/website export
- Code package export
- Static assets export
- (Blocked for Free users)

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
