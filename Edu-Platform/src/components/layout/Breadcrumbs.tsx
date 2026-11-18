export interface BreadcrumbTrailItem {
  label: string;
  href?: string;
}

export function Breadcrumbs(_props?: { items?: BreadcrumbTrailItem[] }) {
  // Breadcrumb navigation removed from all pages per user request
  return null;
}
