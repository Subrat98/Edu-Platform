# Phase 2 — Admin CMS + Django API

This package extends the Phase 1 React + TypeScript college website with a Django REST Framework backend and a React admin workspace at `/admin`.

## Start the backend

```bash
cd backend
python -m venv .venv
# Linux/macOS: source .venv/bin/activate
# Windows PowerShell: .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py makemigrations cms
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## Start the frontend (second terminal)

```bash
npm install
cp .env.example .env   # Windows: copy .env.example .env
npm run dev
```

Open `http://localhost:5173/admin` and sign in with the Django staff account created above. Public website: `http://localhost:5173`.

## CMS modules

- Notices: create, edit, publish/unpublish, search and category/year filters through API.
- Departments: create/edit department details and programmes.
- Content pages: create/edit slug-based pages and SEO description.
- Contact messages: view public form enquiries in the admin workspace.
- Banners and gallery: API endpoints are ready; upload and manage images through Django admin at `http://127.0.0.1:8000/django-admin/`.
- Dashboard counts: notices, departments, pages and unread messages.

## API security

Public GET access is limited to published/active content. POST/PATCH/DELETE content operations require a JWT belonging to a Django staff user. Public contact POST is enabled; viewing messages requires staff access. The React panel stores the short-lived access token in localStorage; for a production deployment, consider an HttpOnly-cookie/BFF session design, HTTPS, rate limiting, backups, email delivery, and durable media storage.

## Notes / next integration

Phase 1 still contains some demonstration content in local TypeScript data. The API is now ready, but replacing every public page's demo data with live API queries, adding token refresh handling, and deploying the backend/database/media storage are follow-on integration tasks. Image upload management is available in Django admin rather than the custom React panel in this iteration.
