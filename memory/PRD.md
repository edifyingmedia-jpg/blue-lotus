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
2. **Powerful AI Builder:** AI system for generating complex, working applications
3. **External AI Integration:** Allow users to connect their own AI models (OpenAI, Anthropic, Google)
4. **Stripe Billing:** Subscriptions and credit purchases
5. **Stability:** Robust authentication system

---

## What's Been Implemented

### ✅ Completed (Feb 20, 2026)
- **Authentication System Rebuilt:** Complete rewrite of Login/Signup with idempotent fetch patterns
  - Login working: `owner@bluelotus.ai` / `owner123`
  - Signup working for new users
  - JWT-based session management
- **User Dashboard:** Shows credits, plan status, quick actions
- **Builder UI:** Functional BuilderNew.jsx with AI generation
- **Intelligent AI Engine:** `intelligent_engine.py` with multi-step reasoning
- **External AI Provider Integration:** Users can configure their own API keys

### ✅ Previously Completed
- Full project scaffolding (React + FastAPI + MongoDB)
- User roles and permissions (owner, admin, user)
- Credit system with monthly/bonus/purchased credits
- Plan types (Free, Pro, Elite) with different allocations
- Builder UI with code generation capabilities
- External AI settings component

---

## Architecture

```
/app
├── backend
│   ├── core/
│   │   └── intelligent_engine.py  (Advanced AI logic)
│   ├── engines/                   (Credit, Plan engines)
│   ├── models/                    (Pydantic schemas)
│   ├── routes/
│   │   ├── auth.py               (Login/Signup/Me)
│   │   ├── builder_ai.py
│   │   ├── builder_intelligent_ai.py
│   │   └── external_ai.py
│   ├── server.py
│   └── requirements.txt
└── frontend
    └── src
        ├── components/
        │   └── builder/
        │       └── ExternalAISettings.jsx
        ├── context/
        │   └── AuthContext.js    (Rebuilt - clean implementation)
        ├── pages/
        │   ├── Login.jsx         (Rebuilt)
        │   ├── Signup.jsx        (Rebuilt)
        │   ├── Dashboard.jsx
        │   └── BuilderNew.jsx
        └── App.js
```

---

## Prioritized Backlog

### P0 - Critical (Completed)
- [x] Fix authentication "body stream already read" error
- [x] Ensure owner account exists and is accessible

### P1 - High Priority
- [ ] Implement async polling for AI generation (prevent timeouts)
- [ ] Complete Stripe billing integration
  - Backend checkout session creation
  - Webhook handlers for payment events
  - Credit allocation on successful payment

### P2 - Medium Priority
- [ ] Voice UI integration into Builder
- [ ] Replace mocked logic in placeholder engines
- [ ] Account Settings UI
- [ ] Team Management UI

### P3 - Low Priority / Backlog
- [ ] Logo redesign (user was previously dissatisfied)
- [ ] Enhanced error handling throughout
- [ ] Performance optimizations

---

## Key API Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/builder/generate/intelligent` - AI app generation
- `GET/POST /api/external-ai/config` - External AI provider settings

## Database Schema
- **users**: {id, email, name, password_hash, role, plan, credits, created_at, updated_at}
- **projects**: {id, user_id, name, description, screens, created_at}

## Test Credentials
- Email: `owner@bluelotus.ai`
- Password: `owner123`
- Role: owner
- Plan: Elite
