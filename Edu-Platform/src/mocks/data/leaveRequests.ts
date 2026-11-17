import { getStudent } from "./erp/studentsGuardians";
import type { InstitutionType, LeaveRequest } from "@/types";

const requests: LeaveRequest[] = [];

function seedFor(studentId: string, requestedBy: string, startDate: string, endDate: string, reason: string, status: LeaveRequest["status"]) {
  const student = getStudent(studentId);
  if (!student) return;
  requests.push({
    id: `leave-seed-${requests.length}`,
    institutionId: student.institutionId,
    studentId,
    studentName: student.name,
    classOrProgrammeId: student.classOrProgrammeId,
    section: student.section,
    requestedBy,
    startDate,
    endDate,
    reason,
    status,
    requestedDate: "2026-10-25",
    reviewedBy: status === "Pending" ? undefined : "Ramesh Nayak",
    reviewedDate: status === "Pending" ? undefined : "2026-10-26",
  });
}

seedFor("student-sch-016", "Suresh Pradhan (Father)", "2026-11-05", "2026-11-06", "Family function out of town.", "Pending");
seedFor("student-col-001", "Ankit Behera", "2026-10-20", "2026-10-21", "Medical appointment.", "Approved");

export const allLeaveRequests = requests;

export function getLeaveRequestsByInstitution(id: InstitutionType): LeaveRequest[] {
  return allLeaveRequests.filter((r) => r.institutionId === id);
}
export function getLeaveRequestsByStudent(studentId: string): LeaveRequest[] {
  return allLeaveRequests.filter((r) => r.studentId === studentId);
}
