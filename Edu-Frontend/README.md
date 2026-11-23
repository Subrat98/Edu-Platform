# Our College Website — Phase 3

React + TypeScript college website with a Django REST Framework CMS backend. Phase 3 adds a **separate PostgreSQL database for each college/company tenant**.

- `PHASE-2-README.md` — original single-tenant CMS notes.
- `PHASE-3-MULTITENANT-README.md` — architecture, setup, tenant provisioning, tenant admin creation and API examples.
- `backend/` — central tenant registry, database router, tenant resolution middleware, tenant-scoped CMS API and management commands.
- `src/admin/` — tenant-aware React CMS login and content interface.

Start with `PHASE-3-MULTITENANT-README.md`. The backend's Python syntax and ZIP contents have been checked. The frontend production build and live PostgreSQL provisioning still need to be run in your development environment after installing dependencies and configuring PostgreSQL.
