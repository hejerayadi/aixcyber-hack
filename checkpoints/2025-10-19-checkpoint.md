# Checkpoint — 2025-10-19

Timestamp: 2025-10-19T00:00:00Z (local)

What this snapshot captures
- Dev server running: Next dev on http://localhost:3000 (or alternate port if 3000 is in use).
- Wallet routing conflict resolved: ensured only `src/app/wallet/*` exists and `src/app/(admin)/wallet/page.tsx` was removed to avoid parallel-route errors.
- Files of interest (current wallet integration focus):
  - `src/app/wallet/layout.tsx` — layout that composes `AppSidebar`, `Backdrop`, and `AppHeader` for `/wallet` pages.
  - `src/app/wallet/page.tsx` — wallet UI (balance, quick actions, recent activity).
  - `src/components/investor/InvestorLanding.tsx` — investor landing dashboard (bourse & startup cards).

Notes / next actions
- Integrate HashPack (Hedera) wallet: detect provider, connect/disconnect, show account/balance, add signing stubs.
- Add UI component `HashpackConnect` to the wallet screen and wire interactions to Hedera SDK or HashConnect as needed.
- Keep client-only code guarded (use `"use client"` and optional chaining for provider methods).

If you need me to revert to a git-like checkpoint, I can create a zip snapshot or initialize a local git repo and commit — tell me which you prefer.
