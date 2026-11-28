# College Multi-Tenant Platform

A multi-tenant college CMS platform with a **Super Admin Control Plane** (`/super-admin`), **Master College Base Replication**, **Read / Write / Edit / Delete RBAC**, and isolated PostgreSQL databases per college.

---

## 🚀 Quick Setup for New Clones (Teammates)

Databases (PostgreSQL) are local to each machine and are **not** stored directly in Git.  
Instead, all Master College content (Menu Bar sections, Content Pages, Notices, Departments, etc.) is stored in the Git-tracked fixture file `backend/fixtures/initial_college_data.json`.

### 1. Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # update PostgreSQL credentials if needed
```

### 2. Initialize Central PostgreSQL Database & Super Admin

```bash
# Create the PostgreSQL user and central control-plane database (once)
sudo -u postgres psql -c "CREATE USER college_platform WITH LOGIN CREATEDB PASSWORD 'your-password';"
createdb -h 127.0.0.1 -p 5432 -U college_platform college_platform_central

# Apply central database migrations
python manage.py migrate

# Create Super Admin login for /super-admin
python manage.py createsuperuser
```

### 3. Initialize Master College Base (`our-college`)

```bash
# Create the master college PostgreSQL database
python manage.py create_tenant --name "Our College" --slug our-college

# Load all Menu Bar sections, Content Pages, Departments & Notices from Git fixtures
python manage.py seed_tenant --slug our-college
```

### 4. Frontend Setup & Run

```bash
cd ../Edu-Frontend
npm install
npm run dev
```

- **Website**: `http://localhost:5173/`
- **Super Admin Portal**: `http://localhost:5173/super-admin` (sign in with `createsuperuser` account)
- **College Admin Portal**: `http://localhost:5173/admin`

---

## 🔄 Sharing & Pulling Updates via GitHub

### When YOU update Master Content Pages or Menu Bar locally:
1. Export your latest local database content into the Git-tracked fixture:
   ```bash
   cd backend
   .venv/bin/python manage.py tenant_data_backup export --slug our-college --resource all --output fixtures/initial_college_data.json
   ```
2. Push code + fixture to GitHub:
   ```bash
   git add .
   git commit -m "Update Super Admin, RBAC, and master college content"
   git push
   ```

### When ANOTHER PERSON pulls your latest changes:
```bash
git pull

# 1. Apply any new database migrations
cd backend
.venv/bin/python manage.py migrate --database=default
.venv/bin/python manage.py migrate_tenants

# 2. Load your latest Master Content Pages & Menu Bar updates
.venv/bin/python manage.py tenant_data_backup import --slug our-college --file fixtures/initial_college_data.json --overwrite

# 3. Install/update frontend packages if needed and run
cd ../Edu-Frontend
npm install
npm run dev
```
