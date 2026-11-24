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
    help = 'Transfer / copy CMS data (content pages, menu bar sections, etc.) from one college tenant to another.'

    def add_arguments(self, parser):
        parser.add_argument('--from', dest='from_slug', required=True, help='Source tenant slug (e.g. our-college)')
        parser.add_argument('--to', dest='to_slug', required=True, help='Target tenant slug (e.g. new-college)')
        parser.add_argument('--resource', choices=list(CMS_MODELS.keys()) + ['all'], default='all', help='Resource to copy (default: all)')
        parser.add_argument('--overwrite', action='store_true', help='Overwrite existing items if same slug/title exists')

    def handle(self, *args, **options):
        from_slug = options['from_slug'].strip().lower()
        to_slug = options['to_slug'].strip().lower()
        res_choice = options['resource']
        overwrite = options['overwrite']

        source = Tenant.objects.using('default').filter(slug=from_slug).first()
        target = Tenant.objects.using('default').filter(slug=to_slug).first()

        if not source:
            raise CommandError(f'Source tenant "{from_slug}" does not exist.')
        if not target:
            raise CommandError(f'Target tenant "{to_slug}" does not exist.')

        source_alias = f'tenant_{source.pk}'
        target_alias = f'tenant_{target.pk}'

        configure_tenant_database(source_alias, source.database_name)
        configure_tenant_database(target_alias, target.database_name)

        models_to_copy = [CMS_MODELS[res_choice]] if res_choice != 'all' else list(CMS_MODELS.values())

        for model in models_to_copy:
            model_name = model._meta.verbose_name_plural.title()
            source_qs = model.objects.using(source_alias).all()
            count = source_qs.count()
            if count == 0:
                self.stdout.write(f'No {model_name} found in source tenant ({from_slug}). Skipping.')
                continue

            copied = 0
            updated = 0
            for item in source_qs:
                fields = {
                    field.name: getattr(item, field.name)
                    for field in model._meta.fields
                    if field.name not in ['id', 'created_at', 'updated_at']
                }

                # Match by slug if present, else title/name
                lookup = {}
                if 'slug' in fields and fields['slug']:
                    lookup = {'slug': fields['slug']}
                elif 'title' in fields:
                    lookup = {'title': fields['title']}
                elif 'name' in fields:
                    lookup = {'name': fields['name']}

                existing = model.objects.using(target_alias).filter(**lookup).first() if lookup else None

                if existing:
                    if overwrite:
                        for k, v in fields.items():
                            setattr(existing, k, v)
                        existing.save(using=target_alias)
                        updated += 1
                else:
                    model.objects.using(target_alias).create(**fields)
                    copied += 1

            self.stdout.write(self.style.SUCCESS(
                f'Transferred {model_name}: {copied} created, {updated} updated in {to_slug}.'
            ))

        self.stdout.write(self.style.SUCCESS(
            f'Transfer complete from "{from_slug}" to "{to_slug}".'
        ))
