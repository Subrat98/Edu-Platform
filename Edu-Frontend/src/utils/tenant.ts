export function getActiveTenantSlug(): string {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const qTenant = params.get('tenant')?.trim().toLowerCase();
    if (qTenant) {
      sessionStorage.setItem('preview_tenant_slug', qTenant);
      return qTenant;
    }
    const preview = sessionStorage.getItem('preview_tenant_slug');
    if (preview) return preview;
    const saved = localStorage.getItem('college_tenant_slug');
    if (saved) return saved;
  }
  return 'our-college';
}
