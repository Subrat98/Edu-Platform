import { nameAt, phoneAt, SURNAMES } from "./namePools";
import { schoolClasses } from "../classes";
import { programmes } from "../programmes";
import type { Guardian, Student } from "@/types";

const students: Student[] = [];
const guardians: Guardian[] = [];

function makeGuardian(seed: number, studentId: string): Guardian {
  const surname = SURNAMES[seed % SURNAMES.length]!;
  const relationship = seed % 3 === 0 ? "Mother" : "Father";
  const guardianFirst = (relationship === "Mother" ? nameAt(seed * 3 + 1).name : nameAt(seed * 3).name).split(" ")[0]!;
  const guardian: Guardian = {
    id: `guardian-${seed}`,
    institutionId: studentId.startsWith("student-sch") ? "school" : "college",
    name: `${guardianFirst} ${surname}`,
    relationship,
    phone: phoneAt(seed + 500),
    email: `${guardianFirst.toLowerCase()}.${surname.toLowerCase()}${seed}@example.com`,
    occupation: ["Teacher", "Farmer", "Government Employee", "Shop Owner", "Engineer", "Homemaker", "Businessman", "Nurse"][seed % 8]!,
    studentIds: [studentId],
  };
  return guardian;
}

// ---- School students: distribute across classes/sections ----
let schoolSeed = 0;
const SCHOOL_STUDENT_COUNT = 60;
for (let i = 0; i < SCHOOL_STUDENT_COUNT; i += 1) {
  const cls = schoolClasses[i % schoolClasses.length]!;
  const section = cls.sections[Math.floor(i / schoolClasses.length) % cls.sections.length]!;
  const { name, gender } = nameAt(i);
  const id = `student-sch-${String(i + 1).padStart(3, "0")}`;
  const rollNumber = String((i % 40) + 1).padStart(2, "0");

  const student: Student = {
    id,
    institutionId: "school",
    admissionNo: `PSPS/${2020 + (i % 7)}/${String(1000 + i)}`,
    name,
    gender,
    dateOfBirth: `${2008 + (i % 12)}-0${(i % 9) + 1}-1${i % 9}`,
    classOrProgrammeId: cls.id,
    classOrProgrammeName: cls.name,
    section,
    rollNumber,
    guardianId: `guardian-${schoolSeed}`,
    status: i % 23 === 0 ? "Transferred" : "Active",
    admissionDate: `${2020 + (i % 7)}-06-0${(i % 9) + 1}`,
    photoInitialsSeed: name,
    enrollmentHistory: [
      {
        id: `enr-${id}-1`,
        academicYear: "2026-27",
        classOrProgrammeId: cls.id,
        classOrProgrammeName: cls.name,
        section,
        rollNumber,
        status: "Active",
      },
    ],
  };
  students.push(student);
  guardians.push(makeGuardian(schoolSeed, id));
  schoolSeed += 1;
}

// ---- College students: distribute across programmes ----
let collegeSeed = 1000;
const COLLEGE_STUDENT_COUNT = 60;
for (let i = 0; i < COLLEGE_STUDENT_COUNT; i += 1) {
  const prog = programmes[i % programmes.length]!;
  const semester = `Semester ${((i % prog.durationYears) * 2) + 1}`;
  const { name, gender } = nameAt(i + 40);
  const id = `student-col-${String(i + 1).padStart(3, "0")}`;
  const rollNumber = String((i % 50) + 1).padStart(2, "0");

  const student: Student = {
    id,
    institutionId: "college",
    admissionNo: `PSC/${2021 + (i % 5)}/${String(2000 + i)}`,
    name,
    gender,
    dateOfBirth: `${2004 + (i % 6)}-0${(i % 9) + 1}-1${i % 9}`,
    classOrProgrammeId: prog.id,
    classOrProgrammeName: prog.name,
    section: semester,
    rollNumber,
    guardianId: `guardian-${collegeSeed}`,
    status: i % 29 === 0 ? "Graduated" : "Active",
    admissionDate: `${2021 + (i % 5)}-07-15`,
    photoInitialsSeed: name,
    enrollmentHistory: [
      {
        id: `enr-${id}-1`,
        academicYear: "2026-27",
        classOrProgrammeId: prog.id,
        classOrProgrammeName: prog.name,
        section: semester,
        rollNumber,
        status: "Active",
      },
    ],
  };
  students.push(student);
  guardians.push(makeGuardian(collegeSeed, id));
  collegeSeed += 1;
}

// ---- Demo persona links: keep specific records in sync with the demo
// personas in mocks/data/users.ts, so the Student/Parent/Teacher portals
// have real, consistent ERP data to show rather than empty states. ----

const demoParentGuardian = guardians[0]!; // guardian-0, father of student-sch-001
demoParentGuardian.name = "Suresh Pradhan";
demoParentGuardian.relationship = "Father";
demoParentGuardian.phone = "+91 94370 10001";
demoParentGuardian.email = "parent@school.demo";
demoParentGuardian.occupation = "Government Employee";

// student-sch-001 is deterministically seeded as "Transferred" (i % 23 === 0
// at i=0), which would make attendance/exam/fee generators skip it entirely
// and leave the demo parent's first child with an empty portal. Force it
// Active so the Parent portal has real data to show by default.
const demoFirstChild = students.find((s) => s.id === "student-sch-001");
if (demoFirstChild) demoFirstChild.status = "Active";

const demoSecondChild = students.find((s) => s.id === "student-sch-016");
if (demoSecondChild) {
  demoSecondChild.guardianId = demoParentGuardian.id;
  if (!demoParentGuardian.studentIds.includes(demoSecondChild.id)) {
    demoParentGuardian.studentIds.push(demoSecondChild.id);
  }
}

const demoCollegeStudent = students.find((s) => s.id === "student-col-001");
if (demoCollegeStudent) {
  demoCollegeStudent.name = "Ankit Behera";
  demoCollegeStudent.gender = "Male";
  demoCollegeStudent.photoInitialsSeed = "Ankit Behera";
  demoCollegeStudent.status = "Active";
}

export const allStudents = students;
export const allGuardians = guardians;

export function getStudentsByInstitution(id: "school" | "college"): Student[] {
  return allStudents.filter((s) => s.institutionId === id);
}
export function getStudent(id: string): Student | undefined {
  return allStudents.find((s) => s.id === id);
}
export function getGuardian(id: string): Guardian | undefined {
  return allGuardians.find((g) => g.id === id);
}
export function getGuardiansByInstitution(id: "school" | "college"): Guardian[] {
  return allGuardians.filter((g) => g.institutionId === id);
}
