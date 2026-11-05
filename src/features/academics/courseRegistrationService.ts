import { mockRequest } from "@/mocks/api/client";
import { allStudents, getStudent } from "@/mocks/data/erp/studentsGuardians";
import { COLLEGE_SUBJECTS } from "@/mocks/data/erp/examinations";
import { logActivity } from "@/mocks/data/activityLog";

// One-time seed: most active college students already registered for this
// semester's core papers, so the catalogue isn't empty on first load.
// The demo student persona (student-col-001 / Ankit Behera) is
// deliberately left unregistered so "Register for Courses" has something
// real to demonstrate.
let seeded = false;
function seedRegistrations() {
  if (seeded) return;
  seeded = true;
  allStudents
    .filter((s) => s.institutionId === "college" && s.status === "Active" && s.id !== "student-col-001")
    .forEach((student, i) => {
      const current = student.enrollmentHistory[student.enrollmentHistory.length - 1];
      if (!current) return;
      current.enrolledCourseIds = COLLEGE_SUBJECTS.slice(0, 3 + (i % 2));
    });
}
seedRegistrations();

function currentEnrollment(studentId: string) {
  const student = getStudent(studentId);
  return student?.enrollmentHistory[student.enrollmentHistory.length - 1];
}

export const courseRegistrationService = {
  listAvailableSubjects: () => mockRequest<string[]>(() => COLLEGE_SUBJECTS),

  getMyRegistration: (studentId: string) => mockRequest<string[]>(() => currentEnrollment(studentId)?.enrolledCourseIds ?? []),

  register: (studentId: string, courseIds: string[], actor: string) =>
    mockRequest<{ ok: true } | { ok: false; error: string }>(() => {
      const enrollment = currentEnrollment(studentId);
      if (!enrollment) return { ok: false, error: "No active enrollment found." };
      if (courseIds.length === 0) return { ok: false, error: "Select at least one course." };
      enrollment.enrolledCourseIds = courseIds;
      logActivity({ institutionId: "college", category: "Students", action: `${actor} registered for ${courseIds.length} course(s) — ${enrollment.classOrProgrammeName}`, actor });
      return { ok: true };
    }, { latencyMs: [350, 650] }),
};
