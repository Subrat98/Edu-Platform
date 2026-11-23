# Phase 3 — Separate database multi-tenant college platform

This phase changes the Phase 2 single-college CMS into a database-per-tenant architecture.

## Architecture

- **Central/control-plane database (`default`)**: Django users, tenant registry, tenant memberships and platform administration.
- **One PostgreSQL database per tenant**: notices, departments, banners, pages, gallery records and contact messages.
- **Tenant selection**: `X-Tenant-Slug` header for local development, or a registered custom domain / `<slug>.<TENANT_BASE_DOMAIN>` in production.
- **Authorization**: public visitors can read published tenant content; writes require an active `TenantMembership` for the selected tenant. A user can belong to more than one tenant.
- **Uploads**: media paths are namespaced by tenant database alias to prevent filename collisions between tenants.

The tenant databases are separate PostgreSQL databases, not schemas and not rows filtered by `tenant_id`. The initial implementation uses a shared PostgreSQL application role to connect to those databases; for stronger database-level isolation, provision a separate least-privilege PostgreSQL role per tenant and store its credentials in a secrets manager before production.

## 1. Install and configure

```bash
cd backend
python -m venv .venv
# Linux/macOS
source .venv/bin/activate
# Windows PowerShell: .venv\\Scripts\\Activate.ps1
pip install -r requirements.txt
```

Copy `.env.example` to `.env` in the project root and set the PostgreSQL connection values. The backend automatically loads the project-root `.env` file in development. In production, inject secrets through your process manager or secrets manager instead. Create a PostgreSQL role with permission to create databases, then use that role for the initial provisioning workflow.

For a local PostgreSQL server, create the platform role/database as appropriate. The `default` database is the control plane and can remain SQLite for local development, but PostgreSQL is recommended for production.

## 2. Create the central database and platform superuser

```bash
cd backend
python manage.py migrate --database=default
python manage.py createsuperuser
python manage.py runserver
```

Open `http://127.0.0.1:8000/django-admin/` to manage the tenant registry and memberships. This admin is for platform operators, not college content editors.

## 3. Provision a tenant database

From `backend/`:

```bash
python manage.py create_tenant --name "Our College" --slug our-college
```

This creates a PostgreSQL database named `college_our_college`, registers it in the central database, and applies the CMS migrations. Add a tenant domain if available:

```bash
python manage.py create_tenant --name "Example College" --slug example-college --domain college.example.com
```

The tenant slug is immutable in normal operations because it identifies the tenant database. Do not manually reuse a database name that already exists.

## 4. Create a college administrator

```bash
python manage.py create_tenant_admin --tenant our-college --username collegeadmin --email admin@example.com
```

The command prompts for a password and creates a central identity with membership only in the selected tenant. Repeat with a different username for another college, or grant an existing user membership through Django Admin.

## 5. Run the frontend

In another terminal, from the project root:

```bash
npm install
cp .env.example .env
npm run dev
```

On Windows, use `copy .env.example .env`. Open `http://localhost:5173/admin` and enter:

- College/company ID: `our-college`
- Username and password created above

The admin sends `X-Tenant-Slug` on login and subsequent CMS requests. A user must have an active membership in that tenant.

## 6. API examples

```bash
# Public content for one tenant
curl -H "X-Tenant-Slug: our-college" http://127.0.0.1:8000/api/notices/

# Login for that tenant
curl -X POST http://127.0.0.1:8000/api/auth/token/ \\
  -H "Content-Type: application/json" \\
  -H "X-Tenant-Slug: our-college" \\
  -d '{"username":"collegeadmin","password":"YOUR_PASSWORD"}'

# Authenticated content request
curl http://127.0.0.1:8000/api/dashboard/ \\
  -H "X-Tenant-Slug: our-college" \\
  -H "Authorization: Bearer ACCESS_TOKEN"
```

All tenant API requests must resolve a valid active tenant. A token alone does not grant access: the user must also have an active membership in the tenant named by the request header/domain.

## 7. Add CMS schema changes later

Create/update CMS migrations and apply them to every active tenant:

```bash
python manage.py makemigrations cms
python manage.py migrate_tenants
```

Control-plane model changes are migrated only on `default`:

```bash
python manage.py makemigrations tenants
python manage.py migrate --database=default
```

## Important production work still required

- Use PostgreSQL for the control-plane database too.
- Give each tenant a separate database role with only that database's privileges; store credentials in a secrets manager (not source code or plain tenant rows).
- Add tenant database connection health checks, connection-pool limits, provisioning rollback and tenant deletion/archive workflows.
- Configure TLS, HTTPS, secure secret rotation, rate limits, audit logs, monitoring and tested per-tenant backup/restore.
- Put tenant media in object storage with tenant-scoped access policies; the local media path namespacing is for development.
- Add custom-domain verification and DNS onboarding before allowing arbitrary domains.
- Add automated tests proving tenant A cannot read/write tenant B's content, including cross-tenant token replay tests.
- The existing public React pages still contain demo content; connect their data loaders to the tenant-aware API before deploying a live tenant website.

## Control-plane vs tenant admin

The Django Admin (`/django-admin/`) is the platform operator console. It manages tenants and their memberships in the central database. College staff should use the React CMS (`/admin`) so every request includes the selected tenant context. CMS models are intentionally not registered in the central Django Admin.
