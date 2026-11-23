from django.contrib.auth import get_user_model
from django.core.management import BaseCommand, CommandError
from getpass import getpass
from tenants.models import Tenant, TenantMembership

class Command(BaseCommand):
    help = 'Create a central Django user and grant access to one tenant.'

    def add_arguments(self, parser):
        parser.add_argument('--tenant', required=True, help='Tenant slug')
        parser.add_argument('--username', required=True)
        parser.add_argument('--email', default='')

    def handle(self, *args, **options):
        tenant = Tenant.objects.using('default').filter(slug=options['tenant'], is_active=True).first()
        if not tenant:
            raise CommandError('Active tenant not found.')
        User = get_user_model()
        username = options['username']
        if User.objects.using('default').filter(username=username).exists():
            raise CommandError('Username already exists. Use a different username.')
        password = getpass('Password: ')
        confirm = getpass('Confirm password: ')
        if not password or password != confirm:
            raise CommandError('Passwords are empty or do not match.')
        user = User(username=username, email=options['email'], is_staff=False)
        user.set_password(password)
        user.save(using='default')
        TenantMembership.objects.using('default').create(tenant=tenant, user=user, role='admin')
        self.stdout.write(self.style.SUCCESS(f'Granted {username} admin access to tenant {tenant.slug}.'))
