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
- Custom Blue Lotus logo and branding
- Dark theme with blue accents
- Hero section with marketing copy
- Features, How It Works, CTA sections
- Footer with navigation links

### ✅ Phase 2: Multi-Page App Structure (Completed)
- Login/Signup pages (mocked auth)
- Dashboard with project listing
- New Project creation flow
- Settings page with tabs
- Pricing page

### ✅ Phase 3: No-Code Builder Interface (Completed)
- Left panel: AI Chat + Project Navigator
- Right panel: Read-only preview
- Chat-based command interface
- Project structure visualization

### ✅ Phase 4: Legal Documentation (Completed - December 2025)
- Created `/app/frontend/src/data/legal.js` with 17 policies
- Created `/app/frontend/src/pages/Legal.jsx` page component
- Routes configured: `/legal` and `/legal/:docId`
- Footer links updated to legal pages
- Policies included: Terms of Service, Privacy Policy, Cookie Policy, Acceptable Use, Refund Policy, DMCA, Security, Disclaimer, DPA, GDPR, CCPA, Accessibility, SLA, API Terms, Billing, IP Policy, Compliance

---

## Current State

### Frontend (Complete - Prototype)
- **Framework**: React with React Router
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI
- **State**: Local mocked data

### Backend (Not Implemented)
- **Planned**: FastAPI + MongoDB
- **Status**: All data is mocked in `/app/frontend/src/data/`

---

## Prioritized Backlog

### P0 - Immediate
- [x] Complete legal documentation implementation

### P1 - Backend Foundation
- [ ] Create API contracts document (`contracts.md`)
- [ ] Implement user authentication (register, login, JWT)
- [ ] Implement project CRUD operations
- [ ] Connect frontend to backend

### P2 - Enhanced Features
- [ ] Real AI integration for builder chat
- [ ] Project persistence in MongoDB
- [ ] User profile management

### P3 - Production Readiness
- [ ] Error handling and validation
- [ ] Loading states and UX polish
- [ ] Performance optimization

---

## Architecture

```
/app
├── frontend/
│   └── src/
│       ├── components/     # Reusable UI components
│       │   └── ui/        # Shadcn components
│       ├── data/          # Mock data files
│       │   ├── mock.js    # Project & user data
│       │   └── legal.js   # Legal policy content
│       ├── pages/         # Page components
│       │   ├── Builder.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Landing.jsx
│       │   ├── Legal.jsx
│       │   └── ...
│       └── context/       # React context (AuthContext)
└── backend/               # (Planned - Not implemented)
```

---

## Notes
- All functionality is currently **MOCKED**
- Authentication accepts any credentials
- AI responses are hardcoded
- No database connection exists
