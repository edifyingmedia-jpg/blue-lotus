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

### ✅ Phase 7: Onboarding Flow (Completed - December 2025)
- Created `/app/frontend/src/pages/Onboarding.jsx` - 6-step onboarding wizard
- Step 1: Welcome - Introduction to Blue Lotus with key benefits
- Step 2: Account Setup - Name, Email, Password form with validation
- Step 3: Starter Credits - Shows 20 free credits introduction
- Step 4: Project Type - Select App/Website/Both with visual cards
- Step 5: Project Brief - Describe project with quick suggestion buttons
- Step 6: Review Structure - Shows generated screens, data models, flows
- Progress bar with step count and percentage
- Back/Continue navigation buttons
- Updated Hero, CTA, and Navbar "Get Started" buttons to use /onboarding route
- MOCKED: Account creation and project structure generation

### ✅ Phase 6: Checkout & Payment Flow (Completed - December 2025)
- Created `/app/frontend/src/pages/Checkout.jsx` - multi-step checkout flow
- 4-step wizard: Plan Selection → Order Summary → Payment → Confirmation
- Progress stepper with visual indicators
- Plan preselection via URL query param (`/checkout?plan=pro`)
- Payment form with card formatting
- Processing state with spinner
- Success screen with next steps checklist
- Updated Pricing page CTAs to link to checkout

### ✅ Phase 5: Pricing System (Completed - December 2025)
- Updated `/app/frontend/src/data/mock.js` with new pricing tiers and credit data
- Revamped `/app/frontend/src/pages/Pricing.jsx` with credit-based pricing
- 4 Tiers: Free (20 starter credits), Creator ($9.99/150 credits), Pro ($19.99/400 credits), Elite ($29.99/800 credits)
- Credit add-on packs: 100 ($4.99), 250 ($9.99), 600 ($19.99), 1500 ($39.99)
- Monthly/Yearly billing toggle with 20% yearly discount
- Credit rules: daily bonus, no rollover, purchased credits never expire
- Export restrictions on free tier
- Created `/app/frontend/src/data/legal.js` with 17 policies
- Created `/app/frontend/src/pages/Legal.jsx` page component
- Created `/app/frontend/src/pages/LegalNav.jsx` - centralized navigation page
- Created `/app/frontend/src/pages/ComplianceCenter.jsx` - data rights & compliance request form
- Created `/app/frontend/src/components/UserAgreementModal.jsx` - terms acceptance modal
- Routes: `/legal` (hub), `/legal/:docId` (docs), `/compliance` (compliance center)
- Footer links updated with 4 sections: Product, Legal, Compliance, Company
- Policies included: Terms of Service, Privacy Policy, Cookie Policy, Acceptable Use, Refund Policy, DMCA, Security, Disclaimer, DPA, GDPR, CCPA, Accessibility, SLA, API Terms, Billing, IP Policy, Compliance
- Legal nav organized into 5 categories
- Compliance Center features: Data Rights actions, Legal docs, Security docs, Request form
- User Agreement Modal integrated into Signup flow

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
