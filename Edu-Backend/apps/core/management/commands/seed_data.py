from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.institutions.models import Institution, PlatformSettings
from apps.academics.models import Department, Programme, ClassSection
from apps.notices.models import Notice
from apps.erp.models import Student, AttendanceRecord, Examination, ExamResult, AdmissionApplication, FeeTransaction
from apps.library.models import Book, BookLoan
from apps.naac.models import NaacCriterion, NaacMetricEvidence
from apps.cms.models import Page
import datetime

User = get_user_model()


class Command(BaseCommand):
    help = "Seeds the database with initial School and College data matching Edu-Platform"

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting database seeding...")

        # 1. Platform Settings
        PlatformSettings.objects.update_or_create(
            id=1,
            defaults={
                "content_mode": "both",
                "school_visible": True,
                "college_visible": True,
                "maintenance_mode": False,
            }
        )

        # 2. Institutions
        Institution.objects.update_or_create(
            id="school",
            defaults={
                "type": "school",
                "name": "Our School",
                "short_name": "OS",
                "tagline": "Where Every Child Learns to Shine · Estd. 1998",
                "description": "A premier CBSE-affiliated Senior Secondary School in Nayagarh, Odisha. Dedicated to value-based holistic education, Atal Tinkering Lab innovation, and inclusive learning.",
                "established_year": 1998,
                "affiliation": "CBSE Affiliation No. 3330123 · School Code: 15234 · UDISE+ 21160401201",
                "address": "Khandapara Road, Near Bus Stand",
                "city": "Khandapara, Nayagarh",
                "state": "Odisha",
                "pincode": "752054",
                "phone": "+91 98765 43210",
                "alt_phone": "+91 6757 223456",
                "email": "info@ourschool.edu.in",
                "logo_url": "/favicon.png",
                "primary_color": "#C21717",
                "accent_color": "#991b1b",
                "background_color": "#FFFFFF",
                "text_primary_color": "#7F0000",
                "stats": [
                    {"label": "Enrolled Students", "value": "1,250+"},
                    {"label": "Qualified Teachers", "value": "48"},
                    {"label": "Smart Classrooms & Labs", "value": "42"},
                    {"label": "Class X/XII Pass Rate", "value": "98.4%"},
                ],
                "is_visible": True,
            }
        )

        Institution.objects.update_or_create(
            id="college",
            defaults={
                "type": "college",
                "name": "Our College",
                "short_name": "OC",
                "tagline": "Sculpting Heart, Head & Hand · Established 2026",
                "description": "Premier autonomous degree college of Odisha, NAAC Accredited A+ (CGPA 3.42), recognized under UGC Category-1 with 32 PG Departments, Central Instrumentation Facility, and academic excellence.",
                "established_year": 2026,
                "affiliation": "Autonomous College under State Universities Act · UGC 2(f) & 12(B) · NAAC A+ (CGPA 3.42)",
                "address": "College Campus, College Square",
                "city": "Bhubaneswar & Cuttack",
                "state": "Odisha",
                "pincode": "751004",
                "phone": "+91 674 2567387",
                "alt_phone": "+91 671 2201690",
                "email": "registrar@ourcollege.edu.in",
                "logo_url": "/college-logo.png",
                "primary_color": "#E42227",
                "accent_color": "#991b1b",
                "background_color": "#FFFFFF",
                "text_primary_color": "#7F0000",
                "stats": [
                    {"label": "Years of Legacy", "value": "80+"},
                    {"label": "Affiliated Colleges", "value": "380+"},
                    {"label": "Enrolled Students", "value": "24,000+"},
                    {"label": "Scopus & WoS Papers", "value": "3,500+"},
                ],
                "is_visible": True,
            }
        )

        # 3. Demo Users
        users_data = [
            {
                "id": "user-platform-super-admin",
                "username": "superadmin",
                "email": "superadmin@eduplatform.demo",
                "first_name": "Aurobindo",
                "last_name": "Mahapatra",
                "role": "platform_admin",
                "institution_id": "all",
                "designation": "State Higher Education Commissioner",
            },
            {
                "id": "user-school-principal",
                "username": "school_principal",
                "email": "principal@ourschool.edu.in",
                "first_name": "Minati",
                "last_name": "Pattnaik",
                "role": "school_principal",
                "institution_id": "school",
                "designation": "Principal & Head of School",
            },
            {
                "id": "user-school-teacher",
                "username": "school_teacher",
                "email": "teacher@ourschool.edu.in",
                "first_name": "Subhashree",
                "last_name": "Nayak",
                "role": "teacher",
                "institution_id": "school",
                "department": "Science",
                "designation": "Senior PGT Physics",
            },
            {
                "id": "user-school-student",
                "username": "school_student",
                "email": "student@ourschool.edu.in",
                "first_name": "Ayush",
                "last_name": "Pattnaik",
                "role": "student",
                "institution_id": "school",
                "designation": "Class X-A, Roll #14",
            },
            {
                "id": "user-school-parent",
                "username": "school_parent",
                "email": "parent@ourschool.edu.in",
                "first_name": "Bhabani",
                "last_name": "Pattnaik",
                "role": "parent",
                "institution_id": "school",
                "designation": "Guardian of Ayush (X-A)",
            },
            {
                "id": "user-college-principal",
                "username": "college_principal",
                "email": "principal@ourcollege.edu.in",
                "first_name": "Prof. Bidhu Bhusan",
                "last_name": "Mishra",
                "role": "college_principal",
                "institution_id": "college",
                "designation": "Principal & Ex-Officio Chairman",
            },
            {
                "id": "user-college-hod",
                "username": "college_hod",
                "email": "hod.cse@ourcollege.edu.in",
                "first_name": "Dr. Pravat Kumar",
                "last_name": "Roul",
                "role": "hod",
                "institution_id": "college",
                "department": "Computer Science & Engineering",
                "designation": "Professor & Head of Department",
            },
            {
                "id": "user-college-faculty",
                "username": "college_faculty",
                "email": "faculty@ourcollege.edu.in",
                "first_name": "Dr. Sanghamitra",
                "last_name": "Mohanty",
                "role": "teacher",
                "institution_id": "college",
                "department": "Computer Science & Engineering",
                "designation": "Associate Professor",
            },
            {
                "id": "user-college-student",
                "username": "college_student",
                "email": "student@ourcollege.edu.in",
                "first_name": "Smruti",
                "last_name": "Prajna",
                "role": "student",
                "institution_id": "college",
                "department": "Computer Science",
                "designation": "B.Tech CSE, 6th Semester",
            },
            {
                "id": "user-college-librarian",
                "username": "college_librarian",
                "email": "librarian@ourcollege.edu.in",
                "first_name": "Basanta",
                "last_name": "Das",
                "role": "librarian",
                "institution_id": "college",
                "designation": "Chief Librarian (Koha ILMS Admin)",
            },
            {
                "id": "user-college-examcell",
                "username": "college_examcell",
                "email": "examcell@ourcollege.edu.in",
                "first_name": "Prof. Manas Ranjan",
                "last_name": "Das",
                "role": "exam_controller",
                "institution_id": "college",
                "designation": "Controller of Examinations",
            },
        ]

        for u in users_data:
            user_obj, created = User.objects.update_or_create(
                id=u["id"],
                defaults={
                    "username": u["username"],
                    "email": u["email"],
                    "first_name": u["first_name"],
                    "last_name": u["last_name"],
                    "role": u["role"],
                    "institution_id": u["institution_id"],
                    "department": u.get("department", ""),
                    "designation": u.get("designation", ""),
                    "is_staff": u["role"] in ("platform_admin", "school_principal", "college_principal"),
                    "is_superuser": u["role"] == "platform_admin",
                }
            )
            if created or not user_obj.has_usable_password():
                user_obj.set_password("demo123")
                user_obj.save()

        # 4. Departments
        depts_data = [
            ("dept-cse", "college", "Computer Science & Engineering", "CSE", "Leading centre for AI, Systems, and Data Science.", "Dr. Pravat Kumar Roul", 18, 480, 6),
            ("dept-physics", "college", "Postgraduate Department of Physics", "PHY", "Pioneering research in condensed matter physics and nanomaterials.", "Dr. Ramesh Chandra Sahoo", 14, 220, 5),
            ("dept-chemistry", "college", "Department of Chemistry", "CHEM", "Research in synthetic chemistry and catalysis.", "Dr. Anita Dash", 12, 190, 4),
            ("dept-math", "college", "Department of Mathematics", "MATH", "Pure and Applied Mathematics with computational analytics.", "Dr. Saroj Kumar Jena", 10, 160, 2),
            ("dept-english", "college", "Department of English", "ENG", "Postcolonial literature, linguistics, and cultural studies.", "Dr. Alok Ranjan Mohapatra", 8, 140, 1),
            ("dept-commerce", "college", "Department of Commerce & Management", "COMM", "Financial management, taxation, and business analytics.", "Dr. Niranjan Nayak", 16, 420, 2),
        ]
        for did, inst, name, code, desc, hod, fac, stu, labs in depts_data:
            Department.objects.update_or_create(
                id=did,
                defaults={
                    "institution_id": inst,
                    "name": name,
                    "code": code,
                    "description": desc,
                    "head_of_department": hod,
                    "faculty_count": fac,
                    "student_count": stu,
                    "labs_count": labs,
                }
            )

        # 5. Programmes
        progs_data = [
            ("prog-btech-cse", "college", "dept-cse", "B.Tech in Computer Science & Engineering", "UG", 4, 120, "10+2 with PCM and JEE Main / OJEE Rank"),
            ("prog-msc-ds", "college", "dept-cse", "M.Sc in Data Science & Artificial Intelligence", "PG", 2, 40, "B.Sc/B.Tech with Mathematics / Computing"),
            ("prog-bsc-phy", "college", "dept-physics", "B.Sc (Honours) in Physics", "UG", 3, 64, "10+2 with Physics and Mathematics"),
            ("prog-msc-phy", "college", "dept-physics", "M.Sc in Physics (Specialization in Condensed Matter)", "PG", 2, 32, "B.Sc Physics Honours with 55%"),
            ("prog-bcom-hons", "college", "dept-commerce", "B.Com (Honours) in Accounting & Finance", "UG", 3, 180, "10+2 Commerce or equivalent"),
            ("prog-phd-cse", "college", "dept-cse", "Doctor of Philosophy (Ph.D.) in Computer Science", "Doctoral", 3, 10, "Master's degree with UGC-NET / GATE"),
        ]
        for pid, inst, did, title, level, dur, seats, elig in progs_data:
            Programme.objects.update_or_create(
                id=pid,
                defaults={
                    "institution_id": inst,
                    "department_id": did,
                    "title": title,
                    "level": level,
                    "duration_years": dur,
                    "seats": seats,
                    "eligibility": elig,
                }
            )

        # 6. School Classes
        for grade in ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"]:
            ClassSection.objects.update_or_create(
                id=f"cls-{grade.lower()}-a",
                defaults={
                    "institution_id": "school",
                    "name": f"Class {grade} - Section A",
                    "grade": grade,
                    "section": "A",
                    "academic_year": "2026-2027",
                    "capacity": 40,
                }
            )

        # 7. Notices
        notices_data = [
            ("not-col-1", "college", "SAMS e-Admission Merit List & Document Verification Schedule 2026-27", "Admission", "2026-11-15", True, True, "All selected candidates are instructed to report with original certificates."),
            ("not-col-2", "college", "Mid-Semester Examination Form Fill-up Notice for UG/PG Odd Semester 2026", "Examination", "2026-11-12", True, False, "Portal is open for examination registration through SBI Collect payment."),
            ("not-col-3", "college", "Call for Extramural Research Proposals under Central Instrumentation Facility", "Academic", "2026-11-10", False, False, "Faculty members are invited to submit interdisciplinary research proposals."),
            ("not-col-4", "college", "Expression of Interest: Campus Wi-Fi & Fibre Optic Network Modernization", "Tender", "2026-11-05", False, False, "Bids are invited via GeM portal from OEM authorized network integrators."),
            ("not-col-5", "college", "Walk-in Interview for Guest Faculty in Computer Science, Physics & Commerce", "Recruitment", "2026-11-02", False, False, "Eligible candidates with UGC-NET qualification are requested to attend."),
            ("not-sch-1", "school", "Annual Sports Meet & Inter-House Athletic Championship Schedule", "Sports", "2026-11-14", True, True, "Registration for track and field events is open through respective house captains."),
            ("not-sch-2", "school", "Parent-Teacher Meeting (PTM) for Term-1 Progress Reports", "General", "2026-11-08", True, False, "Parents are invited to review student attendance, periodic tests, and ATL projects."),
        ]
        for nid, inst, title, cat, dt, pin, imp, desc in notices_data:
            Notice.objects.update_or_create(
                id=nid,
                defaults={
                    "institution_id": inst,
                    "title": title,
                    "category": cat,
                    "date": dt,
                    "pinned": pin,
                    "important": imp,
                    "description": desc,
                }
            )

        # 8. Students
        students_data = [
            ("stu-col-1", "college", "22CSE042", "Smruti Prajna", "student@ourcollege.edu.in", "+91 94371 88291", "B.Tech in Computer Science & Engineering", "A", "Rabindra Prajna", "+91 94371 88290", 2022),
            ("stu-col-2", "college", "23PHY018", "Debasis Mohapatra", "debasis@ourcollege.edu.in", "+91 98612 34567", "B.Sc (Honours) in Physics", "A", "Prasanta Mohapatra", "+91 98612 34560", 2023),
            ("stu-sch-1", "school", "SCH26-1014", "Ayush Pattnaik", "ayush@ourschool.edu.in", "+91 98765 43211", "Class X", "A", "Bhabani Pattnaik", "+91 98765 43210", 2020),
        ]
        for sid, inst, roll, name, em, ph, prog, sec, gname, gph, ayear in students_data:
            Student.objects.update_or_create(
                id=sid,
                defaults={
                    "institution_id": inst,
                    "roll_number": roll,
                    "full_name": name,
                    "email": em,
                    "phone": ph,
                    "class_or_programme": prog,
                    "section": sec,
                    "guardian_name": gname,
                    "guardian_phone": gph,
                    "admission_year": ayear,
                }
            )

        # 9. Examinations
        Examination.objects.update_or_create(
            id="exam-odd-2026",
            defaults={
                "institution_id": "college",
                "title": "Autonomous Degree Odd Semester Examination 2026",
                "academic_year": "2025-2026",
                "semester_or_term": "Odd Semester (1st, 3rd, 5th, 7th)",
                "start_date": "2026-12-01",
                "end_date": "2026-12-22",
                "is_published": True,
            }
        )

        # 10. Library Books
        books_data = [
            ("lib-cs-1", "college", "Introduction to Algorithms (CLRS 4th Edition)", "Thomas H. Cormen, Charles E. Leiserson", "978-0262046305", "Computer Science", 12, 9, "Stack CS-1"),
            ("lib-cs-2", "college", "Operating System Concepts (Silberschatz)", "Abraham Silberschatz, Peter B. Galvin", "978-1119800361", "Computer Science", 10, 6, "Stack CS-2"),
            ("lib-phy-1", "college", "Introduction to Quantum Mechanics", "David J. Griffiths, Darrell F. Schroeter", "978-1107189638", "Physics", 8, 4, "Stack PHY-1"),
            ("lib-chem-1", "college", "Organic Chemistry (Clayden)", "Jonathan Clayden, Nick Greeves, Stuart Warren", "978-0199270293", "Chemistry", 6, 5, "Stack CHEM-1"),
        ]
        for bid, inst, title, author, isbn, cat, total, avail, shelf in books_data:
            Book.objects.update_or_create(
                id=bid,
                defaults={
                    "institution_id": inst,
                    "title": title,
                    "author": author,
                    "isbn": isbn,
                    "category": cat,
                    "total_copies": total,
                    "available_copies": avail,
                    "shelf_location": shelf,
                }
            )

        # 11. NAAC Criteria & Metrics
        naac_data = [
            (1, "Curricular Aspects", 100, 3.65, "CBCS curriculum, NEP 2020 LOCF adoption, 42 value-added courses."),
            (2, "Teaching-Learning and Evaluation", 350, 3.52, "Student-full time teacher ratio 18:1, ICT enabled smart pedagogy, continuous internal evaluation."),
            (3, "Research, Innovations and Extension", 110, 3.38, "Central Instrumentation Facility, ₹142.5 Lakhs extramural grants, 68 Scopus indexed papers."),
            (4, "Infrastructure and Learning Resources", 100, 3.48, "Parija Central Library with Koha ILMS, EBSCO e-resources, high-speed 1 Gbps campus LAN."),
            (5, "Student Support and Progression", 140, 3.30, "Active placement cell (84% placements), NCC/NSS units, competitive exam guidance."),
            (6, "Governance, Leadership and Management", 100, 3.35, "Decentralized democratic governance, IQAC active monitoring, transparent e-governance."),
            (7, "Institutional Values and Best Practices", 100, 3.50, "Green campus, solar energy installation, gender equity promotion, preservation of Odisha heritage."),
        ]
        for cnum, title, weight, score, summ in naac_data:
            NaacCriterion.objects.update_or_create(
                criterion_number=cnum,
                defaults={
                    "title": title,
                    "weightage": weight,
                    "score": score,
                    "summary": summ,
                }
            )

        # Metric Evidences
        evidences = [
            ("1.1.1", 1, "Curriculum Planning and LOCF Implementation Dossier", "Official curriculum blueprints mapping Programme Outcomes to Course Outcomes."),
            ("2.3.2", 2, "ICT Pedagogy and Smart Classroom Usage Register", "LMS logs, recorded video lectures, and smart board interactive logs."),
            ("3.3.1", 3, "Extramural Research Grants & Scopus Indexed Publication Log", "Grant sanction orders from DST, CSIR, and published research articles."),
            ("4.2.1", 4, "Library Automation (Koha ILMS) & Remote e-Resource Access", "Integrated Library Management System operational report and subscriptions."),
        ]
        for mid, cnum, title, desc in evidences:
            NaacMetricEvidence.objects.update_or_create(
                metric_id=mid,
                defaults={
                    "criterion_number": cnum,
                    "title": title,
                    "description": desc,
                    "status": "Verified",
                }
            )

        # 12. CMS Pages
        Page.objects.update_or_create(
            slug="about",
            defaults={
                "institution_id": "college",
                "title": "About Our College",
                "subtitle": "Sculpting Heart, Head & Hand · Established 2026",
                "content": "Premier autonomous degree college of Odisha, NAAC Accredited A+ (CGPA 3.42), recognized under UGC Category-1.",
            }
        )

        self.stdout.write(self.style.SUCCESS("Database successfully seeded with all initial data!"))
