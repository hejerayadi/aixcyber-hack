# Backend (NestJS) — Scaffold

This folder will contain a NestJS backend that serves the API and AI proxy endpoints.

Suggested quick start (local dev):

1. Install Node and PNPM/NPM. Prefer Node 20+.
2. cd backend
3. npm init -y
4. npm i @nestjs/core @nestjs/common @nestjs/platform-express reflect-metadata rxjs
5. Create modules and start implementing auth, portfolio, market adapters.

Important modules to add:
- Auth (JWT/OAuth2)
- Users
- Portfolio
- Market adapters (bourse/startup)
- AI proxy
