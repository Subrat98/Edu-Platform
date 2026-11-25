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
                    {'title': 'More', 'slug': 'more', 'link': '/more', 'sort_order': 14},
                ]
                for s in sections_data:
                    MenuSection.objects.using(alias).create(**s)
                self.stdout.write(self.style.SUCCESS('Seeded 14 menu bar sections.'))

            # Seed sample pages if empty
            if not Page.objects.using(alias).exists():
                pages_data = [
                    {'title': 'About Our College', 'slug': 'overview', 'section': 'about', 'content': 'Welcome to Our College. Dedicated to excellence in higher education and research.'},
                    {'title': 'Vision and Mission', 'slug': 'vision-mission', 'section': 'about', 'content': 'Our vision is to provide quality higher education fostering research and innovation.'},
                ]
                for p in pages_data:
                    Page.objects.using(alias).create(**p)
                self.stdout.write(self.style.SUCCESS('Seeded initial content pages.'))

            self.stdout.write(self.style.SUCCESS(f'Successfully initialized and ready: {slug} ({tenant.database_name})'))
        finally:
            reset_current_tenant_db(token)
