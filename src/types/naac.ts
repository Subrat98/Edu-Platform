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

export interface BoardOfStudiesMeeting {
  id: string;
  meetingNumber: string;
  departmentId: string;
  departmentName: string;
  meetingDate: string;
  academicYear: string;
  externalExperts: string[];
  industryRepresentative: string;
  alumniRepresentative: string;
  programmesReviewed: string[];
  keyRecommendations: string[];
  percentageChangeApproved: number;
  minutesDocumentUrl: string;
  evidenceId: string;
  status: "Approved" | "Ratified by Academic Council" | "Draft";
}

export interface ProgrammeRevisionRecord {
  id: string;
  programmeId: string;
  programmeCode: string;
  programmeName: string;
  department: string;
  academicYear: string;
  revisionCycle: string;
  totalCoursesInProgramme: number;
  coursesRevisedCount: number;
  newCoursesIntroducedCount: number;
  percentageRevision: number;
  bosResolutionNumber: string;
  academicCouncilNotification: string;
  implementationDate: string;
  syllabusDocumentUrl: string;
  evidenceId: string;
}

export interface ComparativeSyllabusItem {
  id: string;
  programmeCode: string;
  programmeName: string;
  department: string;
  courseCode: string;
  courseTitle: string;
  oldCourseCode?: string;
  oldCourseTitle?: string;
  revisionType: "Content Modified" | "New Course Added" | "Replaced Old Course" | "Elective Converted to Core";
  percentageContentChange: number;
  keyAdditions: string[];
  keyDeletions?: string[];
  academicYear: string;
  bosMeetingDate: string;
  evidenceId: string;
}

export interface FiveYearRevisionSummary {
  academicYear: string;
  totalProgrammesOffered: number;
  programmesRevised: number;
  totalCoursesOffered: number;
  coursesRevisedOrAdded: number;
  revisionPercentage: number;
}

export interface CurriculumRevisionData {
  fiveYearSummaries: FiveYearRevisionSummary[];
  overallRevisionPercentage: number;
  benchmarkPercentage: number;
  benchmarkStatus: "Exceeds NAAC Benchmark" | "Meets Benchmark" | "Below Benchmark";
  bosMeetings: BoardOfStudiesMeeting[];
  programmeRevisions: ProgrammeRevisionRecord[];
  comparativeSyllabusItems: ComparativeSyllabusItem[];
}

export interface CbcsProgrammeRecord {
  id: string;
  programmeId: string;
  programmeCode: string;
  programmeName: string;
  department: string;
  level: "UG" | "PG" | "Diploma" | "Certificate";
  implementationYear: string;
  cbcsType: "Choice Based Credit System (CBCS)" | "Elective Course System" | "NEP LOCF Multi-Entry/Exit";
  totalCredits: number;
  coreCredits: number;
  dseCredits: number;
  geCredits: number;
  secCredits: number;
  aeccCredits: number;
  electivePercentage: number;
  universityNotificationNumber: string;
  councilResolutionNumber: string;
  status: "Active & Verified" | "Under Review";
  syllabusUrl: string;
  evidenceId: string;
}

export interface UniversityNotification {
  id: string;
  notificationNumber: string;
  issuingAuthority: string;
  subject: string;
  issueDate: string;
  effectiveAcademicYear: string;
  programmesCovered: string[];
  gazetteOrderUrl: string;
  evidenceId: string;
  verifiedBy: string;
}

export interface ElectiveCourseOption {
  id: string;
  courseCode: string;
  courseTitle: string;
  offeringDepartment: string;
  targetProgrammes: string[];
  electiveType: "Discipline Specific Elective (DSE)" | "Generic Elective (GE / Open Elective)" | "Skill Enhancement Course (SEC)";
  credits: number;
  semester: string;
  prerequisites?: string;
  enrolledStudentsCount: number;
  swayamTransferEligible: boolean;
  syllabusDocumentUrl: string;
}

export interface CbcsSummaryData {
  totalProgrammesOffered: number;
  programmesWithCbcs: number;
  adoptionPercentage: number;
  benchmarkPercentage: number;
  totalElectiveCoursesOffered: number;
  totalStudentsEnrolledInElectives: number;
  programmeRecords: CbcsProgrammeRecord[];
  notifications: UniversityNotification[];
  electiveCourses: ElectiveCourseOption[];
}

export interface ValueAddedCourse {
  id: string;
  courseCode: string;
  courseName: string;
  category:
    | "Certificate Course"
    | "Value-Added Course"
    | "MOOCs / SWAYAM / NPTEL"
    | "Industry Skill Certification"
    | "Life Skills & Soft Skills";
  offeringDepartment: string;
  partnerAgency?: string;
  durationHours: number;
  mode: "Offline / Classroom" | "Online / MOOC" | "Hybrid";
  academicYear: string;
  targetAudience: string;
  enrolledStudentsCount: number;
  completedStudentsCount: number;
  passPercentage: number;
  courseCoordinator: string;
  curriculumUrl: string;
  attendanceSheetUrl: string;
  sampleCertificateUrl: string;
  evidenceId: string;
  status: "Completed & Audited" | "Ongoing";
}

export interface ValueAddedEnrolmentSummary {
  academicYear: string;
  totalCoursesOffered: number;
  totalStudentsEnrolled: number;
  totalCertificatesAwarded: number;
  completionRate: number;
}

export interface StudentCertificateRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  programmeName: string;
  courseCode: string;
  courseName: string;
  attendancePercentage: number;
  gradeOrScore: string;
  certificateIssueDate: string;
  certificateVerificationId: string;
  status: "Verified & Issued" | "In Review";
}

export interface ValueAddedCoursesData {
  totalCourses: number;
  totalStudents: number;
  benchmarkCourses: number;
  benchmarkStudents: number;
  overallCompletionRate: number;
  courses: ValueAddedCourse[];
  enrolmentSummaries: ValueAddedEnrolmentSummary[];
  studentCertificates: StudentCertificateRecord[];
}

export type CrosscuttingTheme =
  | "Gender Sensitization & Equity"
  | "Environment & Sustainability"
  | "Human Values & Constitutional Rights"
  | "Professional Ethics & Integrity";

export interface CrosscuttingCourseMapping {
  id: string;
  courseCode: string;
  courseTitle: string;
  programmeName: string;
  department: string;
  courseType:
    | "Core Course"
    | "Ability Enhancement (AECC)"
    | "Skill Enhancement (SEC)"
    | "Generic Elective (GE)"
    | "Discipline Specific (DSE)";
  theme: CrosscuttingTheme;
  highlightedUnit: string;
  unitTitle: string;
  syllabusExcerpt: string;
  highlightedKeywords: string[];
  contactHoursDevoted: number;
  learningOutcomes: string;
  syllabusPdfUrl: string;
  evidenceId: string;
}

export interface CrosscuttingCoCurricularActivity {
  id: string;
  title: string;
  theme: CrosscuttingTheme;
  organizingCell: string;
  eventDate: string;
  academicYear: string;
  participantsCount: number;
  outcomeSummary: string;
  reportUrl: string;
  evidenceId: string;
}

export interface CrosscuttingSummaryData {
  totalMappedCourses: number;
  programmesCoveredPercentage: number;
  coursesByTheme: {
    gender: number;
    environment: number;
    humanValues: number;
    professionalEthics: number;
  };
  totalActivities: number;
  totalParticipants: number;
  courseMappings: CrosscuttingCourseMapping[];
  activities: CrosscuttingCoCurricularActivity[];
}

export interface EnrolmentCategoryDistribution {
  sc: number;
  st: number;
  obc: number;
  general: number;
  pwd: number;
  ews: number;
}

export interface EnrolmentYearRecord {
  academicYear: string;
  sanctionedSeats: number;
  admittedStudents: number;
  enrolmentPercentage: number;
  reservedSeatsEarmarked: EnrolmentCategoryDistribution;
  admittedByCategory: EnrolmentCategoryDistribution;
  samsNotificationNumber: string;
  approvalLetterUrl: string;
}

export interface ProgrammeEnrolmentRecord {
  id: string;
  programmeCode: string;
  programmeName: string;
  department: string;
  level: "UG" | "PG" | "Diploma";
  academicYear: string;
  sanctionedIntake: number;
  admittedCount: number;
  enrolmentPercentage: number;
  scCount: number;
  stCount: number;
  obcCount: number;
  genCount: number;
  pwdCount: number;
  samsCutoffMarks: string;
  status: "Admissions Closed & Verified" | "Ongoing";
}

export interface StudentProfileEnrolmentData {
  fiveYearEnrolmentPercentage: number;
  benchmarkPercentage: number;
  totalSanctionedFiveYears: number;
  totalAdmittedFiveYears: number;
  yearlyRecords: EnrolmentYearRecord[];
  programmeRecords: ProgrammeEnrolmentRecord[];
  reservationPolicy: {
    scPercent: number;
    stPercent: number;
    obcPercent: number;
    openPercent: number;
    pwdPercent: number;
  };
}

// ==========================================
// Metric 2.2.1: Student - Full-Time Teacher Ratio
// ==========================================

export interface DepartmentFacultyRatio {
  departmentId: string;
  departmentName: string;
  studentCount: number;
  fullTimeFacultyCount: number;
  sanctionedPosts: number;
  ratio: string;
  ratioNumeric: number;
  phdCount: number;
}

export interface FullTimeFacultyMember {
  id: string;
  name: string;
  empId: string;
  department: string;
  designation: string;
  highestQualification: string;
  isPhd: boolean;
  panNumber: string;
  dateOfAppointment: string;
  natureOfAppointment: "Permanent" | "Full-time Approved" | "Contractual / Ad-hoc";
  experienceYears: number;
  appointmentOrderNo: string;
  appointmentOrderUrl: string;
  isMentor: boolean;
  assignedMenteesCount: number;
  status: "Active" | "On Sabbatical" | "Retired";
}

export interface CohortStudentCount {
  programmeCode: string;
  programmeName: string;
  department: string;
  degreeLevel: "UG" | "PG";
  year1Count: number;
  year2Count: number;
  year3Count: number;
  year4Count: number;
  totalEnrolled: number;
}

export interface StudentTeacherRatioTrendItem {
  academicYear: string;
  totalStudents: number;
  fullTimeFaculty: number;
  ratio: string;
  ratioNumeric: number;
}

export interface StudentTeacherRatioData {
  academicYear: string;
  totalStudents: number;
  totalFullTimeFaculty: number;
  ratio: string;
  ratioNumeric: number;
  ugcBenchmark: string;
  benchmarkCompliant: boolean;
  phdFacultyCount: number;
  phdFacultyPercentage: number;
  mentorMenteeRatio: string;
  departmentRatios: DepartmentFacultyRatio[];
  facultyRoster: FullTimeFacultyMember[];
  cohortBreakdown: CohortStudentCount[];
  fiveYearRatioTrend: StudentTeacherRatioTrendItem[];
}
