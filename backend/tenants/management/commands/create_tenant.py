import re
import psycopg
from psycopg import sql
from django.conf import settings
from django.core.management import BaseCommand, CommandError, call_command
from tenants.db_context import configure_tenant_database
from tenants.models import Tenant

class Command(BaseCommand):
    help = 'Create an isolated PostgreSQL database and register a tenant.'

    def add_arguments(self, parser):
        parser.add_argument('--name', required=True)
        parser.add_argument('--slug', required=True)
        parser.add_argument('--domain', default='')
        parser.add_argument('--skip-migrate', action='store_true')

    def handle(self, *args, **options):
        name, slug = options['name'].strip(), options['slug'].strip().lower()
        if not re.fullmatch(r'[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?', slug):
            raise CommandError('Slug must contain lowercase letters, numbers and internal hyphens only.')
        if not all([settings.TENANT_DB_USER, settings.TENANT_DB_PASSWORD]):
            raise CommandError('Set TENANT_DB_USER and TENANT_DB_PASSWORD before provisioning tenant databases.')
        if Tenant.objects.using('default').filter(slug=slug).exists():
            raise CommandError(f'Tenant slug "{slug}" already exists. To apply migrations to existing tenants, run: python manage.py migrate_tenants (or python manage.py seed_tenant --slug {slug})')
        db_name = f'college_{slug.replace("-", "_")}'[:63]
        if Tenant.objects.using('default').filter(database_name=db_name).exists():
            raise CommandError(f'Database name "{db_name}" is already registered.')
        try:
            with psycopg.connect(host=settings.TENANT_DB_HOST, port=settings.TENANT_DB_PORT,
                                 user=settings.TENANT_DB_USER, password=settings.TENANT_DB_PASSWORD,
                                 dbname='postgres', autocommit=True) as conn:
                with conn.cursor() as cur:
                    cur.execute('SELECT 1 FROM pg_database WHERE datname = %s', (db_name,))
                    if cur.fetchone():
                        raise CommandError(f'Database "{db_name}" already exists. Check it before reusing this name.')
                    cur.execute('CREATE DATABASE ' + sql.Identifier(db_name).as_string(conn))
        except psycopg.Error as exc:
            raise CommandError(f'Could not create PostgreSQL database: {exc}') from exc

        tenant = Tenant.objects.using('default').create(
            name=name, slug=slug, database_name=db_name, domain=options['domain'] or None
        )
        alias = f'tenant_{tenant.pk}'
        configure_tenant_database(alias, db_name)
        self.stdout.write(self.style.SUCCESS(f'Registered tenant {name} ({slug}) with database {db_name}.'))
        if not options['skip_migrate']:
            call_command('migrate', database=alias, interactive=False, verbosity=options['verbosity'])
            self.stdout.write(self.style.SUCCESS(f'Migrations completed for {slug}.'))
