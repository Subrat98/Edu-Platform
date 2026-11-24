# College Multi-Tenant Platform

A multi-tenant college content management platform featuring an isolated database-per-tenant architecture, dynamic website navigation, and content page publishing.

---

## 🚀 Quick Setup for New Clones

When a teammate or another developer clones this repository, PostgreSQL and database files are **not** stored directly in Git (databases remain local/hosted). 

To give anyone who clones the project all the content pages, menu sections, departments, and notices immediately, follow these simple steps:

### 1. Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # configure database credentials if needed
```

### 2. Initialize Central Database & Run Migrations

```bash
python manage.py migrate
```

### 3. Initialize College Tenant with All Custom Content

Run the tenant creation and seed command. It automatically loads all version-controlled content pages, menu sections, and notices from `backend/fixtures/initial_college_data.json`:

```bash
# Register the college tenant
python manage.py create_tenant --name "Our College" --slug our-college

# Create an admin user for the college CMS
python manage.py create_tenant_admin --slug our-college --username admin --email admin@example.com --password adminpass

# Migrate and load all content pages and menu bar data automatically
python manage.py seed_tenant --slug our-college
```

### 4. Frontend Setup

```bash
cd ../Edu-Frontend
npm install
npm run dev
```

---

## 📦 How to Save & Share New Content Changes via Git

Whenever you create or modify **Content Pages**, **Menu Bar Items**, or other CMS content in your local admin panel:

1. **Export your latest local data into the repository fixtures:**
   ```bash
   cd backend
   python manage.py tenant_data_backup export --slug our-college --resource all --output fixtures/initial_college_data.json
   ```

2. **Commit and push to GitHub:**
   ```bash
   git add backend/fixtures/initial_college_data.json
   git commit -m "Update college content pages and navigation data"
   git push
   ```

3. **When someone else pulls the latest code, they simply run:**
   ```bash
   cd backend
   python manage.py seed_tenant --slug our-college --overwrite
   ```
   All pages, navigation sections, and updates will immediately appear on their machine!
