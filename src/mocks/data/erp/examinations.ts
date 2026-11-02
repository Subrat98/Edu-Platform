import { schoolClasses } from "../classes";
import { programmes } from "../programmes";
import { allStudents } from "./studentsGuardians";
import type { Examination, ExamStatus, MarksEntry } from "@/types";

export const SCHOOL_SUBJECTS_BY_STAGE: Record<string, string[]> = {
  "Pre-Primary": [],
  Primary: ["English", "Mathematics", "EVS", "Hindi"],
  Middle: ["English", "Mathematics", "Science", "Social Science", "Hindi"],
  Secondary: ["English", "Mathematics", "Science", "Social Science", "Computer Applications"],
  "Senior Secondary": ["English", "Core Subject 1", "Core Subject 2", "Core Subject 3", "Core Subject 4"],
};

function gradeFor(percent: number): string {
  if (percent >= 90) return "A1";
  if (percent >= 80) return "A2";
  if (percent >= 70) return "B1";
  if (percent >= 60) return "B2";
  if (percent >= 50) return "C1";
  if (percent >= 33) return "D";
  return "E";
}

const examinations: Examination[] = [];
const marksEntries: MarksEntry[] = [];
let examSeed = 0;
let marksSeed = 0;

schoolClasses.forEach((cls) => {
  const subjects = SCHOOL_SUBJECTS_BY_STAGE[cls.stage] ?? [];
  if (subjects.length === 0) return;

  const status: ExamStatus = examSeed % 3 === 0 ? "Published" : examSeed % 3 === 1 ? "Under Verification" : "Marks Entry";
  const examId = `exam-sch-${examSeed}`;
  examinations.push({
    id: examId,
    institutionId: "school",
    name: "Half-Yearly Examination 2026",
    academicYear: "2026-27",
    term: "Term 1",
    classOrProgrammeId: cls.id,
    className: cls.name,
    subjects: subjects.map((s, i) => ({ subject: s, maxMarks: 100, passMarks: 33, examDate: `2026-11-${10 + i}` })),
    status,
    publishedDate: status === "Published" ? "2026-11-25" : undefined,
  });

  const students = allStudents.filter((s) => s.classOrProgrammeId === cls.id && s.status === "Active");
  students.forEach((student) => {
    subjects.forEach((subject, si) => {
      const marksObtained = 40 + ((marksSeed * 7 + si * 11) % 58);
      marksEntries.push({
        id: `marks-${marksSeed}`,
        examinationId: examId,
        studentId: student.id,
        subject,
        marksObtained,
        maxMarks: 100,
        grade: gradeFor(marksObtained),
      });
      marksSeed += 1;
    });
  });
  examSeed += 1;
});

export const COLLEGE_SUBJECTS = ["Core Paper I", "Core Paper II", "Core Paper III", "Elective", "Practical / Viva"];

programmes.forEach((prog) => {
  const subjects = COLLEGE_SUBJECTS;
  const status: ExamStatus = examSeed % 3 === 0 ? "Published" : examSeed % 3 === 1 ? "Under Verification" : "Marks Entry";
  const examId = `exam-col-${examSeed}`;
  examinations.push({
    id: examId,
    institutionId: "college",
    name: "Odd Semester Examination 2026",
    academicYear: "2026-27",
    term: "Odd Semester",
    classOrProgrammeId: prog.id,
    className: prog.name,
    subjects: subjects.map((s, i) => ({ subject: s, maxMarks: 100, passMarks: 40, examDate: `2026-11-${18 + i}` })),
    status,
    publishedDate: status === "Published" ? "2026-12-05" : undefined,
  });

  const students = allStudents.filter((s) => s.classOrProgrammeId === prog.id && s.status === "Active");
  students.forEach((student) => {
    subjects.forEach((subject, si) => {
      const marksObtained = 35 + ((marksSeed * 7 + si * 11) % 63);
      marksEntries.push({
        id: `marks-${marksSeed}`,
        examinationId: examId,
        studentId: student.id,
        subject,
        marksObtained,
        maxMarks: 100,
        grade: gradeFor(marksObtained),
      });
      marksSeed += 1;
    });
  });
  examSeed += 1;
});

export const allExaminations = examinations;
export const allMarksEntries = marksEntries;

export function getExaminationsByInstitution(id: "school" | "college"): Examination[] {
  return allExaminations.filter((e) => e.institutionId === id);
}
export function getExamination(id: string): Examination | undefined {
  return allExaminations.find((e) => e.id === id);
}
export function getMarksByExamination(examinationId: string): MarksEntry[] {
  return allMarksEntries.filter((m) => m.examinationId === examinationId);
}
export function getMarksByStudent(studentId: string): MarksEntry[] {
  return allMarksEntries.filter((m) => m.studentId === studentId);
}
