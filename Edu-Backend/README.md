# Edu-Backend: Python Django REST Framework Service

A modular, production-ready Django REST Framework backend designed specifically for **Edu-Platform** (multi-tenant unified School & College education platform).

---

## 📁 Project Structure

```
Edu/
├── Edu-Platform/           # Frontend (React + Vite + TypeScript + Tailwind CSS)
└── Edu-Backend/            # Backend (Python + Django + Django REST Framework)
    ├── apps/
    │   ├── accounts/       # RBAC Authentication, User Personas & Sessions
    │   ├── institutions/   # School & College Institution Settings & Themes
    │   ├── academics/      # Departments, Programmes (UG/PG), Classes & Courses
    │   ├── notices/        # Announcements, Circulars, Pinned & Category Filters
    │   ├── erp/            # Students, Attendance, Examinations, Admissions & Fees
    │   ├── library/        # Books Catalogue, Copies, Borrowings & Fines
    │   ├── naac/           # Criteria 1–7 Metrics, AQAR, SSR & Evidence Repository
    │   ├── cms/            # Dynamic Pages, Contact Inquiries & Media Assets
    │   └── core/           # Database Seed Command & Common Utilities
    ├── edu_backend/        # Main Django Project Configuration (Settings, URLs, WSGI)
    ├── deps/               # Self-contained runtime dependencies
    ├── tests/              # Automated Test Suite
    ├── manage.py           # CLI Management Entrypoint
    ├── requirements.txt    # Dependency Manifest
    ├── run.sh              # One-click Server Launch Script
    └── db.sqlite3          # Pre-seeded SQLite Database
```

---

## 🚀 Quick Start

### 1. Run Migrations & Seed Database
The backend includes a pre-packaged seed command that matches the frontend's mock personas, departments, programmes, and notices:

```bash
cd Edu-Backend
python3 manage.py migrate
python3 manage.py seed_data
```

### 2. Start the API Server
```bash
./run.sh
# OR
python3 manage.py runserver 0.0.0.0:8000
```
The server will start at **`http://127.0.0.1:8000/api/`**.

### 3. Run Automated Tests
```bash
python3 manage.py test tests
```

---

## 🌐 API Endpoints Reference

### 1. Root & Diagnostics
- `GET /api/`: API root catalog listing all available endpoints
- `GET /api/health/`: Service and database health check

### 2. Authentication & Personas (`/api/auth/`)
- `GET /api/auth/personas/`: List all 11 predefined personas (School, College, Super Admin)
- `POST /api/auth/login/`: Authenticate via `{"user_id": "user-college-principal"}` or `{"username": "...", "password": "..."}`
- `POST /api/auth/logout/`: Clear active user session
- `GET /api/auth/me/`: Retrieve profile of currently authenticated user

### 3. Institutions & Governance (`/api/`)
- `GET /api/institutions/`: List institutions (returns "school" and "college" profiles with theme tokens and contact details)
- `GET /api/institutions/school/`: School profile
- `GET /api/institutions/college/`: College profile (with `#E42227` theme and `/college-logo.png`)
- `GET /api/platform-settings/`: Global content mode settings (`both`, `school_only`, `college_only`)

### 4. Academics (`/api/`)
- `GET /api/departments/?institution=college`: List academic departments (CSE, Physics, Chemistry, etc.)
- `GET /api/programmes/?level=UG`: List academic programmes (B.Tech, B.Sc, M.Sc, etc.)
- `GET /api/classes/?institution=school`: List classes (Class I to Class XII)
- `GET /api/courses/`: Course and syllabus catalogue

### 5. Notices & Circulars (`/api/`)
- `GET /api/notices/?institution=college`: College notices
- `GET /api/notices/?institution=school`: School notices
- `GET /api/notices/?category=Tender`: Filter notices by category
- `POST /api/notices/`: Publish a new announcement

### 6. ERP Modules (`/api/`)
- `GET /api/students/?institution=college`: Enrolled students directory
- `GET /api/attendance/?student_id=stu-col-1`: Student attendance logs
- `GET /api/attendance/summary/?student_id=stu-col-1`: Attendance percentage calculation
- `GET /api/examinations/`: Semester exams and schedules
- `GET /api/exam-results/?student_id=stu-col-1`: Marksheet and provisional grades
- `GET /api/admissions/`: Online admission applications
- `GET /api/certificate-requests/`: TC and bonafide requests
- `GET /api/fee-transactions/`: Fee payment ledgers

### 7. Library Management (`/api/`)
- `GET /api/books/?search=Algorithms`: Search books catalogue
- `GET /api/loans/?user_id=stu-col-1`: Active book borrowings & fines

### 8. NAAC & Quality Assurance (`/api/`)
- `GET /api/criteria/`: Criteria 1 through 7 scores and key indicators
- `GET /api/evidence/?criterion=1`: Uploaded SSR and AQAR documentation evidence

### 9. CMS & Public Pages (`/api/`)
- `GET /api/pages/`: Dynamic CMS pages (`about`, `history`, `rules`)
- `POST /api/contact-inquiries/`: Submit public inquiry form

---

## 🔒 CORS Configuration

CORS is configured via `django-cors-headers` to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://127.0.0.1:5173`
- `http://localhost:3000`
