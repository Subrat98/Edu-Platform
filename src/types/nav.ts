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
  footerAcademicLinks?: NavItem[];
  footerSupportLinks?: NavItem[];
  footerPolicyLinks: NavItem[];
}
