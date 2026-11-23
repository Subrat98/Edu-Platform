# College CMS API — Phase 2

Django REST Framework backend for notices, departments, homepage banners, content pages, gallery images and contact messages. Public users can read published content and submit contact messages. All content write operations and dashboard statistics require a staff/superuser JWT.

## Local setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\\Scripts\\Activate.ps1
pip install -r requirements.txt
python manage.py makemigrations cms
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

API: `http://127.0.0.1:8000/api/`  | Django admin: `http://127.0.0.1:8000/django-admin/`

## Endpoints

- `POST /api/auth/token/` — obtain access/refresh JWT (`username`, `password`)
- `POST /api/auth/token/refresh/` — refresh access token
- `/api/notices/`, `/api/departments/`, `/api/banners/`, `/api/pages/`, `/api/gallery/`
- `POST /api/contact-messages/` — public contact form submission; GET/PATCH is staff-only
- `GET /api/dashboard/` — staff-only content counts

Notices support `?search=`, `?category=`, `?year=` and standard page-number pagination. Departments and pages use slug detail routes. Uploaded media is stored under `backend/media/` during development.

## Production checklist

Set a strong `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=0`, `DJANGO_ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS` and PostgreSQL `DATABASE_URL`. Configure HTTPS, secure cookies, backups, rate limiting, email delivery and durable media storage before launch. Do not expose Django admin to the public without strong credentials and operational protections.

# Setup
python -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt

#Demo User
sudo -u postgres psql
CREATE USER college_platform WITH LOGIN CREATEDB PASSWORD 'College@12345';

python manage.py migrate --database=default
python manage.py createsuperuser
python manage.py runserver

python manage.py create_tenant \
  --name "Our College" \
  --slug our-college

python manage.py create_tenant_admin \
  --tenant our-college \
  --username collegeadmin \
  --email admin@example.com