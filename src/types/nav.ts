import type { InstitutionType } from "./institution";

export interface NavItem {
  label: string;
  path: string;
  children?: NavItem[];
}

export interface NavMenu {
  institutionId: InstitutionType;
  items: NavItem[];
  footerQuickLinks: NavItem[];
  footerPolicyLinks: NavItem[];
}
