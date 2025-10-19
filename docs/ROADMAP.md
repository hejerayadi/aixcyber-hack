# Wealth Management Dashboard — Roadmap & Architecture

This document outlines a pragmatic roadmap to transform the downloaded Next.js admin dashboard into a secure, intelligent Wealth Management platform focused on Tunisian investors.

Goals
- Multi-asset portfolio management (Tunisian stocks, startups, private equity, cash)
- AI-powered personalized recommendations (risk profiling, allocation, alerts)
- Strong security & compliance (OAuth2/JWT, RBAC, GDPR guidance)
- Remove/disable crypto features for Tunisian users
- Scalable architecture: Next.js frontend + NestJS backend + AI microservices

High-level architecture
- Frontend: Next.js (app router), Tailwind UI components. Responsible for presentation, client-side feature flags, i18n, and auth flows.
- Backend API: NestJS REST (or GraphQL) serving portfolio data, user profiles, auth, and AI proxy endpoints.
- AI services: Python microservice(s) or OpenAI-proxy endpoints for risk profiling and recommendations. Keep models stateless and cache results.
- Data stores: PostgreSQL for transactional data, Redis for caching and real-time pub/sub (alerts), object storage for documents.
- Integrations: BVMT/Bourse de Tunis APIs, local broker APIs, startup directories, regulatory/legal data.

Key modules & endpoints (initial)
- Auth: /api/auth/login, /api/auth/refresh, /api/auth/me
- Portfolio: /api/portfolio (CRUD), /api/portfolio/{id}/positions
- Market data: /api/market/bourse, /api/market/startups
- AI: /api/ai/risk-profile, /api/ai/recommendation
- Admin: /api/admin/users, /api/admin/audit

Feature flags & region rules
- All crypto-related UI/features must be disabled when region is `TN` (Tunisia).
- Use server-side region detection and client-side fallback (env var NEXT_PUBLIC_REGION) for dev/testing.

Phases
1. Audit & safety (this repo): remove/hide crypto UI, add feature flags, basic docs (done).
2. Scaffold backend & auth: NestJS skeleton, JWT auth, RBAC for routes.
3. Data model & integrations: make adapters for BVMT/Bourse + local brokers; store normalized instruments.
4. AI & analytics: build AI proxy and start with simple risk profiling; add tests and sample responses.
5. UX polish & localization: i18n (fr/ar/en), legal disclosures, onboarding flows.
6. Security hardening & compliance: HTTPS, encryption, logging, pen-test checklist, deploy to staging.

Next immediate tasks
- Implement backend auth and portfolio endpoints (scaffolded in /backend).
- Implement client-side region/feature flag usage and legal disclosures (small components added).
- Wire a small AI-proxy endpoint (dummy) to iterate with frontend.
