from pathlib import Path
from django.core.management import BaseCommand, CommandError, call_command
from tenants.models import Tenant
from tenants.db_context import configure_tenant_database, set_current_tenant_db, reset_current_tenant_db
from cms.models import Notice, Department, Page, MenuSection

class Command(BaseCommand):
    help = 'Migrate and seed initial data (notices, departments, pages, menu sections) for a tenant database.'

    def add_arguments(self, parser):
        parser.add_argument('--slug', required=True, help='Tenant slug')
        parser.add_argument('--fixture', help='Path to JSON fixture file')
        parser.add_argument('--overwrite', action='store_true', help='Overwrite existing items')

    def handle(self, *args, **options):
        slug = options['slug'].strip().lower()
        tenant = Tenant.objects.using('default').filter(slug=slug, is_active=True).first()
        if not tenant:
            raise CommandError(f'Tenant with slug "{slug}" not found in central registry.')

        alias = f'tenant_{tenant.pk}'
        configure_tenant_database(alias, tenant.database_name)
        self.stdout.write(f'Ensuring migrations are applied to {tenant.database_name}...')
        call_command('migrate', database=alias, interactive=False, verbosity=1)

        fixture_path = options.get('fixture')
        if not fixture_path:
            default_fix = Path(__file__).resolve().parent.parent.parent.parent / 'fixtures' / 'initial_college_data.json'
            if default_fix.exists():
                fixture_path = str(default_fix)

        if fixture_path and Path(fixture_path).exists():
            self.stdout.write(f'Loading data from fixture: {fixture_path}')
            call_command('tenant_data_backup', 'import', slug=slug, file=fixture_path, overwrite=options.get('overwrite', False))
            self.stdout.write(self.style.SUCCESS(f'Successfully initialized and ready: {slug} ({tenant.database_name})'))
            return

        token = set_current_tenant_db(alias)
        try:
            # Seed departments if empty
            if not Department.objects.using(alias).exists():
                depts = [
                    {'name': 'Physics', 'slug': 'physics', 'faculty': 'Faculty of Science', 'programmes': ['B.Sc.', 'M.Sc.', 'Ph.D.']},
                    {'name': 'Chemistry', 'slug': 'chemistry', 'faculty': 'Faculty of Science', 'programmes': ['B.Sc.', 'M.Sc.', 'Ph.D.']},
                    {'name': 'Mathematics', 'slug': 'mathematics', 'faculty': 'Faculty of Science', 'programmes': ['B.Sc.', 'M.Sc.', 'Ph.D.']},
                    {'name': 'English', 'slug': 'english', 'faculty': 'Faculty of Arts', 'programmes': ['B.A.', 'M.A.', 'Ph.D.']},
                    {'name': 'History', 'slug': 'history', 'faculty': 'Faculty of Arts', 'programmes': ['B.A.', 'M.A.']},
                    {'name': 'Commerce', 'slug': 'commerce', 'faculty': 'Faculty of Commerce', 'programmes': ['B.Com.', 'M.Com.']},
                ]
                for d in depts:
                    Department.objects.using(alias).create(**d)
                self.stdout.write(self.style.SUCCESS('Seeded 6 departments.'))

            # Seed notices if empty
            if not Notice.objects.using(alias).exists():
                notices_data = [
                    {'title': 'Online Examination Form Fill-up — Semester Examination', 'category': 'examination'},
                    {'title': 'Admission open for undergraduate programmes 2026–27', 'category': 'admission'},
                    {'title': 'Academic Calendar for the session 2026–27 released', 'category': 'general'},
                    {'title': 'Walk-in interview for guest faculty positions', 'category': 'recruitment'},
                    {'title': 'Inter-college cultural festival — registration notice', 'category': 'event'},
                    {'title': 'Tender notice for campus laboratory equipment', 'category': 'tender'},
                    {'title': 'UG second semester results published', 'category': 'result'},
                ]
                for n in notices_data:
                    Notice.objects.using(alias).create(**n)
                self.stdout.write(self.style.SUCCESS('Seeded 7 notices.'))

            # Seed menu sections if empty
            if not MenuSection.objects.using(alias).exists():
                sections_data = [
                    {'title': 'Home', 'slug': 'home', 'link': '/', 'sort_order': 1},
                    {'title': 'About Us', 'slug': 'about', 'link': '/about/overview', 'sort_order': 2},
                    {'title': 'Administration', 'slug': 'administration', 'link': '/administration/overview', 'sort_order': 3},
                    {'title': 'Academics', 'slug': 'academics', 'link': '/academics/overview', 'sort_order': 4},
                    {'title': 'Admission', 'slug': 'admission', 'link': '/admission/ug', 'sort_order': 5},
                    {'title': 'Examination', 'slug': 'examination', 'link': '/examination', 'sort_order': 6},
                    {'title': 'NAAC', 'slug': 'naac', 'link': '/naac', 'sort_order': 7},
                    {'title': 'IQAC', 'slug': 'iqac', 'link': '/iqac', 'sort_order': 8},
                    {'title': 'R&D', 'slug': 'research', 'link': '/research', 'sort_order': 9},
                    {'title': 'Extn. Activities', 'slug': 'extension-activities', 'link': '/extension-activities', 'sort_order': 10},
                    {'title': 'Library', 'slug': 'library', 'link': '/library', 'sort_order': 11},
                    {'title': 'Alumni Cell', 'slug': 'alumni', 'link': '/alumni', 'sort_order': 12},
                    {'title': 'Cells and Centers', 'slug': 'cells-centers', 'link': '/cells-centers', 'sort_order': 13},
                    {'title': 'NIRF', 'slug': 'nirf', 'link': '/more/nirf', 'sort_order': 14},
                    {'title': 'OPAC', 'slug': 'opac', 'link': '/more/opac', 'sort_order': 15},
                    {'title': 'RTI', 'slug': 'rti', 'link': '/more/rti', 'sort_order': 16},
                    {'title': 'Recruitment', 'slug': 'recruitment', 'link': '/more/recruitment', 'sort_order': 17},
                    {'title': 'Endowments', 'slug': 'endowments', 'link': '/more/endowments', 'sort_order': 18},
                    {'title': 'Facilities', 'slug': 'facilities', 'link': '/more/facilities', 'sort_order': 19},
                    {'title': 'Centralized Facilities', 'slug': 'centralized-facilities', 'link': '/more/centralized-facilities', 'sort_order': 20},
                    {'title': 'International', 'slug': 'international', 'link': '/more/international', 'sort_order': 21},
                    {'title': 'Sports Council', 'slug': 'sports', 'link': '/more/sports', 'sort_order': 22},
                    {'title': 'RUSA', 'slug': 'rusa', 'link': '/more/rusa', 'sort_order': 23},
                    {'title': 'OTG Monitoring', 'slug': 'otg-monitoring', 'link': '/more/otg-monitoring', 'sort_order': 24},
                    {'title': 'NAD', 'slug': 'nad', 'link': '/more/nad', 'sort_order': 25},
                    {'title': 'ABC', 'slug': 'abc', 'link': '/more/abc', 'sort_order': 26},
                    {'title': 'Samarth Portal', 'slug': 'samarth-portal', 'link': '/more/samarth-portal', 'sort_order': 27},
                    {'title': 'E-Office', 'slug': 'e-office', 'link': '/more/e-office', 'sort_order': 28},
                    {'title': 'Notices', 'slug': 'notices', 'link': '/notices', 'sort_order': 29},
                ]
                for s in sections_data:
                    MenuSection.objects.using(alias).create(**s)
                self.stdout.write(self.style.SUCCESS(f'Seeded {len(sections_data)} menu bar sections.'))

            # Seed sample pages if empty
            if not Page.objects.using(alias).exists():
                pages_data = [
                    {'title': 'About Our College', 'slug': 'overview', 'section': 'about', 'show_in_dropdown': True, 'content': 'Welcome to Our College. Dedicated to excellence in higher education and research.'},
                    {'title': 'Vision and Mission', 'slug': 'vision-mission', 'section': 'about', 'show_in_dropdown': True, 'content': 'Our vision is to provide quality higher education fostering research and innovation.'},
                    {'title': 'Administration Overview', 'slug': 'administration-overview', 'section': 'administration', 'show_in_dropdown': False, 'content': 'Leadership, governance, statutory bodies, and administrative offices of Our College.'},
                    {'title': 'Academics Overview', 'slug': 'academics-overview', 'section': 'academics', 'show_in_dropdown': False, 'content': 'Explore academic programmes, faculties, departments, syllabus, and academic calendar.'},
                    {'title': 'Admissions Overview', 'slug': 'admission-overview', 'section': 'admission', 'show_in_dropdown': False, 'content': 'Undergraduate, Postgraduate, and Ph.D. admission guidelines, eligibility, and schedules.'},
                    {'title': 'Examination Cell', 'slug': 'examination-overview', 'section': 'examination', 'show_in_dropdown': False, 'content': 'Examination schedules, notifications, rules, results, and student portal.'},
                    {'title': 'NAAC Accreditation', 'slug': 'naac', 'section': 'naac', 'show_in_dropdown': False, 'content': 'NAAC accreditation status, SSR reports, and institutional quality benchmarks.'},
                    {'title': 'Internal Quality Assurance Cell (IQAC)', 'slug': 'iqac', 'section': 'iqac', 'show_in_dropdown': False, 'content': 'IQAC composition, AQAR reports, quality initiatives, and meeting minutes.'},
                    {'title': 'Research & Development (R&D)', 'slug': 'research', 'section': 'research', 'show_in_dropdown': False, 'content': 'Research projects, publications, grants, and innovation cell activities.'},
                    {'title': 'Extension Activities', 'slug': 'extension-activities', 'section': 'extension-activities', 'show_in_dropdown': False, 'content': 'NCC, NSS, Youth Red Cross (YRC), and community outreach programmes.'},
                    {'title': 'Central Library', 'slug': 'library', 'section': 'library', 'show_in_dropdown': False, 'content': 'Central library resources, e-journals, digital repository, and reading rooms.'},
                    {'title': 'Alumni Cell', 'slug': 'alumni', 'section': 'alumni', 'show_in_dropdown': False, 'content': 'Alumni association, notable graduates, events, and registration.'},
                    {'title': 'Cells and Centers', 'slug': 'cells-centers', 'section': 'cells-centers', 'show_in_dropdown': False, 'content': 'Specialized academic, career guidance, grievance redressal, and welfare cells.'},
                    {'title': 'NIRF Ranking & Data', 'slug': 'nirf', 'section': 'nirf', 'show_in_dropdown': False, 'content': 'National Institutional Ranking Framework (NIRF) submissions and reports.'},
                    {'title': 'OPAC Library Catalogue', 'slug': 'opac', 'section': 'opac', 'show_in_dropdown': False, 'content': 'Online Public Access Catalogue for searching library books and journals.'},
                    {'title': 'Right to Information (RTI)', 'slug': 'rti', 'section': 'rti', 'show_in_dropdown': False, 'content': 'Statutory RTI disclosures, Public Information Officers, and guidelines.'},
                    {'title': 'Recruitment & Careers', 'slug': 'recruitment', 'section': 'recruitment', 'show_in_dropdown': False, 'content': 'Faculty and non-teaching staff recruitment notifications and application forms.'},
                    {'title': 'Endowments & Scholarships', 'slug': 'endowments', 'section': 'endowments', 'show_in_dropdown': False, 'content': 'Student scholarships, endowments, prizes, and financial assistance.'},
                    {'title': 'Campus Facilities', 'slug': 'facilities', 'section': 'facilities', 'show_in_dropdown': False, 'content': 'Classrooms, laboratories, auditorium, hostels, and campus amenities.'},
                    {'title': 'Centralized Facilities', 'slug': 'centralized-facilities', 'section': 'centralized-facilities', 'show_in_dropdown': False, 'content': 'Central instrumentation, computer center, and shared research facilities.'},
                    {'title': 'International Relations', 'slug': 'international', 'section': 'international', 'show_in_dropdown': False, 'content': 'International collaborations, MoUs, and exchange programmes.'},
                    {'title': 'Sports Council', 'slug': 'sports', 'section': 'sports', 'show_in_dropdown': False, 'content': 'Sports facilities, athletic events, tournaments, and achievements.'},
                    {'title': 'RUSA Projects & Grants', 'slug': 'rusa', 'section': 'rusa', 'show_in_dropdown': False, 'content': 'Rashtriya Uchchatar Shiksha Abhiyan (RUSA) infrastructure and academic grants.'},
                    {'title': 'OTG Monitoring', 'slug': 'otg-monitoring', 'section': 'otg-monitoring', 'show_in_dropdown': False, 'content': 'On-the-ground monitoring reports and compliance dashboards.'},
                    {'title': 'National Academic Depository (NAD)', 'slug': 'nad', 'section': 'nad', 'show_in_dropdown': False, 'content': 'Digital academic awards and certificate verification via NAD.'},
                    {'title': 'Academic Bank of Credits (ABC)', 'slug': 'abc', 'section': 'abc', 'show_in_dropdown': False, 'content': 'ABC registration, credit transfer, and NEP 2020 compliance details.'},
                    {'title': 'Samarth Portal', 'slug': 'samarth-portal', 'section': 'samarth-portal', 'show_in_dropdown': False, 'content': 'e-Governance suite for student, faculty, and administrative services.'},
                    {'title': 'e-Office Portal', 'slug': 'e-office', 'section': 'e-office', 'show_in_dropdown': False, 'content': 'Digital file movement and paperless office portal for staff.'},
                ]
                for p in pages_data:
                    Page.objects.using(alias).create(**p)
                self.stdout.write(self.style.SUCCESS(f'Seeded {len(pages_data)} initial content pages.'))

            self.stdout.write(self.style.SUCCESS(f'Successfully initialized and ready: {slug} ({tenant.database_name})'))
        finally:
            reset_current_tenant_db(token)
