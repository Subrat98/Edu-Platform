import { mockRequest } from "@/mocks/api/client";
import {
  allExaminations,
  allMarksEntries,
  getExaminationsByInstitution,
  getExamination,
  getMarksByExamination,
} from "@/mocks/data/erp/examinations";
import { getStudentsByInstitution } from "@/mocks/data/erp/studentsGuardians";
import { logActivity } from "@/mocks/data/activityLog";
import { pushNotification } from "@/mocks/data/notifications";
import type { ExamStatus, Examination, InstitutionType, MarksEntry } from "@/types";

export const examinationService = {
  list: (institutionId: InstitutionType) => mockRequest<Examination[]>(() => getExaminationsByInstitution(institutionId)),

  get: (id: string) => mockRequest<Examination | null>(() => getExamination(id) ?? null),

  getMarks: (examinationId: string) => mockRequest<MarksEntry[]>(() => getMarksByExamination(examinationId)),

  updateMark: (examinationId: string, studentId: string, subject: string, marksObtained: number) =>
    mockRequest<{ ok: true } | { ok: false; error: string }>(() => {
      const entry = allMarksEntries.find((m) => m.examinationId === examinationId && m.studentId === studentId && m.subject === subject);
      if (!entry) return { ok: false, error: "Marks entry not found." };
      entry.marksObtained = marksObtained;
      entry.grade =
        marksObtained >= 90 ? "A1" : marksObtained >= 80 ? "A2" : marksObtained >= 70 ? "B1" : marksObtained >= 60 ? "B2" : marksObtained >= 50 ? "C1" : marksObtained >= 33 ? "D" : "E";
      return { ok: true };
    }),

  setStatus: (examinationId: string, status: ExamStatus, actor: string) =>
    mockRequest<{ ok: true } | { ok: false; error: string }>(() => {
      const exam = allExaminations.find((e) => e.id === examinationId);
      if (!exam) return { ok: false, error: "Examination not found." };
      exam.status = status;
      if (status === "Published") {
        exam.publishedDate = "2026-10-30";
        const classStudentIds = getStudentsByInstitution(exam.institutionId)
          .filter((s) => s.classOrProgrammeId === exam.classOrProgrammeId)
          .map((s) => s.id);
        classStudentIds.forEach((studentId) => {
          pushNotification({
            institutionId: exam.institutionId,
            category: "Academics",
            title: `${exam.name} results published`,
            body: `Results for ${exam.className} — ${exam.name} are now available.`,
            roles: ["student", "parent"],
            studentId,
          });
        });
      }
      logActivity({ institutionId: exam.institutionId, category: "Examinations", action: `Set "${exam.name}" (${exam.className}) to ${status}`, actor });
      return { ok: true };
    }),

  getPerformanceByClass: (institutionId: InstitutionType) =>
    mockRequest(() => {
      const exams = getExaminationsByInstitution(institutionId);
      return exams.map((exam) => {
        const marks = getMarksByExamination(exam.id);
        const totalObtained = marks.reduce((sum, m) => sum + m.marksObtained, 0);
        const totalMax = marks.reduce((sum, m) => sum + m.maxMarks, 0);
        const passCount = marks.filter((m) => m.marksObtained >= 33).length;
        return {
          examId: exam.id,
          className: exam.className,
          status: exam.status,
          averagePercent: totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0,
          passRate: marks.length > 0 ? Math.round((passCount / marks.length) * 100) : 0,
        };
      });
    }),
};
