import { mockRequest } from "@/mocks/api/client";
import { allApplications, getApplicationsByInstitution, getApplication } from "@/mocks/data/erp/admissions";
import { allStudents, allGuardians } from "@/mocks/data/erp/studentsGuardians";
import { logActivity } from "@/mocks/data/activityLog";
import type { AdmissionApplication, ApplicationStatus, Guardian, InstitutionType, Student } from "@/types";

let studentSeq = 9000;

export const admissionService = {
  list: (institutionId: InstitutionType) =>
    mockRequest<AdmissionApplication[]>(() => [...getApplicationsByInstitution(institutionId)].sort((a, b) => b.submittedDate.localeCompare(a.submittedDate))),

  get: (id: string) => mockRequest<AdmissionApplication | null>(() => getApplication(id) ?? null),

  setStatus: (id: string, status: ApplicationStatus, actor: string, note?: string) =>
    mockRequest<{ ok: true } | { ok: false; error: string }>(() => {
      const app = allApplications.find((a) => a.id === id);
      if (!app) return { ok: false, error: "Application not found." };
      const fromStatus = app.status;
      app.status = status;
      app.reviews.push({
        id: `review-${Date.now()}`,
        actor,
        timestamp: "2026-10-30T00:00:00",
        fromStatus,
        toStatus: status,
        note,
      });
      logActivity({ institutionId: app.institutionId, category: "Admissions", action: `Marked application ${app.applicationNo} as ${status}`, actor, detail: note });
      return { ok: true };
    }, { latencyMs: [300, 600] }),

  /**
   * Accept an application and convert it into a Student + Guardian
   * record in one step — idempotent: calling it twice on an already
   * converted application is a no-op that returns the existing student.
   */
  convertToStudent: (id: string, actor: string) =>
    mockRequest<{ ok: true; student: Student } | { ok: false; error: string }>(() => {
      const app = allApplications.find((a) => a.id === id);
      if (!app) return { ok: false, error: "Application not found." };
      if (app.convertedStudentId) {
        const existing = allStudents.find((s) => s.id === app.convertedStudentId);
        if (existing) return { ok: true, student: existing };
      }
      if (app.status !== "Accepted") return { ok: false, error: "Only an accepted application can be converted." };

      const prefix = app.institutionId === "school" ? "PSPS" : "PSC";
      const studentId = `student-live-${studentSeq}`;
      const guardianId = `guardian-live-${studentSeq}`;
      studentSeq += 1;

      const guardian: Guardian = {
        id: guardianId,
        institutionId: app.institutionId,
        name: app.guardianName,
        relationship: "Guardian",
        phone: app.phone,
        email: app.email,
        occupation: "—",
        studentIds: [studentId],
      };
      allGuardians.push(guardian);

      const student: Student = {
        id: studentId,
        institutionId: app.institutionId,
        admissionNo: `${prefix}/2027/${String(9000 + studentSeq)}`,
        name: app.applicantName,
        gender: "Other",
        dateOfBirth: "2012-01-01",
        classOrProgrammeId: app.appliedForId,
        classOrProgrammeName: app.appliedFor,
        section: "A",
        rollNumber: "—",
        guardianId,
        status: "Active",
        admissionDate: "2026-10-30",
        photoInitialsSeed: app.applicantName,
        enrollmentHistory: [
          {
            id: `enr-${studentId}-1`,
            academicYear: "2026-27",
            classOrProgrammeId: app.appliedForId,
            classOrProgrammeName: app.appliedFor,
            section: "A",
            rollNumber: "—",
            status: "Active",
          },
        ],
      };
      allStudents.push(student);
      app.convertedStudentId = studentId;
      app.reviews.push({
        id: `review-${Date.now()}`,
        actor,
        timestamp: "2026-10-30T00:00:00",
        fromStatus: app.status,
        toStatus: app.status,
        note: `Converted to student record ${student.admissionNo}.`,
      });
      logActivity({ institutionId: app.institutionId, category: "Admissions", action: `Converted ${app.applicantName} to student ${student.admissionNo}`, actor });

      return { ok: true, student };
    }, { latencyMs: [400, 800] }),

  getDashboardStats: (institutionId: InstitutionType) =>
    mockRequest(() => {
      const apps = getApplicationsByInstitution(institutionId);
      return {
        total: apps.length,
        submitted: apps.filter((a) => a.status === "Submitted").length,
        underReview: apps.filter((a) => a.status === "Under Review").length,
        actionRequired: apps.filter((a) => a.status === "Action Required").length,
        accepted: apps.filter((a) => a.status === "Accepted").length,
        rejected: apps.filter((a) => a.status === "Rejected").length,
        waitlisted: apps.filter((a) => a.status === "Waitlisted").length,
      };
    }),
};
