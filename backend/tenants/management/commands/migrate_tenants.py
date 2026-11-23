from django.conf import settings
from django.core.management import BaseCommand, call_command
from tenants.db_context import configure_tenant_database
from tenants.models import Tenant

class Command(BaseCommand):
    help = 'Apply CMS migrations to every active tenant database.'

    def handle(self, *args, **options):
        tenants = Tenant.objects.using('default').filter(is_active=True).order_by('slug')
        for tenant in tenants:
            alias = f'tenant_{tenant.pk}'
            configure_tenant_database(alias, tenant.database_name)
            self.stdout.write(f'Applying migrations: {tenant.slug} ({tenant.database_name})')
            call_command('migrate', database=alias, interactive=False, verbosity=options['verbosity'])
        self.stdout.write(self.style.SUCCESS('All active tenant databases are up to date.'))
