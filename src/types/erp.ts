import type { InstitutionType } from "./institution";

// ---------------------------------------------------------------------
// Admissions
// ---------------------------------------------------------------------

export type ApplicationStatus =
  | "Draft"
  | "Submitted"
  | "Under Review"
  | "Action Required"
  | "Accepted"
  | "Rejected"
  | "Waitlisted"
  | "Withdrawn";

export interface ApplicationReview {
  id: string;
  actor: string;
  timestamp: string;
  fromStatus: ApplicationStatus;
  toStatus: ApplicationStatus;
  note?: string;
}

export interface AdmissionApplication {
  id: string;
  institutionId: InstitutionType;
  applicationNo: string;
  applicantName: string;
  guardianName: string;
  phone: string;
  email: string;
  appliedFor: string; // class name or programme name
  appliedForId: string; // classId or programmeId
  previousSchoolOrCollege: string;
  submittedDate: string;
  status: ApplicationStatus;
  documents: { name: string; uploaded: boolean }[];
  reviews: ApplicationReview[];
  convertedStudentId?: string;
}

// ---------------------------------------------------------------------
// Students & Guardians
// ---------------------------------------------------------------------

export type StudentStatus = "Active" | "Transferred" | "Withdrawn" | "Graduated";
export type Gender = "Male" | "Female" | "Other";

export interface Guardian {
  id: string;
  institutionId: InstitutionType;
  name: string;
  relationship: "Father" | "Mother" | "Guardian";
  phone: string;
  email: string;
  occupation: string;
  studentIds: string[];
}

export interface Enrollment {
  id: string;
  academicYear: string;
  classOrProgrammeId: string;
  classOrProgrammeName: string;
  section: string;
  rollNumber: string;
  status: StudentStatus;
  /** College only — subject/course offerings the student has self-registered for this semester. */
  enrolledCourseIds?: string[];
}

export interface Student {
  id: string;
  institutionId: InstitutionType;
  admissionNo: string;
  name: string;
  gender: Gender;
  dateOfBirth: string;
  classOrProgrammeId: string;
  classOrProgrammeName: string;
  section: string;
  rollNumber: string;
  guardianId: string;
  status: StudentStatus;
  admissionDate: string;
  photoInitialsSeed: string;
  enrollmentHistory: Enrollment[];
}

// ---------------------------------------------------------------------
// Academics
// ---------------------------------------------------------------------

export interface AcademicYear {
  id: string;
  label: string; // "2026-27"
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  terms: string[];
}

export interface TimetableEntry {
  id: string;
  institutionId: InstitutionType;
  classOrProgrammeId: string;
  section: string; // section name or semester label
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  periodIndex: number;
  startTime: string;
  endTime: string;
  subject: string;
  staffId: string;
  room: string;
}

// ---------------------------------------------------------------------
// Attendance
// ---------------------------------------------------------------------

export type AttendanceStatus = "Present" | "Absent" | "Late" | "Approved Leave";

export interface AttendanceSession {
  id: string;
  institutionId: InstitutionType;
  date: string;
  classOrProgrammeId: string;
  section: string;
  subject: string;
  takenBy: string;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  status: AttendanceStatus;
}

// ---------------------------------------------------------------------
// Examinations & Results
// ---------------------------------------------------------------------

export type ExamStatus = "Scheduled" | "Marks Entry" | "Under Verification" | "Published";

export interface ExamSubjectConfig {
  subject: string;
  maxMarks: number;
  passMarks: number;
  examDate: string;
}

export interface Examination {
  id: string;
  institutionId: InstitutionType;
  name: string;
  academicYear: string;
  term: string;
  classOrProgrammeId: string;
  className: string;
  subjects: ExamSubjectConfig[];
  status: ExamStatus;
  publishedDate?: string;
}

export interface MarksEntry {
  id: string;
  examinationId: string;
  studentId: string;
  subject: string;
  marksObtained: number;
  maxMarks: number;
  grade: string;
}

// ---------------------------------------------------------------------
// Fees & Finance
// ---------------------------------------------------------------------

export interface FeeHead {
  id: string;
  institutionId: InstitutionType;
  name: string;
  frequency: "Annual" | "Term" | "Monthly" | "One-time";
}

export interface FeeStructure {
  id: string;
  institutionId: InstitutionType;
  classOrProgrammeId: string;
  className: string;
  academicYear: string;
  feeHeadId: string;
  feeHeadName: string;
  amount: number;
  dueDate: string;
}

export type InvoiceStatus = "Unpaid" | "Partially Paid" | "Paid" | "Overdue";

export interface Invoice {
  id: string;
  institutionId: InstitutionType;
  invoiceNo: string;
  studentId: string;
  description: string;
  academicYear: string;
  amount: number;
  amountPaid: number;
  dueDate: string;
  issueDate: string;
  status: InvoiceStatus;
  concession: number;
  concessionReason?: string;
}

export type PaymentMode = "Cash" | "Bank Transfer" | "Cheque" | "Online";

export interface Payment {
  id: string;
  institutionId: InstitutionType;
  receiptNo: string;
  invoiceId: string;
  studentId: string;
  amount: number;
  mode: PaymentMode;
  date: string;
  recordedBy: string;
}
