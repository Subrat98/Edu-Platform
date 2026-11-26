from pathlib import Path
from tenants.db_context import get_current_tenant_db

def _tenant_path(folder, filename):
    alias = get_current_tenant_db() or 'unassigned'
    safe_name = Path(filename).name
    return f'tenants/{alias}/{folder}/{safe_name}'

def notice_upload_to(instance, filename):
    return _tenant_path('notices', filename)

def banner_upload_to(instance, filename):
    return _tenant_path('banners', filename)

def gallery_upload_to(instance, filename):
    return _tenant_path('gallery', filename)

def hostel_upload_to(instance, filename):
    return _tenant_path('hostel', filename)

def hostel_rules_upload_to(instance, filename):
    return _tenant_path('hostel-rules', filename)

def hostel_notice_upload_to(instance, filename):
    return _tenant_path('hostel-notices', filename)

def document_upload_to(instance, filename):
    return _tenant_path('documents', filename)
