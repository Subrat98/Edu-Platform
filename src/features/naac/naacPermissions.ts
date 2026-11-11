import { useState, useEffect, useMemo } from "react";
import { useAuthStore } from "@/features/auth/authStore";
import type { RoleKey } from "@/types";

export type NaacRole = "principal" | "iqac_coordinator" | "hod" | "faculty";

export type NaacPermissionAction =
  | "sign_off_ssr"
  | "sign_off_aqar"
  | "cycle_lock_unlock"
  | "manage_criteria_all"
  | "review_evidence"
  | "assign_tasks"
  | "manage_dept_data"
  | "upload_evidence"
  | "manage_publications"
  | "view_audit_trail"
  | "export_official_reports"
  | "manage_committee_roster";

export interface RolePermissionMatrixItem {
  key: NaacPermissionAction;
  category: "Executive Governance" | "Quality Oversight" | "Department Operations" | "Evidence Vault" | "Compliance & Audit";
  name: string;
  description: string;
  allowedRoles: Record<NaacRole, boolean>;
}

export const NAAC_ROLES: { id: NaacRole; label: string; badge: string; scope: string; desc: string }[] = [
  {
    id: "principal",
    label: "Principal / Head of Institution",
    badge: "Executive Sign-Off",
    scope: "Institutional (All Wings)",
    desc: "Sole statutory authority for final SSR sign-off, cycle freeze, NAAC HEI portal submission, and executive audit.",
  },
  {
    id: "iqac_coordinator",
    label: "IQAC Coordinator",
    badge: "Manage & Review",
    scope: "Full Criteria 1–7",
    desc: "Oversees 7 criteria, conducts evidence QA checks, coordinates BoS/ACM inputs, manages reviews & delegates tasks.",
  },
  {
    id: "hod",
    label: "Head of Department (HOD)",
    badge: "Dept Data & Verification",
    scope: "Departmental Scope",
    desc: "Curates departmental metrics (pass rates, BoS, field visits, CIE grievance redressal, labs), verifies dept faculty files.",
  },
  {
    id: "faculty",
    label: "Faculty Member",
    badge: "Evidence Upload",
    scope: "Self & Assigned Indicators",
    desc: "Uploads research papers, course files, mentor-mentee registers, geo-tagged event photos, and FDP certificates.",
  },
];

export const DEFAULT_NAAC_PERMISSIONS_MATRIX: RolePermissionMatrixItem[] = [
  {
    key: "sign_off_ssr",
    category: "Executive Governance",
    name: "Final SSR Institutional Sign-Off",
    description: "Statutory electronic sign-off and digital seal before dispatching the Self Study Report to NAAC.",
    allowedRoles: {
      principal: true,
      iqac_coordinator: false,
      hod: false,
      faculty: false,
    },
  },
  {
    key: "sign_off_aqar",
    category: "Executive Governance",
    name: "AQAR Statutory Freeze & Dispatch",
    description: "Approve annual quality reports and freeze the academic year audit data for HEI portal uploading.",
    allowedRoles: {
      principal: true,
      iqac_coordinator: false,
      hod: false,
      faculty: false,
    },
  },
  {
    key: "cycle_lock_unlock",
    category: "Executive Governance",
    name: "Accreditation Cycle Lock / Unlock",
    description: "Activate new assessment cycles, modify institutional target CGPA, or lock historical cycles.",
    allowedRoles: {
      principal: true,
      iqac_coordinator: true,
      hod: false,
      faculty: false,
    },
  },
  {
    key: "manage_criteria_all",
    category: "Quality Oversight",
    name: "Global Criteria 1–7 Editing",
    description: "Modify weightages, recalculate institutional QnM/QlM benchmarks, and update indicator metrics.",
    allowedRoles: {
      principal: true,
      iqac_coordinator: true,
      hod: false,
      faculty: false,
    },
  },
  {
    key: "review_evidence",
    category: "Quality Oversight",
    name: "Evidence QA Review & Verification",
    description: "Audit uploaded evidence dossiers, mark as NAAC-Compliant, approve or request revisions.",
    allowedRoles: {
      principal: true,
      iqac_coordinator: true,
      hod: true,
      faculty: false,
    },
  },
  {
    key: "assign_tasks",
    category: "Quality Oversight",
    name: "Task Delegation & Deadline Assignment",
    description: "Issue indicator preparation tasks to departments with deadlines, automated reminders, and escalation.",
    allowedRoles: {
      principal: true,
      iqac_coordinator: true,
      hod: true,
      faculty: false,
    },
  },
  {
    key: "manage_dept_data",
    category: "Department Operations",
    name: "Department Data Entry & Updating",
    description: "Update student pass rates, BoS minutes, CIE records, lab equipment logs, and faculty deployment for the department.",
    allowedRoles: {
      principal: true,
      iqac_coordinator: true,
      hod: true,
      faculty: false,
    },
  },
  {
    key: "manage_committee_roster",
    category: "Department Operations",
    name: "Statutory Committee & Council Roster",
    description: "Maintain Board of Studies, Academic Council, and departmental quality committee composition.",
    allowedRoles: {
      principal: true,
      iqac_coordinator: true,
      hod: true,
      faculty: false,
    },
  },
  {
    key: "upload_evidence",
    category: "Evidence Vault",
    name: "Upload Evidence & Compliance Proofs",
    description: "Upload geo-tagged photographs, sanction letters, CA certificates, meeting minutes, and lesson plans.",
    allowedRoles: {
      principal: true,
      iqac_coordinator: true,
      hod: true,
      faculty: true,
    },
  },
  {
    key: "manage_publications",
    category: "Evidence Vault",
    name: "Faculty Research & Scopus Record Entry",
    description: "Submit peer-reviewed publications, DOI links, book chapters, conference papers, and patent citations.",
    allowedRoles: {
      principal: true,
      iqac_coordinator: true,
      hod: true,
      faculty: true,
    },
  },
  {
    key: "view_audit_trail",
    category: "Compliance & Audit",
    name: "Tamper-Evident Audit Trail Access",
    description: "Inspect SHA-256 evidence upload checksums, user modification logs, and status transitions.",
    allowedRoles: {
      principal: true,
      iqac_coordinator: true,
      hod: false,
      faculty: false,
    },
  },
  {
    key: "export_official_reports",
    category: "Compliance & Audit",
    name: "Export Institutional NAAC Dossiers",
    description: "Generate official SSR/AQAR PDF compendiums, executive metrics summaries, and peer team presentation binders.",
    allowedRoles: {
      principal: true,
      iqac_coordinator: true,
      hod: true,
      faculty: false,
    },
  },
];

const STORAGE_KEY = "eduplatform_naac_permission_matrix_v1";

export function getStoredPermissionMatrix(): RolePermissionMatrixItem[] {
  if (typeof window === "undefined") return DEFAULT_NAAC_PERMISSIONS_MATRIX;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_NAAC_PERMISSIONS_MATRIX;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch (err) {
    console.error("Failed to parse stored NAAC permission matrix:", err);
  }
  return DEFAULT_NAAC_PERMISSIONS_MATRIX;
}

export function savePermissionMatrix(matrix: RolePermissionMatrixItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matrix));
    window.dispatchEvent(new Event("naac_permissions_updated"));
  } catch (err) {
    console.error("Failed to save NAAC permission matrix:", err);
  }
}

export function resetPermissionMatrixToDefault(): RolePermissionMatrixItem[] {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("naac_permissions_updated"));
  }
  return DEFAULT_NAAC_PERMISSIONS_MATRIX;
}

/**
 * Maps any AuthStore role to the corresponding NAAC operational role.
 */
export function mapAuthRoleToNaacRole(roleKey?: RoleKey | null): NaacRole {
  if (!roleKey) return "faculty";
  switch (roleKey) {
    case "principal":
    case "platform_admin":
    case "institution_admin":
      return "principal";
    case "iqac_coordinator":
      return "iqac_coordinator";
    case "hod":
      return "hod";
    case "faculty":
    case "teacher":
    default:
      return "faculty";
  }
}

/**
 * React hook to read live role-based NAAC permissions for the currently authenticated user.
 */
export function useNaacPermissions() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const [matrix, setMatrix] = useState<RolePermissionMatrixItem[]>(getStoredPermissionMatrix);

  useEffect(() => {
    const handleUpdate = () => {
      setMatrix(getStoredPermissionMatrix());
    };
    window.addEventListener("naac_permissions_updated", handleUpdate);
    return () => window.removeEventListener("naac_permissions_updated", handleUpdate);
  }, []);

  const activeNaacRole: NaacRole = useMemo(() => {
    return mapAuthRoleToNaacRole(currentUser?.role);
  }, [currentUser?.role]);

  const permissions = useMemo(() => {
    const map: Record<NaacPermissionAction, boolean> = {} as Record<NaacPermissionAction, boolean>;
    for (const item of matrix) {
      map[item.key] = !!item.allowedRoles[activeNaacRole];
    }
    return map;
  }, [matrix, activeNaacRole]);

  const hasPermission = (action: NaacPermissionAction): boolean => {
    return !!permissions[action];
  };

  return {
    currentUser,
    activeNaacRole,
    roleLabel: NAAC_ROLES.find((r) => r.id === activeNaacRole)?.label || "Faculty Member",
    roleBadge: NAAC_ROLES.find((r) => r.id === activeNaacRole)?.badge || "Evidence Upload",
    permissions,
    hasPermission,
    canSignOff: permissions.sign_off_ssr || permissions.sign_off_aqar,
    canReviewAndApprove: permissions.review_evidence,
    canManageDeptData: permissions.manage_dept_data,
    canUploadEvidence: permissions.upload_evidence,
    canLockCycle: permissions.cycle_lock_unlock,
    canViewAudit: permissions.view_audit_trail,
    canManageTasks: permissions.assign_tasks,
  };
}
