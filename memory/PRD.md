# Blue Lotus - No-Code AI App Builder
## Product Requirements Document

### Last Updated: 2025-12-20

---

## Overview
Blue Lotus is a comprehensive no-code AI app builder that allows users to create apps using natural language instructions. The platform features an intelligent AI generation system, backend integrations, and Stripe billing.

---

## Core Features Implemented

### 1. AI App Builder (COMPLETE)
- **Pattern-Based Generation**: Fast component generation for common app types:
  - YouTube clone
  - E-commerce / Shopping apps
  - Social media / Twitter clone
  - Chat / Messaging apps
  - Recipe / Cooking apps
  - Music player / Spotify clone
  - Video creator / Editor
  - Dashboard / Analytics
  - Login / Signup forms
  - Contact forms
  - Generic forms

- **Intelligent AI Engine**: Multi-phase generation with:
  - Request understanding
  - App structure planning
  - Component generation
  - Self-correction capabilities

- **External AI Provider Integration** (NEW):
  - Support for OpenAI (GPT-4, GPT-4-turbo, GPT-4o)
  - Support for Anthropic (Claude 3 Opus, Sonnet, Haiku)
  - Support for Google (Gemini Pro, Gemini 1.5)
  - Support for custom OpenAI-compatible endpoints
  - Connection testing
  - Model selection and configuration

### 2. Backend Integrations (COMPLETE)
- **Supabase**: Full PostgreSQL, Auth, Storage integration
- **Firebase**: Firestore, Auth, Storage
- **REST API**: Custom API endpoints
- **GraphQL**: Custom GraphQL endpoints
- **MongoDB**: Direct Atlas connection

### 3. Billing System (COMPLETE)
- **Stripe Integration**: Real payment processing
- **Subscription Plans**: Free, Pro ($29/mo), Business ($99/mo)
- **Credit System**: Monthly credits, daily bonus, purchased credits
- **Checkout Flow**: Redirects to Stripe hosted checkout

### 4. User Authentication (COMPLETE)
- Email/password authentication
- Google OAuth integration
- JWT-based sessions
- Password reset functionality

### 5. Owner Dashboard (COMPLETE)
- User management
- Analytics overview
- System settings
- Compliance management
- Support tickets

---

## Technical Architecture

### Frontend
- React 18
- Tailwind CSS
- Shadcn/UI components
- React Router DOM
- Sonner (toast notifications)

### Backend
- FastAPI
- MongoDB (Motor async driver)
- 54+ modular engines
- Pydantic models

### Integrations
- Emergent LLM Key (GPT-5.2)
- Stripe (payments)
- External AI providers (OpenAI, Anthropic, Google)

---

## API Endpoints

### Builder AI
- `POST /api/builder/generate-components` - Generate UI components
- `POST /api/builder/fix-errors` - Self-correct component errors
- `POST /api/builder/suggest-improvements` - Get AI suggestions
- `POST /api/builder/expand-feature` - Add features to existing app
- `GET /api/builder/ai-status` - Check AI capabilities

### External AI
- `GET /api/external-ai/providers` - List supported providers
- `GET /api/external-ai/config` - Get user's AI config
- `POST /api/external-ai/config` - Save AI config
- `DELETE /api/external-ai/config` - Remove AI config
- `POST /api/external-ai/test` - Test connection
- `POST /api/external-ai/generate` - Generate with external AI

### Backend Connections
- `GET /api/backend/connections` - List connections
- `POST /api/backend/connections` - Create connection
- `POST /api/backend/connections/test` - Test connection
- `DELETE /api/backend/connections/{id}` - Delete connection

### Billing
- `GET /api/billing/plans` - Get subscription plans
- `POST /api/billing/subscribe` - Create checkout session
- `GET /api/billing/status/{session_id}` - Check payment status
- `POST /api/webhook/stripe` - Stripe webhook

---

## Data Models

### User
```json
{
  "user_id": "uuid",
  "email": "string",
  "hashed_password": "string",
  "role": "user|owner|admin",
  "plan": "free|pro|business",
  "credits": {...}
}
```

### Project
```json
{
  "project_id": "uuid",
  "user_id": "uuid",
  "name": "string",
  "status": "draft|published",
  "components": [...],
  "settings": {...}
}
```

### External AI Config
```json
{
  "user_id": "uuid",
  "provider": "openai|anthropic|google|custom",
  "api_key": "encrypted",
  "model": "string",
  "endpoint": "string (optional)",
  "max_tokens": 4096,
  "temperature": 0.7,
  "enabled": true
}
```

---

## Credentials
- **Test Account**: owner@bluelotus.ai / owner123
- **Stripe**: Test key configured
- **Emergent LLM Key**: Configured in backend

---

## Backlog / Future Tasks

### P1 (High Priority)
- [ ] Voice control integration in builder
- [ ] Real-time collaboration
- [ ] App publishing to custom domains

### P2 (Medium Priority)
- [ ] Team management UI
- [ ] Advanced billing analytics
- [ ] Template marketplace

### P3 (Low Priority)
- [ ] Logo customization tool
- [ ] White-label options
- [ ] API documentation

---

## Recent Changes (Dec 20, 2025)
1. Added External AI Provider integration
2. Enhanced pattern-based generation for complex apps
3. Fixed builder component rendering
4. Improved Supabase connection testing
5. Simplified Stripe checkout flow
