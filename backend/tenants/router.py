from .db_context import get_current_tenant_db

class TenantDatabaseRouter:
    """Route college CMS data to the selected tenant DB; keep identity/control data central."""
    tenant_apps = {'cms'}

    def db_for_read(self, model, **hints):
        if model._meta.app_label in self.tenant_apps:
            return get_current_tenant_db() or 'default'
        return 'default'

    def db_for_write(self, model, **hints):
        if model._meta.app_label in self.tenant_apps:
            return get_current_tenant_db() or 'default'
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        if obj1._meta.app_label in self.tenant_apps or obj2._meta.app_label in self.tenant_apps:
            return obj1._state.db == obj2._state.db
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label in self.tenant_apps:
            return True
        if db != 'default':
            return False
        return None
