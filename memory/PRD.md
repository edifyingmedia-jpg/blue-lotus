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
- Builder interface
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

## Owner Dashboard - Complete Implementation

### Access Control
- **Owner-only access** (admins cannot access)
- Access via email whitelist (`OWNER_EMAILS` env var) or `role: "owner"` in database
- Current owner email: `owner@bluelotus.ai`

### 8 Sections Implemented

#### 1. Overview
- Total users, projects, active sessions, credits used
- Revenue display
- System status indicator
- User retention metrics (7-day, 30-day, churn rate)
- Project funnel (draft → staged → published)
- Recent signups chart (7 days)

#### 2. Users Management
- Full user list with pagination
- Search users by name/email
- View user details (role, plan, projects, status)
- Actions: Suspend, Reactivate, Delete users
- Role badges (owner, admin, user)
- Status badges (active, suspended)

#### 3. Projects Management
- Full project list with pagination
- Search projects by name
- View project details (owner, type, status, updated)
- Actions: Archive, Delete projects
- Status badges (draft, staged, published, archived)

#### 4. Billing & Plans
- Subscription revenue overview
- Credit purchases total
- Users by plan breakdown
- Recent transactions list
- Transaction status (paid, refunded)

#### 5. Analytics
- AI generation statistics (total, by type)
- Daily signups chart (30 days)
- User metrics (active 7d, churn rate)
- Voice usage stats (when available)

#### 6. System Settings
- **Feature Flags** with toggles:
  - Voice Commands
  - AI Generation
  - Publishing
  - Export
  - Team Features
  - Beta Features
- **Global Limits**:
  - Max Free Projects (3)
  - Max File Upload (10 MB)
  - Session Timeout (60 min)
  - API Rate Limit (100/min)
- **Branding**: App name, tagline, primary color

#### 7. Compliance Center
- Legal documents management (Terms, Privacy, Cookie, AUP)
- Document versioning
- "Add Document" functionality
- **Third-Party Services** documentation:
  - MongoDB (Database storage)
  - Stripe (Payment processing)
  - OpenAI (AI generation)

#### 8. Support Center
- **Ticket Statistics**: Total, Open, In Progress, Resolved
- Support tickets list with priority badges
- Ticket actions: Mark In Progress, Resolve, Close
- **Help Articles**: Create, edit, publish articles
- **Recent Feedback**: User feedback submissions

---

## API Routes

### Admin Routes (Owner Only)
```
# Stats & Health
GET  /api/admin/stats
GET  /api/admin/health

# Users
GET  /api/admin/users
GET  /api/admin/users/{id}
PUT  /api/admin/users/{id}/role
PUT  /api/admin/users/{id}/plan
POST /api/admin/users/{id}/suspend
POST /api/admin/users/{id}/reactivate
DELETE /api/admin/users/{id}

# Projects
GET  /api/admin/projects
POST /api/admin/projects/{id}/archive
DELETE /api/admin/projects/{id}

# Billing
GET  /api/admin/billing/overview
GET  /api/admin/transactions
POST /api/admin/transactions/{id}/refund

# Analytics
GET  /api/admin/analytics/ai-usage
GET  /api/admin/analytics/voice-usage
GET  /api/admin/analytics/retention
GET  /api/admin/analytics/project-funnel
GET  /api/admin/analytics/errors
GET  /api/admin/analytics/signups

# Settings
GET  /api/admin/settings/branding
PUT  /api/admin/settings/branding
GET  /api/admin/settings/features
PUT  /api/admin/settings/features/{key}
GET  /api/admin/settings/limits
PUT  /api/admin/settings/limits/{key}
GET  /api/admin/settings/email-templates
PUT  /api/admin/settings/email-templates/{key}
GET  /api/admin/settings/notifications
PUT  /api/admin/settings/notifications

# Compliance
GET  /api/admin/compliance/documents
GET  /api/admin/compliance/documents/{type}
POST /api/admin/compliance/documents
GET  /api/admin/compliance/documents/{type}/versions
GET  /api/admin/compliance/consents
GET  /api/admin/compliance/third-party
PUT  /api/admin/compliance/third-party

# Support
GET  /api/admin/support/tickets
GET  /api/admin/support/tickets/stats
GET  /api/admin/support/tickets/{id}
POST /api/admin/support/tickets/{id}/reply
PUT  /api/admin/support/tickets/{id}/status
GET  /api/admin/support/articles
POST /api/admin/support/articles
PUT  /api/admin/support/articles/{id}
DELETE /api/admin/support/articles/{id}
GET  /api/admin/support/feedback
```

### Other Routes
- `/api/auth/*` - Authentication
- `/api/projects/*` - Project CRUD
- `/api/billing/*` - Stripe billing
- `/api/ai/*` - AI generation
- `/api/voice/*` - Voice processing
- `/api/publishing/*` - Deployment

---

## Tech Stack
- **Frontend**: React 18, Tailwind CSS, Shadcn/UI
- **Backend**: FastAPI, Pydantic, Motor (async MongoDB)
- **Database**: MongoDB
- **AI**: GPT-5.2 via Emergent LLM Key
- **Voice**: OpenAI Whisper (STT), OpenAI TTS
- **Payments**: Stripe

---

## Test Credentials
- **Owner**: owner@bluelotus.ai / owner123
- **Regular User**: test@test.com / test123

---

## Backlog

### P0 - Critical
- [x] Stripe payment integration ✅
- [x] Complete Owner Dashboard (all 8 sections) ✅
- [ ] Frontend UI for AI Project Generation

### P1 - Important
- [ ] Voice UI components in Builder page
- [ ] Account Settings UI
- [ ] User-facing Stripe billing UI

### P2 - Nice to Have
- [ ] Backend Management section in Owner Dashboard
- [ ] Extended analytics with charts
- [ ] Multi-language support

---

## Last Updated
December 2025 - Owner Dashboard Complete (54 Engines)
