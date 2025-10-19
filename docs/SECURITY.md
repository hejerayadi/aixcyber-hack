# Security Baseline & Checklist

This file provides a starting security checklist and minimal implementation guidance for the Wealth Management platform.

Baseline controls
- Transport: enforce HTTPS everywhere. Use HSTS and secure cookies.
- Authentication: OAuth2/OIDC or JWT-based flows. Short-lived access tokens + refresh tokens.
- Authorization: role-based access control (RBAC). Minimal roles: user, advisor, admin.
- Data protection: encrypt sensitive PII and financial data at rest; use parameterized queries.
- Secrets: store in a secrets manager (Azure Key Vault / AWS Secrets Manager / env with CI encrypted variables).
- Logging & monitoring: centralized logs (ELK/Datadog), audit trails for financial operations.

Quick implementation notes
- Next.js: use secure cookies for server-set tokens; use httpOnly flag; set SameSite=strict where applicable.
- Backend: implement JWT with rotating refresh tokens. Keep refresh tokens in DB with revoke capability.
- CORS: allow only necessary origins. For internal services, use mTLS where possible.

Compliance notes (Tunisia & GDPR)
- Ensure users can exercise data subject rights (export, delete, rectify).
- Capture lawful basis for processing financial data and consent flows for sensitive operations.
- Provide local legal disclosure pages and record consent timestamps.

Pen-test & hardening checklist
- Dependency scans (npm audit / Snyk), static analysis, dependency pinning
- Input validation everywhere, use strong typing (TypeScript)
- Rate-limiting on public endpoints; WAF for known attack patterns
- CSP, X-Frame-Options, XSS protections at headers
