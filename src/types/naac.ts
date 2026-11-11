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

// ==========================================
// Metric 2.3.1: Student-Centric Pedagogy
// ==========================================

export type StudentCentricMethodType =
  | "Experiential Learning"
  | "Participative Learning"
  | "Problem Solving"
  | "Capstone & Field Studies";

export interface IndustrialVisitRecord {
  id: string;
  industryName: string;
  location: string;
  department: string;
  programme: string;
  visitDate: string;
  studentsCount: number;
  facultyCoordinators: string[];
  geoTaggedPhotoUrl: string;
  geoTagCoordinates: string;
  mouLinked: boolean;
  learningOutcomes: string;
  reportUrl: string;
}

export interface CapstoneProjectRecord {
  id: string;
  projectTitle: string;
  department: string;
  academicYear: string;
  studentTeam: string[];
  facultyGuide: string;
  industryMentor?: string;
  industryPartner?: string;
  problemStatement: string;
  prototypeUrl?: string;
  githubOrRepoUrl?: string;
  domain: string;
}

export interface ParticipativeLearningActivity {
  id: string;
  activityTitle: string;
  methodType: StudentCentricMethodType;
  department: string;
  date: string;
  participantsCount: number;
  description: string;
  outcomes: string;
}

export interface StudentCentricPedagogyData {
  academicYear: string;
  totalIndustrialVisits: number;
  totalParticipativeActivities: number;
  totalCapstones: number;
  studentsBenefittedCount: number;
  industrialVisits: IndustrialVisitRecord[];
  capstoneProjects: CapstoneProjectRecord[];
  participativeActivities: ParticipativeLearningActivity[];
  geoTaggedCompendiumUrl: string;
}

// ==========================================
// Metric 2.3.2: ICT-Enabled Classrooms & LMS
// ==========================================

export type IctRoomType =
  | "Smart Classroom"
  | "Seminar Hall"
  | "Virtual Lab / Studio"
  | "Auditorium";

export interface IctRoomInventoryItem {
  id: string;
  roomNumber: string;
  blockOrBuilding: string;
  floor: string;
  roomType: IctRoomType;
  seatingCapacity: number;
  hasInteractivePanel: boolean;
  hasProjector: boolean;
  hasHighSpeedWifi: boolean;
  hasAudioSystem: boolean;
  hasLectureCapture: boolean;
  departmentAllocated: string;
  isLmsConnected: boolean;
  photoUrl: string;
}

export interface LmsCourseUsageStat {
  courseCode: string;
  courseTitle: string;
  department: string;
  facultyName: string;
  enrolledStudents: number;
  uploadedResourcesCount: number;
  quizzesCount: number;
  assignmentsSubmitted: number;
  averageStudentLoginsPerWeek: number;
  lastActivityDate: string;
}

export interface DigitalLearningResource {
  name: string;
  type: string;
  provider: string;
  accessUrl: string;
  activeUsersCount: number;
  status: "Subscribed" | "Institutional Membership" | "Open Access";
}

export interface IctClassroomLmsData {
  academicYear: string;
  totalClassroomsAndHalls: number;
  ictEnabledCount: number;
  ictPercentage: number;
  lmsActiveCourses: number;
  lmsActiveTeachers: number;
  lmsActiveStudents: number;
  flippedClassroomModulesCount: number;
  rooms: IctRoomInventoryItem[];
  lmsCourses: LmsCourseUsageStat[];
  digitalResources: DigitalLearningResource[];
}

// ==========================================
// Metric 2.5.1: Continuous Internal Evaluation (CIE) Transparency
// ==========================================

export interface CieAssessmentSchedule {
  id: string;
  semester: string;
  programType: "UG" | "PG";
  academicYear: string;
  assessmentName: string; // e.g. "Internal Assessment I", "Mid-Semester Examination", "Internal Assessment II", "Lab Practical Viva"
  syllabusNotificationDate: string;
  timetableNotificationDate: string;
  examStartDate: string;
  examEndDate: string;
  marksDisplayDate: string;
  grievanceSubmissionDeadline: string;
  parentNotificationDate: string;
  status: "Scheduled" | "Conducted" | "Evaluated" | "Marks Finalized";
}

export type CieGrievanceStatus = "Resolved" | "Under Review" | "Escalated";

export interface CieGrievanceRecord {
  id: string;
  grievanceCode: string;
  filingDate: string;
  studentId: string;
  studentName: string;
  programme: string;
  semester: string;
  courseCode: string;
  courseName: string;
  evaluatorName: string;
  grievanceType: "Totaling Error" | "Unchecked Question" | "Evaluation Discrepancy" | "Missing Marks" | "Attendance/Eligibility";
  originalMarks: number;
  revisedMarks: number;
  tier: "Tier 1: Course Faculty" | "Tier 2: Head of Department" | "Tier 3: College Exam Committee";
  resolutionDate: string;
  turnaroundDays: number;
  resolutionRemarks: string;
  status: CieGrievanceStatus;
}

export interface CieEvaluationData {
  academicYear: string;
  totalAssessmentsConducted: number;
  totalEvaluatedScripts: number;
  totalGrievancesReceived: number;
  totalGrievancesResolved: number;
  resolutionRate: number; // e.g. 100%
  averageResolutionDays: number; // e.g. 3.2 days
  schedules: CieAssessmentSchedule[];
  grievances: CieGrievanceRecord[];
  transparencyMeasures: {
    measure: string;
    description: string;
    frequency: string;
    complianceStatus: "Compliant" | "Audit Verified";
  }[];
}

// ==========================================
// Metric 2.6.3: Student Pass Percentage & Attainment
// ==========================================

export interface ProgrammePassRecord {
  id: string;
  programmeCode: string;
  programmeName: string;
  degreeLevel: "Undergraduate" | "Postgraduate";
  department: string;
  eligibleAppeared: number;
  studentsPassed: number;
  passPercentage: number;
  distinctionCount: number;
  firstClassCount: number;
  secondClassCount: number;
  universityRankHoldersCount: number;
}

export interface PoCoAttainmentRecord {
  programmeCode: string;
  programmeName: string;
  directAttainment: number; // out of 3.0
  indirectAttainment: number; // out of 3.0
  overallAttainment: number; // weighted: 80% direct + 20% indirect
  targetLevel: number;
  attainmentPercentage: number;
  benchmarkMet: boolean;
}

export interface PassPercentageData {
  academicYear: string;
  totalAppeared: number;
  totalPassed: number;
  overallPassPercentage: number; // e.g. 92.8%
  universityGoldMedalists: number;
  topRankHoldersCount: number;
  averagePoCoAttainment: number; // e.g. 2.68 / 3.0
  programmes: ProgrammePassRecord[];
  attainmentRecords: PoCoAttainmentRecord[];
}

// ==========================================
// Metric 2.7.1: Online Student Satisfaction Survey (SSS)
// ==========================================

export interface SssQuestionItem {
  id: number;
  questionNumber: string;
  questionText: string;
  category: "Curriculum & Teaching" | "Evaluation & Feedback" | "Mentoring & Guidance" | "Skills & Competencies" | "Institutional Environment";
  averageScore: number; // out of 4.00
  percentageSatisfaction: number;
  distribution: {
    score4: number; // percentage
    score3: number;
    score2: number;
    score1: number;
    score0: number;
  };
}

export interface SssSurveyData {
  academicYear: string;
  surveyPlatform: string;
  totalEligibleStudents: number;
  totalResponsesReceived: number;
  responseRatePercentage: number; // e.g. 85.2%
  overallSatisfactionIndex: number; // e.g. 3.78 out of 4.00
  overallSatisfactionPercentage: number; // e.g. 94.5%
  categoryAverages: {
    category: string;
    averageScore: number;
    percentage: number;
  }[];
  questions: SssQuestionItem[];
  keyStrengths: string[];
  actionTakenItems: {
    areaOfImprovement: string;
    studentFeedbackSummary: string;
    actionTakenByIqac: string;
    implementedTimeline: string;
  }[];
}

// ==========================================
// Criterion 3 Metrics: Research, Innovation & Extension
// ==========================================

// Metric 3.1.1: Grants & Mobilization for Research
export interface ResearchGrantRecord {
  id: string;
  projectCode: string;
  projectTitle: string;
  principalInvestigator: string;
  piDepartment: string;
  coInvestigator?: string;
  fundingAgency: string;
  agencyType: "Government (Central/State)" | "Non-Government / Corporate" | "Statutory Body";
  sanctionOrderNumber: string;
  sanctionDate: string;
  durationMonths: number;
  sanctionedAmountLakhs: number;
  receivedAmountLakhs: number;
  status: "Ongoing" | "Completed" | "Sanctioned";
  utilizationCertificateAudited: boolean;
  documentUrl: string;
}

export interface ResearchFundingData {
  academicYear: string;
  totalSanctionedAmountLakhs: number; // e.g. 142.50
  totalOngoingProjects: number;
  totalCompletedProjects: number;
  govtAgenciesCount: number;
  nonGovtAgenciesCount: number;
  auditedUcSubmissionRate: number; // 100%
  projects: ResearchGrantRecord[];
}

// Metric 3.2.1: Incubation, IPR & Patents
export interface PatentRecord {
  id: string;
  patentApplicationNumber: string;
  patentTitle: string;
  inventors: string[];
  department: string;
  filingDate: string;
  publicationDate?: string;
  grantDate?: string;
  jurisdiction: "Indian Patent Office (IPO)" | "International (PCT)";
  patentType: "Utility Patent" | "Design Patent";
  status: "Filed" | "Published" | "Granted" | "Under Examination";
  commercialized: boolean;
}

export interface StartupIncubationRecord {
  id: string;
  startupName: string;
  founders: string[];
  founderType: "Student" | "Alumni" | "Faculty-Led";
  incubationDate: string;
  sector: "Agritech" | "Healthtech & AI" | "Clean Energy" | "Biotech" | "EdTech" | "Smart IoT";
  seedGrantReceivedInr: number;
  annualTurnoverInr: number;
  jobsCreated: number;
  status: "Incubated" | "Graduated" | "Early Revenue";
}

export interface InnovationEcosystemData {
  academicYear: string;
  iicRating: string; // e.g. "4.5 / 5 Stars (Ministry of Education IIC)"
  totalPatents: number; // 8
  patentsGranted: number; // 2
  patentsPublished: number; // 3
  patentsFiled: number; // 3
  totalIncubatedStartups: number; // 6
  totalSeedCapitalDisbursedInr: number;
  patents: PatentRecord[];
  startups: StartupIncubationRecord[];
  iprWorkshopsCount: number;
}

// Metric 3.3.1: Scopus & UGC-CARE Publications
export interface ResearchPublicationRecord {
  id: string;
  paperTitle: string;
  authors: string[];
  primaryFacultyName: string;
  department: string;
  journalName: string;
  issnNumber: string;
  volumeIssuePages: string;
  publicationYear: number;
  indexing: ("Scopus" | "Web of Science" | "UGC-CARE Group I" | "PubMed")[];
  impactFactor: number;
  citationsCount: number;
  doi: string;
  doiUrl: string;
  linkToAbstract: string;
}

export interface PublicationsData {
  academicYear: string;
  totalPublications: number; // 68
  scopusIndexedCount: number;
  webOfScienceCount: number;
  ugcCareCount: number;
  averageImpactFactor: number;
  totalCitationsLatestYear: number;
  hIndexInstitutional: number;
  papersPerFaculty: number;
  publications: ResearchPublicationRecord[];
}

// Metric 3.3.2: Books, Book Chapters & Proceedings
export interface BookProceedingsRecord {
  id: string;
  title: string;
  workType: "Authored Book" | "Edited Book" | "Book Chapter" | "Conference Proceedings";
  authors: string[];
  primaryFacultyName: string;
  department: string;
  publisherName: string;
  isbnIssn: string;
  yearOfPublication: number;
  peerReviewed: boolean;
  conferenceDetails?: string;
  coverPageUrl: string;
}

export interface BooksProceedingsData {
  academicYear: string;
  totalBooksAndChapters: number; // 34
  authoredBooksCount: number;
  bookChaptersCount: number;
  conferenceProceedingsCount: number;
  items: BookProceedingsRecord[];
}

// Metric 3.5.1: Consultancy Services & Corporate MoUs
export interface ConsultancyProjectRecord {
  id: string;
  consultancyProjectTitle: string;
  clientOrganization: string;
  principalConsultant: string;
  department: string;
  startDate: string;
  completionDate: string;
  revenueGeneratedInr: number;
  revenueInLakhs: number;
  corporateMouRef: string;
  institutionalSharePercentage: number;
  status: "Completed" | "In Progress" | "Deliverables Submitted";
  auditedReceiptProofUrl: string;
}

export interface ConsultancyData {
  academicYear: string;
  totalProjects: number;
  totalRevenueInLakhs: number; // e.g. 28.40
  institutionalRevenueInLakhs: number;
  clientsCount: number;
  projects: ConsultancyProjectRecord[];
}

// Metric 3.6.1: Community Outreach & Extension
export interface CommunityOutreachRecord {
  id: string;
  activityName: string;
  organizingUnit: "NSS Unit I" | "NSS Unit II" | "NCC Army Wing" | "NCC Naval Wing" | "Youth Red Cross (YRC)" | "Eco Club";
  collaboratingAgency: string;
  targetCommunityOrLocation: string;
  activityDate: string;
  studentVolunteersCount: number;
  facultyCoordinators: string[];
  beneficiariesReached: number;
  latitude: number;
  longitude: number;
  geoTaggedPhotoUrl: string;
  activityBrief: string;
}

export interface ExtensionActivitiesData {
  academicYear: string;
  totalExtensionDrives: number; // 14
  totalStudentParticipants: number;
  totalBeneficiaries: number;
  awardsAndRecognitionsCount: number;
  drives: CommunityOutreachRecord[];
}

// Metric 3.7.1: Functional MoUs & Linkages
export interface FunctionalMouRecord {
  id: string;
  mouTitle: string;
  partnerInstitutionOrIndustry: string;
  category: "Academic / University" | "Research Laboratory" | "Corporate / Industry" | "Community / NGO";
  dateOfSigning: string;
  validityPeriod: string;
  validTill: string;
  nodalFacultyCoordinator: string;
  department: string;
  activeStatus: "Active" | "Renewed" | "Completed";
  activitiesCompletedCount: number;
  recentActivitiesSummary: string;
  mouDocumentUrl: string;
}

export interface MouLinkagesData {
  academicYear: string;
  totalActiveMous: number; // 16
  academicPartnerships: number;
  industryPartnerships: number;
  collaborativeActivitiesConducted: number;
  mous: FunctionalMouRecord[];
}

// ==========================================
// CRITERION 4 (INFRASTRUCTURE & LEARNING RESOURCES)
// ==========================================

// Metric 4.3.1: IT Facilities & Campus Wi-Fi Bandwidth
export interface WifiAccessPointRecord {
  id: string;
  zoneOrBlock: string;
  apModel: string;
  macAddress: string;
  ipAddress: string;
  dualBandSupport: boolean;
  maxCapacityClients: number;
  activeClients: number;
  status: "Online" | "Maintenance" | "Offline";
  downloadSpeedMbps: number;
  uploadSpeedMbps: number;
}

export interface ComputerLabAssetRecord {
  id: string;
  labName: string;
  location: string;
  totalWorkstations: number;
  processorSpecs: string;
  ramGb: number;
  storageType: string;
  osInstalled: string;
  studentToPcRatio: string;
  internetConnected: boolean;
  lanPortSpeed: string;
  primaryUsage: string;
}

export interface BandwidthBillRecord {
  id: string;
  billInvoiceNo: string;
  billingPeriod: string;
  ispProvider: string;
  speedContracted: string; // "1 Gbps Leased Line (1:1 Uncompressed)"
  monthlyRentalInr: number;
  paymentStatus: "Paid" | "Pending";
  receiptUrl: string;
  uptimeSlaPercentage: number;
}

export interface ItFacilityData {
  academicYear: string;
  internetBandwidthMbps: number; // 1000 (1 Gbps)
  ispProvider: string;
  totalComputersForStudents: number; // 540
  totalEnrolledStudents: number; // 2160
  studentToComputerRatio: string; // "4:1"
  totalWifiAccessPoints: number; // 48
  totalLanNodes: number; // 620
  serverRoomRackSpecs: string;
  labs: ComputerLabAssetRecord[];
  accessPoints: WifiAccessPointRecord[];
  bandwidthBills: BandwidthBillRecord[];
}

// Metric 4.4.1: Infrastructure Maintenance & Expenditure
export interface AmcContractRecord {
  id: string;
  facilityType: "IT Equipment & Networking" | "Air Conditioning & HVAC" | "Electrical & Diesel Generator" | "Water Treatment & RO" | "Civil & Structural Maintenance" | "Campus Fire Safety Systems";
  vendorName: string;
  contractNumber: string;
  scopeOfWork: string;
  startDate: string;
  endDate: string;
  annualContractValueLakhs: number;
  paymentTerms: string;
  contactPerson: string;
  status: "Active" | "Under Renewal" | "Completed";
}

export interface MaintenanceExpenditureCategory {
  categoryName: string;
  allocatedBudgetLakhs: number;
  auditedExpenditureLakhs: number;
  percentageUtilized: number;
  voucherHead: string;
}

export interface MaintenanceExpenditureData {
  academicYear: string;
  totalMaintenanceBudgetLakhs: number; // 52.00
  totalAuditedExpenditureLakhs: number; // 48.75
  totalInstitutionalBudgetExcludingSalaryLakhs: number; // 128.50
  maintenancePercentage: number; // 37.94%
  amcContracts: AmcContractRecord[];
  categories: MaintenanceExpenditureCategory[];
  auditedStatementsUrl: string;
}

// ==========================================
// CRITERION 5 (STUDENT SUPPORT & PROGRESSION)
// ==========================================

// Metric 5.1.1: Scholarships & Freeships Beneficiaries
export interface ScholarshipBeneficiaryRecord {
  id: string;
  rollNo: string;
  studentName: string;
  programme: string;
  category: "SC" | "ST" | "OBC / SEBC" | "General (EWS)" | "Merit / Institutional";
  scholarshipScheme: string;
  sanctionAuthority: string;
  amountPerYear: number;
  disbursalDate: string;
  bankReferenceOrTransactionId: string;
  verificationStatus: "Disbursed" | "Approved" | "Under Audit";
}

export interface ScholarshipSchemeSummary {
  schemeName: string;
  providerType: "Government State" | "Government Central" | "Institutional Freeship" | "Corporate Endowment";
  beneficiariesCount: number;
  totalDisbursedLakhs: number;
}

export interface ScholarshipData {
  academicYear: string;
  totalStudentsEnrolled: number; // 2160
  totalBeneficiaries: number; // 1473 (68.2%)
  coveragePercentage: number; // 68.19%
  totalFinancialAidLakhs: number; // 142.80
  schemes: ScholarshipSchemeSummary[];
  beneficiaries: ScholarshipBeneficiaryRecord[];
}

// Metric 5.1.2: Capacity Building & Skills Development
export interface SkillProgrammeRecord {
  id: string;
  programmeTitle: string;
  capabilityType: "Soft Skills" | "Language & Communication" | "Life Skills (Yoga/Wellness)" | "ICT / Computing Skills";
  organizingDepartment: string;
  agencyOrTrainer: string;
  startDate: string;
  endDate: string;
  durationHours: number;
  enrolledStudentsCount: number;
  certificatesIssuedCount: number;
  outcomeSummary: string;
  reportUrl: string;
}

export interface SkillEnhancementData {
  academicYear: string;
  totalProgrammesConducted: number; // 12
  totalBenefitedStudents: number; // 1860
  languageLabWorkstationsCount: number; // 60
  yogaCertifiedTrainers: number; // 4
  programmes: SkillProgrammeRecord[];
}

// Metric 5.1.3: Competitive Exams Guidance & Counseling
export interface CoachingSessionRecord {
  id: string;
  examTrack: "GATE Engineering" | "CAT / XAT Management" | "GRE / TOEFL Overseas" | "UPSC / State Civil Services";
  courseTitle: string;
  coordinatingFaculty: string;
  externalAgency: string;
  studentsEnrolled: number;
  durationMonths: number;
  mockTestsConducted: number;
  qualifiedStudentsCount: number;
  attendanceRegisterUrl: string;
}

export interface ExamQualifierRecord {
  id: string;
  rollNo: string;
  studentName: string;
  examName: string;
  allIndiaRankOrScore: string;
  percentile: string;
  qualifiedYear: string;
  department: string;
  proofDocumentUrl: string;
}

export interface CompetitiveExamGuidanceData {
  academicYear: string;
  totalStudentsTrained: number; // 640
  totalStudentsQualified: number; // 86
  programmesConducted: number; // 6
  topGateRank: string; // "AIR 142 (Computer Science)"
  sessions: CoachingSessionRecord[];
  qualifiers: ExamQualifierRecord[];
}

// Metric 5.2.1: Placements & Higher Education Progression
export interface PlacementOfferRecord {
  id: string;
  rollNo: string;
  studentName: string;
  programme: string;
  companyName: string;
  jobRole: string;
  ctcLakhsPerAnnum: number;
  offerDate: string;
  appointmentLetterRef: string;
  driveType: "On-Campus" | "Off-Campus" | "Joint Campus";
}

export interface HigherStudiesAdmitRecord {
  id: string;
  rollNo: string;
  studentName: string;
  undergraduateProgramme: string;
  admittedInstitution: string;
  programmeEnrolled: string;
  examQualified: string;
  admissionLetterRef: string;
}

export interface PlacementProgressionData {
  academicYear: string;
  totalGraduatingStudents: number; // 560
  totalCampusOffers: number; // 428 (420+)
  uniqueStudentsPlaced: number; // 342
  higherEducationProgressionCount: number; // 86
  totalPlacementProgressionPercentage: number; // 76.4%
  highestCtcLpa: number; // 14.50
  averageCtcLpa: number; // 6.25
  topRecruitersCount: number; // 38
  offers: PlacementOfferRecord[];
  higherStudies: HigherStudiesAdmitRecord[];
}

// Metric 5.4.1: Alumni Association & Chapter Activities
export interface AlumniProfileRecord {
  id: string;
  name: string;
  batchYear: string;
  degree: string;
  currentOrganization: string;
  designation: string;
  location: string;
  chapter: "Bhubaneswar Central" | "Bengaluru Chapter" | "Hyderabad Chapter" | "Delhi-NCR Chapter" | "North America Chapter";
  contributionType: "Financial (Endowment)" | "Mentorship & Guest Lectures" | "Placement & Internship Referrals" | "Book & Lab Equipment Donation" | "Executive Office Bearer";
  financialContributionInr: number;
  linkedinUrl: string;
  isVerified: boolean;
}

export interface AlumniChapterMeetingRecord {
  id: string;
  meetingTitle: string;
  meetingDate: string;
  chapter: string;
  venueOrMode: "Hybrid (Campus Auditorium & Zoom)" | "In-Person (Hotel Mayfair)" | "Virtual Google Meet" | "In-Person (Bengaluru Club)";
  attendeesCount: number;
  agendaHighlights: string;
  minutesOfMeetingUrl: string;
}

export interface AlumniContributionCategory {
  categoryName: string;
  totalAmountLakhs: number;
  beneficiaryDepartmentOrFund: string;
  description: string;
  voucherRef: string;
}

export interface AlumniAssociationData {
  academicYear: string;
  associationName: string;
  registrationNumber: string; // "Regn No. 4412/2014-15 under Societies Registration Act XXI of 1860"
  registrationDate: string;
  presidentName: string;
  secretaryName: string;
  totalRegisteredAlumni: number; // 4850
  totalFinancialContributionLakhs: number; // 24.50
  activeChaptersCount: number; // 5
  mentorshipSessionsConducted: number; // 18
  alumniProfiles: AlumniProfileRecord[];
  meetings: AlumniChapterMeetingRecord[];
  financialContributions: AlumniContributionCategory[];
}

// ==========================================
// CRITERION 6 (GOVERNANCE, LEADERSHIP & MANAGEMENT)
// ==========================================

// Metric 6.1.1: Strategic Planning & Deployment
export interface StrategicGoalRecord {
  id: string;
  goalNumber: string;
  pillar: "Academic Excellence" | "Research & Innovation" | "Infrastructure & Green Campus" | "Industry Linkage & Placements" | "Global Outreach & Governance";
  targetDescription: string;
  tenYearHorizon: string; // "2020-2030"
  baseline2020: string;
  target2030: string;
  currentProgress2025: string;
  achievementPercentage: number;
  nodalOfficer: string;
  status: "Completed Ahead of Target" | "On Track" | "In Progress";
}

export interface GovernanceCommitteeRecord {
  id: string;
  committeeName: string;
  chairperson: string;
  frequencyOfMeetings: string;
  facultyMembersCount: number;
  studentRepresentativesCount: number;
  externalExpertsCount: number;
  primaryMandate: string;
  recentMeetingDate: string;
}

export interface StrategicPlanData {
  academicYear: string;
  planTitle: string; // "EduPlatform Strategic Perspective Plan (2020–2030)"
  deploymentPeriod: string; // "2020 - 2030"
  totalPillarsCount: number;
  overallMilestoneAchievementPercentage: number; // e.g. 84.5%
  organogramDocumentUrl: string;
  strategicPlanPdfUrl: string;
  goals: StrategicGoalRecord[];
  committees: GovernanceCommitteeRecord[];
}

// Metric 6.2.2: E-Governance Across Operational Domains
export interface EGovernancePillarRecord {
  id: string;
  domainName: "Administration" | "Finance & Accounts" | "Student Admission & Support" | "Examination";
  domain?: string;
  softwareModuleName: string;
  implementationYear: string;
  annualActiveUsers: number;
  cloudHostOrServer: string;
  keyFeatures: string[];
  auditStatus: "Fully Digitized & Verified" | "Operational";
  uptimePercentage: number;
}

export interface ErpModuleAuditRecord {
  id: string;
  moduleCode: string;
  domain: string;
  systemName: string;
  lastSecurityAuditDate: string;
  auditingAgency: string;
  complianceRating: string;
  dailyActiveTransactions: number;
  evidenceScreenshotUrl: string;
}

export interface EGovernanceData {
  academicYear: string;
  erpProvider: string;
  totalDesignatedDomainsOperational: number; // 4 of 4
  totalActiveUsersCount: number;
  totalDailyDigitalTransactions: number;
  pillars: EGovernancePillarRecord[];
  auditLogs: ErpModuleAuditRecord[];
}

// Metric 6.3.1: Staff Development & Seed Grants
export interface SeedGrantRecord {
  id: string;
  grantCode: string;
  facultyName: string;
  department: string;
  projectTitle: string;
  sanctionDate: string;
  grantAmountInr: number;
  completionStatus: "Completed" | "Ongoing";
  deliverablesOutcome: string;
  sanctionOrderUrl: string;
}

export interface FdpSponsorshipRecord {
  id: string;
  facultyName: string;
  department: string;
  programmeType: "Conference Travel Support" | "National/International FDP" | "Professional Body Membership" | "Workshop / NPTEL";
  eventTitle: string;
  organizingBody: string;
  amountReimbursedInr: number;
  eventDates: string;
  certificateVerified: boolean;
}

export interface FacultyAppraisalRecord {
  id: string;
  facultyName: string;
  designation: string;
  department: string;
  academicYear: string;
  pbasScoreApi: number;
  hodRecommendation: "Outstanding" | "Very Good" | "Good";
  appraisalFormVerified: boolean;
}

export interface FacultyEmpowermentData {
  academicYear: string;
  totalSeedGrantsLakhs: number; // 18.50
  totalFacultyBenefitedSeedGrants: number;
  totalTravelConferenceSupportLakhs: number; // 8.20
  totalFacultySponsoredFdp: number;
  totalAppraisalsProcessed: number;
  seedGrants: SeedGrantRecord[];
  fdpSponsorships: FdpSponsorshipRecord[];
  appraisals: FacultyAppraisalRecord[];
}

// Metric 6.4.1: Budget Allocation, Utilization & Audits
export interface FinancialAuditRecord {
  id: string;
  auditType: "External Statutory Audit" | "Internal Audit Committee" | "Government Audit (CAG / AG)";
  financialYear: string;
  auditorFirmName: string;
  caMembershipOrUdin: string;
  completionDate: string;
  auditRemarks: string;
  auditReportUrl: string;
  complianceStatus: "Unqualified (Clean Opinion)" | "Complied & Closed";
}

export interface BudgetAllocationRecord {
  headCategory: string;
  allocatedBudgetLakhs: number;
  utilizedExpenditureLakhs: number;
  utilizationPercentage: number;
  academicYear: string;
  accountingVoucherSeries: string;
}

export interface AuditedBalanceSheetData {
  financialYear: string;
  totalInstitutionalBudgetLakhs: number; // 385.00
  totalAuditedExpenditureLakhs: number; // 362.40
  academicExpenditureLakhs: number;
  physicalInfrastructureExpenditureLakhs: number;
  overallUtilizationPercentage: number; // 94.13%
  audits: FinancialAuditRecord[];
  budgetBreakdown: BudgetAllocationRecord[];
}

// ==========================================
// CRITERION 7 (INSTITUTIONAL VALUES & BEST PRACTICES)
// ==========================================

// Metric 7.1.1: Gender Equity Promotion & Safety Facilities
export interface GenderSafetyFacilityRecord {
  id: string;
  facilityName: string;
  category: "Safety & Security (CCTV / Security)" | "Counseling & Redressal (ICC / Cell)" | "Common Rooms" | "Day Care Center for Staff/Students" | "Sanitary Hygiene / Health";
  location: string;
  capacityOrCoverage: string;
  operatingHours: string;
  inChargePersonnel: string;
  geoTaggedPhotoUrl: string;
}

export interface GenderSensitizationEventRecord {
  id: string;
  eventTitle: string;
  dateConducted: string;
  organizingBody: string;
  resourcePerson: string;
  participantsCount: number;
  summaryImpact: string;
  eventReportUrl: string;
}

export interface GenderEquityData {
  academicYear: string;
  totalCctvCamerasActive: number; // 148
  securityGuardsRoundTheClock: number; // 24
  dayCareChildrenEnrolled: number; // 18
  iccComplaintsReceived: number; // 1
  iccComplaintsRedressed: number; // 1 (100%)
  genderAuditRating: string; // "Grade A+ (Gender Friendly Campus)"
  facilities: GenderSafetyFacilityRecord[];
  sensitizationEvents: GenderSensitizationEventRecord[];
}

// Metric 7.1.2: Renewable Energy & Conservation
export interface SolarEnergyGenerationRecord {
  id: string;
  billingMonth: string;
  solarGenerationUnitsKwh: number;
  campusConsumptionKwh: number;
  wheeledToGridKwh: number;
  netMeteringBillInr: number;
  co2SavedTonnes: number;
  billPdfUrl: string;
}

export interface EnergyConservationInitiativeRecord {
  id: string;
  initiativeName: string;
  type: "120 kW Rooftop Solar PV Grid" | "Sensor-Based Lighting & Climate Control" | "100% LED Campus Retrofitting" | "Biogas Plant (Hostel Food Waste)";
  capacityOrRating: string;
  annualEnergySavedKwh: number;
  annualFinancialSavingsLakhs: number;
  vendorOrInstallationAgency: string;
}

export interface RenewableEnergyData {
  academicYear: string;
  solarGridCapacityKw: number; // 120 kW
  annualSolarGenerationUnits: number; // 156,000 kWh
  campusRenewablePowerSharePercentage: number; // 42.5%
  totalAnnualCo2MitigatedTonnes: number; // 128 tonnes
  annualEnergyCostSavingsLakhs: number; // 12.80
  initiatives: EnergyConservationInitiativeRecord[];
  generationMonthlyLogs: SolarEnergyGenerationRecord[];
}

// Metric 7.1.3: Waste Management & Water Conservation
export interface WasteManagementFacilityRecord {
  id: string;
  wasteType: "Solid Waste Management (Composting)" | "Liquid Waste Treatment (STP / Greywater)" | "Biomedical Waste Management" | "E-Waste Recycling & Buyback" | "Hazardous Chemical Neutralization";
  facilityName: string;
  dailyCapacity: string;
  disposalOrRecyclingProtocol: string;
  mouPartnerOrVendor: string;
  inspectionCertificateRef: string;
}

export interface RainwaterHarvestingRecord {
  id: string;
  unitLocation: string;
  catchmentAreaSqM: number;
  storageCapacityLitres: number;
  rechargeBorewellsCount: number;
  filtrationStages: string;
  geoTaggedPhotoUrl: string;
}

export interface EnvironmentalAuditData {
  academicYear: string;
  totalRainwaterCapacityLitres: number; // 450,000 L (4.5 Lakh L)
  stpPlantCapacityKld: number; // 100 KLD
  annualCompostGeneratedKg: number; // 8,200 kg
  greenAuditCertification: string; // "ISO 14001:2015 & Platinum Green Campus"
  auditAgency: string; // "Bureau of Energy & Environmental Audits"
  wasteFacilities: WasteManagementFacilityRecord[];
  rainwaterUnits: RainwaterHarvestingRecord[];
}

// Metric 7.1.7: Divyangjan Barrier-Free Facilities
export interface DivyangjanFacilityRecord {
  id: string;
  facilityCategory: "Built Environment with Ramps / Lifts" | "Divyangjan-Friendly Washrooms" | "Illuminated Signage & Tactile Paths" | "Assistive Software & Reading Facilities" | "Barrier-Free Vehicle Accessibility";
  facilityName: string;
  buildingLocation: string;
  technicalSpecs: string;
  geoTaggedPhotoUrl: string;
  complianceStandard: "Harmonized Guidelines & CPWD Norms";
}

export interface AssistiveTechnologyRecord {
  id: string;
  softwareOrToolName: string;
  type: "Screen Reading Software (NVDA / JAWS)" | "Braille Signage & Tactile Display" | "Magnification Equipment" | "Audiobook Recording & Kiosk";
  workstationsConfigured: number;
  location: string;
  licenseDetails: string;
}

export interface DivyangjanInclusionData {
  academicYear: string;
  totalRampsWithHandrailsCount: number; // 14
  brailleElevatorsCount: number; // 4
  dedicatedDisabledWashroomsCount: number; // 8
  screenReaderWorkstationsCount: number; // 12
  tactilePavingLengthMeters: number; // 850 meters
  facilities: DivyangjanFacilityRecord[];
  assistiveTools: AssistiveTechnologyRecord[];
}

