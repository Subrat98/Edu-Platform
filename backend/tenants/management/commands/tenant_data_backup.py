import json
from django.core.management import BaseCommand, CommandError
from tenants.models import Tenant
from tenants.db_context import configure_tenant_database
from cms.models import Page, MenuSection, Department, Notice, Banner, GalleryImage

CMS_MODELS = {
    'pages': Page,
    'menu-sections': MenuSection,
    'departments': Department,
    'notices': Notice,
    'banners': Banner,
    'gallery': GalleryImage,
}

class Command(BaseCommand):
    help = 'Export or import CMS data (pages, menu sections, etc.) to/from a JSON file.'

    def add_arguments(self, parser):
        subparsers = parser.add_subparsers(dest='action', required=True)

        # export subparser
        exp = subparsers.add_parser('export', help='Export tenant data to JSON file')
        exp.add_argument('--slug', required=True, help='Tenant slug to export from')
        exp.add_argument('--output', required=True, help='Output JSON file path')
        exp.add_argument('--resource', choices=list(CMS_MODELS.keys()) + ['all'], default='all')

        # import subparser
        imp = subparsers.add_parser('import', help='Import tenant data from JSON file')
        imp.add_argument('--slug', required=True, help='Tenant slug to import into')
        imp.add_argument('--file', required=True, help='Input JSON file path')
        imp.add_argument('--overwrite', action='store_true', help='Overwrite existing items')

    def handle(self, *args, **options):
        action = options['action']
        slug = options['slug'].strip().lower()

        tenant = Tenant.objects.using('default').filter(slug=slug).first()
        if not tenant:
            raise CommandError(f'Tenant "{slug}" not found in database.')

        alias = f'tenant_{tenant.pk}'
        configure_tenant_database(alias, tenant.database_name)

        if action == 'export':
            res_choice = options['resource']
            output_path = options['output']
            models_to_export = [CMS_MODELS[res_choice]] if res_choice != 'all' else list(CMS_MODELS.values())
            data = {}

            for model in models_to_export:
                key = model._meta.model_name
                items = []
                for item in model.objects.using(alias).all():
                    record = {
                        field.name: getattr(item, field.name)
                        for field in model._meta.fields
                        if field.name not in ['id', 'created_at', 'updated_at']
                    }
                    items.append(record)
                data[key] = items

            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, default=str)

            self.stdout.write(self.style.SUCCESS(f'Successfully exported data for "{slug}" to {output_path}'))

        elif action == 'import':
            file_path = options['file']
            overwrite = options['overwrite']
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            for key, items in data.items():
                matched_model = None
                for m in CMS_MODELS.values():
                    if m._meta.model_name == key:
                        matched_model = m
                        break
                if not matched_model:
                    continue

                created_cnt = 0
                updated_cnt = 0
                for record in items:
                    lookup = {}
                    if 'slug' in record and record['slug']:
                        lookup = {'slug': record['slug']}
                    elif 'title' in record:
                        lookup = {'title': record['title']}
                    elif 'name' in record:
                        lookup = {'name': record['name']}

                    existing = matched_model.objects.using(alias).filter(**lookup).first() if lookup else None
                    if existing:
                        if overwrite:
                            for k, v in record.items():
                                setattr(existing, k, v)
                            existing.save(using=alias)
                            updated_cnt += 1
                    else:
                        matched_model.objects.using(alias).create(**record)
                        created_cnt += 1

                self.stdout.write(self.style.SUCCESS(
                    f'Imported {matched_model._meta.verbose_name_plural.title()}: {created_cnt} created, {updated_cnt} updated in "{slug}".'
                ))
