import type { RoleKey } from "@/types";

/**
 * Where each demo persona lands after login / when visiting a bare
 * `/portal` or `/admin` index. Centralized here so LoginPage and
 * PortalIndexRedirect can't drift out of sync with each other.
 */
export function landingPathFor(role: RoleKey): string {
  switch (role) {
    case "platform_admin":
    case "institution_admin":
    case "principal":
    case "admission_officer":
    case "accountant":
      return "/admin";
    case "librarian":
      return "/portal/librarian";
    case "student":
      return "/portal/student";
    case "teacher":
    case "faculty":
      return "/portal/teacher";
    case "parent":
      return "/portal/parent";
    case "exam_cell":
      return "/portal/examcell";
    case "hod":
      return "/portal/hod";
    default:
      return "/portal";
  }
}
