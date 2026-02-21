# Blue Lotus - AI App Builder Platform

## Original Problem Statement
Building a comprehensive no-code AI app builder named "Blue Lotus" where users can build and deploy apps using natural language, voice commands, and a powerful builder interface. The platform should be production-ready with full authentication, billing, and AI generation capabilities.

## Owner Identity
- Owner Account: `owner@bluelotus.ai`
- Owner Name: Tiffany Williams
- Password: owner123
- Plan: Elite

## Core Requirements
1. **Full-Stack Application:** React frontend + FastAPI backend + MongoDB
2. **Powerful AI Builder (TWIN-Builder Ultra):** Superior app-building intelligence
3. **External AI Integration:** Allow users to connect their own AI models
4. **Stripe Billing:** Subscriptions and credit purchases
5. **Stability:** Robust authentication system

---

## What's Been Implemented

### ✅ Completed (Feb 22, 2026)

#### Authentication & Billing - VERIFIED WORKING
- Login flow: 100% working (owner@bluelotus.ai / owner123)
- Signup flow: Creates users with Free plan + 20 starter credits
- Protected routes properly redirect to login
- Stripe checkout: Real integration (not mocked) - creates valid Stripe sessions
- Checkout flow: Plan selection → Review & Pay → Stripe redirect
- All billing APIs functional: /api/billing/plans, /api/billing/subscribe, etc.

#### Bug Fixes This Session
- Fixed builder_ai.py syntax error (duplicate text removed)
- Fixed Checkout.jsx race condition - was redirecting before auth state loaded
- Added authLoading check to prevent premature redirects

### ✅ Completed (Feb 21, 2026)

#### TWIN-Builder Ultra Integration
- Full system prompt with superiority principles
- Builder-of-builders mode
- Cloning mode (safe + powerful)
- Self-protection & platform-protection rules
- Production-grade output format

#### Cloning Templates Added
- YouTube clone (video platform with player, comments, subscriptions)
- Twitter/X clone (social media with feed, compose, trending)
- Instagram clone (photo sharing with stories, posts)
- Spotify clone (music streaming with playlists, player)

#### Bug Fixes
- Fixed "body stream already read" error across ALL frontend components
- Fixed Claude model identifiers (claude-3-opus-latest, etc.)
- Fixed self-protection regex to allow "Clone YouTube"

### ✅ Previously Completed
- Authentication system rebuilt (Login/Signup working)
- User Dashboard with credits and plan status
- Builder UI with AI generation
- External AI Provider integration
- Stripe billing endpoints (now verified working)

---

## TWIN-Builder Ultra System

### Core Identity
- High-performance, non-emotional, execution-focused builder AI
- Outperforms all no-code builder AIs in speed, clarity, structure

### Capabilities
- Full screen definitions with component lists
- Data models with fields and relationships
- User flows with triggers, steps, outcomes
- Logic rules and conditions
- Navigation maps
- API structures
- Builder-of-builders architectures

### Cloning Mode
- Internal: Duplicate user components precisely
- External: Reconstruct platforms from description
- Protected: Blue Lotus, Emergent, TWIN-Builder blocked

---

## Architecture

```
/app
├── backend
│   ├── routes/
│   │   ├── auth.py
│   │   ├── builder_ai.py (TWIN-Builder Ultra)
│   │   ├── billing.py (Stripe)
│   │   ├── external_ai.py
│   │   └── ...
│   ├── server.py
│   └── requirements.txt
└── frontend
    └── src
        ├── components/
        │   └── builder/
        │       └── ExternalAISettings.jsx
        ├── context/
        │   └── AuthContext.js
        ├── pages/
        │   ├── Login.jsx
        │   ├── Signup.jsx
        │   ├── Dashboard.jsx
        │   ├── BuilderNew.jsx
        │   └── Checkout.jsx
        └── App.js
```

---

## Prioritized Backlog

### P0 - Critical (Completed)
- [x] Fix authentication errors
- [x] Fix "body stream already read" errors
- [x] Integrate TWIN-Builder Ultra
- [x] Verify Stripe checkout end-to-end (VERIFIED - Real integration)
- [x] Fix Checkout.jsx auth race condition

### P1 - High Priority
- [ ] Implement async polling for AI generation (prevent timeouts on complex requests)
- [ ] Add more clone templates (Netflix, Airbnb, Uber)
- [ ] Add credit pack purchase UI on Pricing page

### P2 - Medium Priority
- [ ] Voice UI integration into Builder
- [ ] Replace mocked engines with real logic
- [ ] Account Settings UI
- [ ] Team Management UI

### P3 - Backlog
- [ ] Logo redesign
- [ ] Performance optimizations
- [ ] Advanced error handling

---

## Key API Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/builder/generate-components` - AI component generation
- `POST /api/billing/subscribe` - Start Stripe checkout
- `POST /api/billing/webhook` - Stripe webhook handler

## Test Credentials
- Email: `owner@bluelotus.ai`
- Password: `owner123`
- Role: owner
- Plan: Elite
