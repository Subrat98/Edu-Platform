export type NaacCriterionId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface AccreditationCycle {
  id: string;
  cycleNumber: number;
  institutionName: string;
  accreditationBody: "NAAC" | "NIRF" | "NBA" | "UGC";
  status: "Accredited" | "In Progress" | "Expired" | "Under Review";
  grade: string;
  cgpa: number;
  accreditationDate: string;
  validUntil: string;
  ssrSubmissionDate: string;
  aqarStatus: string;
  peerTeamVisitDate: string;
  remarks: string;
  certificateUrl?: string;
}

export interface NaacMetric {
  id: string;
  criterionId: NaacCriterionId;
  indicatorCode: string;
  code: string;
  name: string;
  type: "quantitative" | "qualitative";
  weightage: number;
  description: string;
  dataRequired: string;
  status: "Completed" | "In Progress" | "Pending Review" | "Verified";
  departmentId?: string;
  evidenceCount: number;
  academicYear: string;
  qualitativeText?: string;
  quantitativeValue?: number | string;
  benchmark?: string;
  lastUpdated: string;
  updatedBy: string;
}

export interface NaacKeyIndicator {
  id: string;
  criterionId: NaacCriterionId;
  code: string;
  name: string;
  weightage: number;
  metrics: NaacMetric[];
}

export interface NaacCriterion {
  id: NaacCriterionId;
  number: number;
  name: string;
  weightage: number;
  completionPercentage: number;
  score: number;
  weightedScore?: number;
  executiveSummary: string;
  description?: string;
  keyIndicators: NaacKeyIndicator[];
}

export type EvidenceStatus =
  | "Draft"
  | "Uploaded"
  | "Under Review"
  | "Verified"
  | "Approved"
  | "Rejected"
  | "Archived";

export interface NaacEvidenceDocument {
  id: string;
  criterionId: NaacCriterionId;
  indicatorCode: string;
  metricCode: string;
  title: string;
  academicYear: string;
  department: string;
  documentType: "PDF" | "DOCX" | "XLSX" | "IMAGE" | "URL";
  description: string;
  uploadedBy: string;
  uploadDate: string;
  status: EvidenceStatus;
  version: string;
  remarks: string;
  fileName: string;
  fileSize: string;
  evidenceUrl: string;
  verifiedBy?: string;
  verificationDate?: string;
  approvedBy?: string;
  approvalDate?: string;
}

export interface IqacCommitteeMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  role:
    | "Chairperson"
    | "Coordinator"
    | "Faculty Member"
    | "Administrative Officer"
    | "Management Rep"
    | "Student Rep"
    | "Alumni Rep"
    | "Employer Rep";
  appointmentDate: string;
  tenure: string;
  contact: string;
  email: string;
  avatarUrl?: string;
}

export interface IqacMeeting {
  id: string;
  meetingNumber: string;
  meetingDate: string;
  agenda: string[];
  membersPresent: string[];
  minutes: string;
  decisions: string[];
  actionItems: {
    task: string;
    assignee: string;
    deadline: string;
    status: "Pending" | "Done";
  }[];
  documents: { name: string; url: string }[];
}

export interface IqacActivity {
  id: string;
  title: string;
  date: string;
  category:
    | "FDP"
    | "Workshop"
    | "Seminar"
    | "Academic Audit"
    | "Gender Audit"
    | "Green Audit"
    | "Curriculum Review"
    | "Quality Initiative";
  objective: string;
  description: string;
  participants: number;
  outcome: string;
  evidenceUrl?: string;
}

export interface IqacActionTaken {
  id: string;
  meetingId: string;
  meetingNumber: string;
  decision: string;
  responsiblePerson: string;
  deadline: string;
  status: "Completed" | "In Progress" | "Pending";
  actionTaken: string;
  evidenceUrl?: string;
  remarks: string;
}

export type AqarStatus =
  | "Draft"
  | "Data Collection"
  | "Department Review"
  | "IQAC Review"
  | "Principal Approval"
  | "Final AQAR"
  | "Submitted";

export interface AqarRecord {
  id: string;
  academicYear: string;
  status: AqarStatus;
  criteriaProgress: Record<NaacCriterionId, number>;
  overallCompletion: number;
  submissionDeadline: string;
  submittedDate?: string;
  preparedBy: string;
  approvedBy?: string;
  remarks: string;
  documentUrl?: string;
}

export interface SsrRecord {
  id: string;
  cycle: number;
  status:
    | "Draft"
    | "Data Verification"
    | "IQAC Review"
    | "Principal Review"
    | "Ready for Submission"
    | "Submitted";
  academicYearsCovered: string[];
  overallCompletion: number;
  executiveSummaryStatus: "Draft" | "Completed";
  profileStatus: "Draft" | "Completed";
  qifStatus: "Draft" | "In Progress" | "Completed";
  criteriaProgress: Record<NaacCriterionId, number>;
  submissionDeadline: string;
  diasRemarks?: string;
}

export type StakeholderType = "Student" | "Teacher" | "Alumni" | "Employer" | "Parent";

export interface NaacFeedbackRecord {
  id: string;
  stakeholder: StakeholderType;
  academicYear: string;
  department: string;
  respondentName?: string;
  curriculumRating: number;
  teachingRating: number;
  infrastructureRating: number;
  resourcesRating: number;
  overallSatisfaction: number;
  suggestions: string;
  date: string;
}

export interface StakeholderFeedbackSummary {
  stakeholder: StakeholderType;
  totalResponses: number;
  averageRating: number;
  averageScore?: number;
  academicYear?: string;
  categoryScores: { category: string; score: number }[];
  atrSummary: string;
}

export interface BestPracticeItem {
  id: string;
  title: string;
  academicYear: string;
  objectives: string;
  context: string;
  practice: string;
  evidence: string;
  outcome: string;
  problemsEncountered: string;
  resourcesRequired: string;
  personResponsible: string;
  status: "Active" | "Under Review" | "Archived";
}

export interface InstitutionalDistinctivenessItem {
  id: string;
  title: string;
  academicYear: string;
  description: string;
  objectives: string;
  uniqueFeatures: string[];
  majorAchievements: string[];
  supportingEvidence: string;
  impact: string;
  status: "Active" | "Draft";
}

export type TaskStatus =
  | "Not Started"
  | "In Progress"
  | "Under Review"
  | "Completed"
  | "Overdue";

export interface NaacTask {
  id: string;
  title: string;
  criterionId: NaacCriterionId;
  metricCode: string;
  assignedDepartment: string;
  responsiblePerson: string;
  priority: "High" | "Medium" | "Low";
  startDate: string;
  dueDate: string;
  status: TaskStatus;
  progress: number;
  evidenceUrl?: string;
  remarks: string;
}

export interface ApprovalHistoryEntry {
  stage: string;
  actor: string;
  action: string;
  timestamp: string;
  comments: string;
}

export interface NaacApproval {
  id: string;
  entityType: "Evidence" | "MetricData" | "AQAR" | "SSR" | "ATR";
  entityId: string;
  title: string;
  department: string;
  submittedBy: string;
  submittedDate: string;
  currentStage: "Dept Coordinator" | "HOD" | "IQAC Coordinator" | "Principal";
  status: "Pending" | "Approved" | "Changes Requested" | "Rejected";
  remarks: string;
  history: ApprovalHistoryEntry[];
}

export interface NaacAuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  module: string;
  action:
    | "Created"
    | "Updated"
    | "Verified"
    | "Approved"
    | "Rejected"
    | "Status Change"
    | "Deleted";
  entityTitle: string;
  previousValue?: string;
  newValue?: string;
  remarks?: string;
}

export interface AcademicCouncilMeeting {
  id: string;
  meetingNumber: string;
  meetingDate: string;
  chairperson: string;
  totalMembersPresent: number;
  agenda: string;
  keyResolutions: string[];
  programmesApproved: string[];
  syllabusRevisionSummary: string;
  minutesDocumentUrl: string;
  evidenceId: string;
  status: "Approved" | "Notified" | "Draft";
}

export interface SemesterAcademicCalendar {
  id: string;
  academicYear: string;
  semester: "Odd Semester" | "Even Semester" | "Annual";
  programmesCovered: string[];
  startDate: string;
  endDate: string;
  instructionalDays: number;
  continuousInternalEvaluationDates: string;
  endSemesterExamDates: string;
  coCurricularWindows: string;
  status: "Statutory Approved" | "In Progress";
  evidenceId: string;
  calendarPdfUrl: string;
}

export interface ProgrammeSyllabusStructure {
  id: string;
  programmeId: string;
  programmeCode: string;
  programmeName: string;
  department: string;
  framework: "LOCF - NEP 2020" | "CBCS (UGC)" | "Autonomous Regulations";
  totalCredits: number;
  coreCredits: number;
  disciplineElectiveCredits: number;
  genericElectiveCredits: number;
  skillEnhancementCredits: number;
  internshipCredits: number;
  coPoMappingStatus: "100% Mapped" | "In Review";
  revisionYear: string;
  lastRevisedPercentage: number;
  syllabusDocumentUrl: string;
  evidenceId: string;
}

export interface LessonPlanAdherence {
  id: string;
  departmentId: string;
  departmentName: string;
  academicYear: string;
  semester: "Odd" | "Even";
  totalCoursesOffered: number;
  lessonPlansSubmitted: number;
  adherencePercentage: number;
  courseFilesAudited: number;
  hodSignOffDate: string;
  iqacAuditor: string;
  status: "Audited & Verified" | "Partially Verified";
  evidenceId: string;
}

export interface CurriculumPlanningData {
  councilMeetings: AcademicCouncilMeeting[];
  academicCalendars: SemesterAcademicCalendar[];
  syllabusStructures: ProgrammeSyllabusStructure[];
  lessonPlanAdherence: LessonPlanAdherence[];
}
