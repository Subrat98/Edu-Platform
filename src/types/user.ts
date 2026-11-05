import type { InstitutionType } from "./institution";

export type RoleKey =
  | "platform_admin"
  | "institution_admin"
  | "principal"
  | "admission_officer"
  | "teacher"
  | "accountant"
  | "librarian"
  | "faculty"
  | "student"
  | "parent"
  | "exam_cell"
  | "hod";

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: RoleKey;
  institutionId: InstitutionType;
  avatarUrl: string;
  title: string;
  /** Links a teacher/faculty persona to their StaffMember record for "my classes" scoping. */
  staffId?: string;
  /** Links a student persona to their ERP Student record for self-service portal data. */
  studentId?: string;
  /** Links a parent/guardian persona to their ERP Guardian record (which may list multiple children). */
  guardianId?: string;
  /** Mock account-status flag toggled from the admin User & Role Management screen. */
  active?: boolean;
  /**
   * Set only for personas belonging to a "Both mode" institution (see
   * src/types/unified.ts). `institutionId` above still carries their
   * *current wing* ("school" or "college") so every existing
   * institution-scoped query/component keeps working unchanged; this
   * field marks which UnifiedInstitution.id they belong to, for the
   * shared brand header and the wing switcher.
   */
  homeInstitutionId?: string;
}

export const ROLE_LABELS: Record<RoleKey, string> = {
  platform_admin: "Platform Super Admin",
  institution_admin: "Institution Admin",
  principal: "Principal",
  admission_officer: "Admission Officer",
  teacher: "Teacher",
  accountant: "Accountant",
  librarian: "Librarian",
  faculty: "Faculty",
  student: "Student",
  parent: "Parent / Guardian",
  exam_cell: "Examination Cell",
  hod: "HOD / Department Coordinator",
};
