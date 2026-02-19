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
6. **Owner Dashboard**: Complete platform administration for owners

---

## Implementation Status

### ✅ Complete: Full-Stack Application with 54 Engines

**Frontend:**
- Landing page with Blue Lotus branding
- Login/Signup with real backend auth (JWT)
- Dashboard with real project CRUD
- **NEW: Builder Workspace** with two-panel layout
- Pricing & Legal pages
- **Complete Owner Dashboard** with 8 sections

**Backend (54 Engines):**
- Core Engines (5): Credit, Generation, Publishing, Export, Plan Enforcement
- Billing Engine (1): Stripe subscription & payments
- Admin Engine (1): Owner Dashboard operations
- Analytics Engine (1): Platform metrics
- System Settings Engine (1): Platform configuration
- Compliance Engine (1): Legal documents
- Support Engine (1): Tickets & help articles
- Build Engines (4): Project, Data Model, Navigation, AI Instruction
- Advanced Engines (4): Orchestration, Runtime Intelligence, Canvas, Component Library
- Control Engines (4): AI Orchestration, Blueprint Generation, System Diagnostics, Platform Settings
- Voice Core Engines (6): Voice Input, STT→Intent, Orchestration, TTS, Safety, Settings
- Voice Experience Engines (3): Error Handling, Accessibility, Onboarding
- Voice Intelligence Engines (5): Help, Multi-Step Workflow, Component Placement, Debugging, Extended
- Voice Control Engines (4): Publishing, Data Modeling, Navigation, Project Review
- AI Generation Engines (7): Project Gen, Intent, Blueprint, Refine, Features, Evolution, Multi-Project
- Backend Integration Engines (5): Integration, API Connector, Routing, Data Sync, Security

---

## Builder Workspace - NEW Implementation

### Two-Panel Layout
- **Left Panel (35%)**: AI Conversation Stream
- **Right Panel (65%)**: Live Preview

### Multi-Agent AI System
Four specialized agents collaborate on each request:
1. **🏗️ Architect** (Blue): Plans structural changes
2. **🎨 Designer** (Purple): Handles visual aspects
3. **⚙️ Engineer** (Green): Implements changes
4. **👁️ Reviewer** (Orange): Reviews and approves

### Features
- Real-time agent conversation with streaming messages
- Voice input support (Web Speech API)
- Device mode switcher (Mobile/Tablet/Desktop)
- Undo functionality with history tracking
- Change confirmation for large modifications
- Live preview with responsive sizing
- Panel toggle (show/hide sidebar)
- Save status indicator
- Suggested prompts for quick actions
- **Backend Connections Modal** for connecting to external services

### User Controls
- Accept or reject AI changes
- Undo last action
- Refine existing components
- Voice-to-prompt conversion

---

## Backend Connections - ✅ COMPLETE (February 2025)

### Supported Providers
1. **🔥 Firebase**: Auth, Firestore, Storage (requires: api_key, project_id)
2. **⚡ Supabase**: PostgreSQL, Auth, Storage (requires: url, anon_key)
3. **🌐 REST API**: Any REST endpoint (requires: base_url)
4. **◈ GraphQL**: Any GraphQL API (requires: endpoint)
5. **🍃 MongoDB**: Direct MongoDB Atlas (requires: connection_string, database)

### UI Features
- **Backend button** in Builder header opens connections modal
- **Three views**: List (active connections), Add (provider selection + form), Details (view/manage)
- **Test Connection**: Validates credentials before saving
- **Credentials masked**: Shown as `***` in list view
- **Delete confirmation**: Prevents accidental removal

### API Endpoints
- `GET /api/backend/providers` - List all 5 providers
- `GET /api/backend/connections` - List user's connections (credentials masked)
- `POST /api/backend/connections` - Create new connection
- `POST /api/backend/connections/test` - Test credentials without saving
- `POST /api/backend/connections/{id}/test` - Test existing connection
- `DELETE /api/backend/connections/{id}` - Delete connection

### Testing
- **26 backend API tests** (100% pass rate)
- **9 frontend UI tests** (100% pass rate)
- Test file: `/app/backend/tests/test_backend_connections.py`

### Note on Mocking
- Test connection endpoint **validates required fields** per provider
- Returns simulated success (doesn't actually connect to Firebase/Supabase/etc.)
- Real provider connections would require additional implementation

---

## Owner Dashboard - Complete Implementation

### Access Control
- **Owner-only access** (admins cannot access)
- Access via email whitelist (`OWNER_EMAILS` env var) or `role: "owner"` in database

### 8 Sections
1. **Overview**: Stats, retention, churn, project funnel, signups chart
2. **Users Management**: List, search, suspend/reactivate/delete
3. **Projects Management**: List, search, archive/delete
4. **Billing & Plans**: Revenue, users by plan, transactions
5. **Analytics**: AI usage, signups, retention metrics
6. **System Settings**: Feature flags, global limits, branding
7. **Compliance Center**: Legal documents, third-party services
8. **Support Center**: Tickets, help articles, feedback

---

## Tech Stack
- **Frontend**: React 18, Tailwind CSS, Shadcn/UI
- **Backend**: FastAPI, Pydantic, Motor (async MongoDB)
- **Database**: MongoDB
- **AI**: GPT-5.2 via Emergent LLM Key (backend)
- **Voice**: OpenAI Whisper (STT), OpenAI TTS, Web Speech API (frontend)
- **Payments**: Stripe

---

## Test Credentials
- **Owner**: owner@bluelotus.ai / owner123
- **Regular User**: test@test.com / test123

---

## What's Real vs Mocked

### ✅ REAL (Working with Actual Logic)
- Auth system (JWT, MongoDB)
- Project CRUD (MongoDB)
- Credit system (deductions, limits)
- Backend AI Generation (GPT-5.2 via Emergent LLM Key)
- Voice STT/TTS (OpenAI via backend)
- Billing system (Stripe)
- Owner Dashboard (admin engine with real queries)

### 🟡 MOCKED/SIMULATED
- **Builder AI conversation** (client-side simulation with delays)
- Project structure changes in Builder (not persisted)
- Export engine (mock download URLs)

---

## Backlog

### P0 - Critical
- [x] Stripe payment integration ✅
- [x] Complete Owner Dashboard (all 8 sections) ✅
- [x] Builder Workspace with multi-agent AI ✅
- [ ] Connect Builder to backend AI Generation API

### P1 - Important
- [ ] Persist Builder changes to database
- [ ] Real-time AI generation in Builder
- [ ] Voice UI components in Builder (backend integration)
- [ ] User-facing Stripe billing UI

### P2 - Nice to Have
- [ ] Backend Management section in Owner Dashboard
- [ ] Extended analytics with charts
- [ ] Multi-language support

---

## Last Updated
December 2025 - Builder Workspace Complete (54 Engines)
