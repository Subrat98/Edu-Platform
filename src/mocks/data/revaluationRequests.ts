import { allExaminations, getMarksByExamination } from "./erp/examinations";
import { getStudent } from "./erp/studentsGuardians";
import type { RevaluationRequest } from "@/types";

const requests: RevaluationRequest[] = [];

const publishedCollegeExam = allExaminations.find((e) => e.institutionId === "college" && e.status === "Published");
if (publishedCollegeExam) {
  const marks = getMarksByExamination(publishedCollegeExam.id).slice(0, 2);
  marks.forEach((m, i) => {
    const student = getStudent(m.studentId);
    if (!student) return;
    requests.push({
      id: `reval-seed-${i}`,
      institutionId: "college",
      examinationId: publishedCollegeExam.id,
      examinationName: publishedCollegeExam.name,
      studentId: m.studentId,
      studentName: student.name,
      subject: m.subject,
      originalMarks: m.marksObtained,
      maxMarks: m.maxMarks,
      reason: i === 0 ? "I believe Question 4 was graded incorrectly against the model answer." : "Requesting a recheck of the practical component scoring.",
      status: i === 0 ? "Pending" : "Approved",
      requestedDate: "2026-12-08",
      revisedMarks: i === 0 ? undefined : Math.min(m.maxMarks, m.marksObtained + 4),
      reviewedBy: i === 0 ? undefined : "Examination Cell",
      reviewedDate: i === 0 ? undefined : "2026-12-12",
      reviewNote: i === 0 ? undefined : "Recheck confirmed an addition error in the practical marksheet.",
    });
  });
}

export const allRevaluationRequests = requests;

export function getRevaluationsByInstitution(id: "school" | "college"): RevaluationRequest[] {
  return allRevaluationRequests.filter((r) => r.institutionId === id);
}
export function getRevaluationsByStudent(studentId: string): RevaluationRequest[] {
  return allRevaluationRequests.filter((r) => r.studentId === studentId);
}
