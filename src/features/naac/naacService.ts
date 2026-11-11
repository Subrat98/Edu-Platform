import { mockRequest } from "@/mocks/api/client";
import {
  initialAccreditationCycles,
  initialNaacCriteria,
  initialNaacEvidence,
  initialIqacMembers,
  initialIqacMeetings,
  initialIqacActivities,
  initialIqacActionTaken,
  initialAqarRecords,
  initialSsrRecord,
  initialFeedbackSummaries,
  initialFeedbackRecords,
  initialBestPractices,
  initialInstitutionalDistinctiveness,
  initialNaacTasks,
  initialNaacApprovals,
  initialNaacAuditLogs,
  initialAcademicCouncilMeetings,
  initialSemesterCalendars,
  initialProgrammeSyllabusStructures,
  initialLessonPlanAdherence,
  initialFiveYearSummaries,
  initialBosMeetings,
  initialProgrammeRevisions,
  initialComparativeSyllabusItems,
  initialUniversityNotifications,
  initialCbcsProgrammes,
  initialElectiveCourseOptions,
  initialValueAddedCourses,
  initialValueAddedEnrolmentSummaries,
  initialStudentCertificates,
  initialCrosscuttingCourseMappings,
  initialCrosscuttingActivities,
  initialEnrolmentYearRecords,
  initialProgrammeEnrolmentRecords,
  initialDepartmentFacultyRatios,
  initialFacultyRoster,
  initialCohortBreakdown,
  initialFiveYearRatioTrend,
  initialIndustrialVisits,
  initialCapstoneProjects,
  initialParticipativeActivities,
  initialIctRoomInventory,
  initialLmsCourseUsage,
  initialDigitalResources,
  MOCK_CIE_EVALUATION_DATA,
  MOCK_PASS_PERCENTAGE_DATA,
  MOCK_SSS_SURVEY_DATA,
  MOCK_RESEARCH_FUNDING_DATA,
  MOCK_INNOVATION_ECOSYSTEM_DATA,
  MOCK_PUBLICATIONS_DATA,
  MOCK_BOOKS_PROCEEDINGS_DATA,
  MOCK_CONSULTANCY_DATA,
  MOCK_EXTENSION_ACTIVITIES_DATA,
  MOCK_MOU_LINKAGES_DATA,
  MOCK_IT_FACILITY_DATA,
  MOCK_MAINTENANCE_EXPENDITURE_DATA,
  MOCK_SCHOLARSHIP_DATA,
  MOCK_SKILL_ENHANCEMENT_DATA,
  MOCK_CAREER_GUIDANCE_DATA,
  MOCK_STUDENT_PROGRESSION_DATA,
  MOCK_ALUMNI_ASSOCIATION_DATA,
  MOCK_STRATEGIC_PLAN_DATA,
  MOCK_EGOVERNANCE_DATA,
  MOCK_FACULTY_EMPOWERMENT_DATA,
  MOCK_FINANCIAL_AUDITS_DATA,
  MOCK_GENDER_EQUITY_DATA,
  MOCK_RENEWABLE_ENERGY_DATA,
  MOCK_ENVIRONMENT_MANAGEMENT_DATA,
  MOCK_DIVYANGJAN_FACILITIES_DATA,
} from "@/mocks/data/naac";
import type {
  AccreditationCycle,
  NaacCriterion,
  NaacCriterionId,
  NaacMetric,
  NaacEvidenceDocument,
  EvidenceStatus,
  IqacCommitteeMember,
  IqacMeeting,
  IqacActivity,
  IqacActionTaken,
  AqarRecord,
  AqarStatus,
  SsrRecord,
  StakeholderFeedbackSummary,
  NaacFeedbackRecord,
  BestPracticeItem,
  InstitutionalDistinctivenessItem,
  NaacTask,
  TaskStatus,
  NaacApproval,
  NaacAuditLog,
  AcademicCouncilMeeting,
  SemesterAcademicCalendar,
  ProgrammeSyllabusStructure,
  LessonPlanAdherence,
  CurriculumPlanningData,
  BoardOfStudiesMeeting,
  ProgrammeRevisionRecord,
  ComparativeSyllabusItem,
  FiveYearRevisionSummary,
  CurriculumRevisionData,
  CbcsProgrammeRecord,
  UniversityNotification,
  ElectiveCourseOption,
  CbcsSummaryData,
  ValueAddedCourse,
  ValueAddedEnrolmentSummary,
  StudentCertificateRecord,
  ValueAddedCoursesData,
  CrosscuttingCourseMapping,
  CrosscuttingCoCurricularActivity,
  CrosscuttingSummaryData,
  EnrolmentYearRecord,
  ProgrammeEnrolmentRecord,
  StudentProfileEnrolmentData,
  DepartmentFacultyRatio,
  FullTimeFacultyMember,
  CohortStudentCount,
  StudentTeacherRatioData,
  StudentCentricMethodType,
  IndustrialVisitRecord,
  CapstoneProjectRecord,
  ParticipativeLearningActivity,
  StudentCentricPedagogyData,
  IctRoomType,
  IctRoomInventoryItem,
  LmsCourseUsageStat,
  DigitalLearningResource,
  IctClassroomLmsData,
  CieAssessmentSchedule,
  CieGrievanceRecord,
  CieEvaluationData,
  ProgrammePassRecord,
  PoCoAttainmentRecord,
  PassPercentageData,
  SssQuestionItem,
  SssSurveyData,
  ResearchGrantRecord,
  ResearchFundingData,
  PatentRecord,
  StartupIncubationRecord,
  InnovationEcosystemData,
  ResearchPublicationRecord,
  PublicationsData,
  BookProceedingsRecord,
  BooksProceedingsData,
  ConsultancyProjectRecord,
  ConsultancyData,
  CommunityOutreachRecord,
  ExtensionActivitiesData,
  FunctionalMouRecord,
  MouLinkagesData,
  ItFacilityData,
  ComputerLabAssetRecord,
  WifiAccessPointRecord,
  BandwidthBillRecord,
  MaintenanceExpenditureData,
  AmcContractRecord,
  MaintenanceExpenditureCategory,
  ScholarshipData,
  ScholarshipBeneficiaryRecord,
  ScholarshipSchemeSummary,
  SkillEnhancementData,
  SkillProgrammeRecord,
  CompetitiveExamGuidanceData,
  CoachingSessionRecord,
  ExamQualifierRecord,
  PlacementProgressionData,
  PlacementOfferRecord,
  HigherStudiesAdmitRecord,
  AlumniAssociationData,
  AlumniProfileRecord,
  AlumniChapterMeetingRecord,
  AlumniContributionCategory,
  StrategicPlanData,
  StrategicGoalRecord,
  GovernanceCommitteeRecord,
  EGovernanceData,
  EGovernancePillarRecord,
  ErpModuleAuditRecord,
  FacultyEmpowermentData,
  SeedGrantRecord,
  FdpSponsorshipRecord,
  FacultyAppraisalRecord,
  AuditedBalanceSheetData,
  FinancialAuditRecord,
  BudgetAllocationRecord,
  GenderEquityData,
  GenderSafetyFacilityRecord,
  GenderSensitizationEventRecord,
  RenewableEnergyData,
  SolarEnergyGenerationRecord,
  EnergyConservationInitiativeRecord,
  EnvironmentalAuditData,
  WasteManagementFacilityRecord,
  RainwaterHarvestingRecord,
  DivyangjanInclusionData,
  DivyangjanFacilityRecord,
  AssistiveTechnologyRecord,
} from "@/types";

let accreditationCycles = [...initialAccreditationCycles];
let criteria = [...initialNaacCriteria];
let evidenceList = [...initialNaacEvidence];
let iqacMembers = [...initialIqacMembers];
let iqacMeetings = [...initialIqacMeetings];
let iqacActivities = [...initialIqacActivities];
let iqacActionTaken = [...initialIqacActionTaken];
let aqarRecords = [...initialAqarRecords];
let ssrRecord = { ...initialSsrRecord };
let feedbackSummaries = [...initialFeedbackSummaries];
let feedbackRecords = [...initialFeedbackRecords];
let bestPractices = [...initialBestPractices];
let institutionalDistinctiveness = { ...initialInstitutionalDistinctiveness };
let tasks = [...initialNaacTasks];
let approvals = [...initialNaacApprovals];
let auditLogs = [...initialNaacAuditLogs];
let councilMeetings = [...initialAcademicCouncilMeetings];
let semesterCalendars = [...initialSemesterCalendars];
let syllabusStructures = [...initialProgrammeSyllabusStructures];
let lessonPlanAdherence = [...initialLessonPlanAdherence];
let fiveYearSummaries = [...initialFiveYearSummaries];
let bosMeetings = [...initialBosMeetings];
let programmeRevisions = [...initialProgrammeRevisions];
let comparativeSyllabusItems = [...initialComparativeSyllabusItems];
let cbcsProgrammes = [...initialCbcsProgrammes];
let universityNotifications = [...initialUniversityNotifications];
let electiveCourses = [...initialElectiveCourseOptions];
let valueAddedCourses = [...initialValueAddedCourses];
let valueAddedEnrolmentSummaries = [...initialValueAddedEnrolmentSummaries];
let studentCertificates = [...initialStudentCertificates];
let crosscuttingMappings = [...initialCrosscuttingCourseMappings];
let crosscuttingActivities = [...initialCrosscuttingActivities];
let enrolmentYearRecords = [...initialEnrolmentYearRecords];
let programmeEnrolmentRecords = [...initialProgrammeEnrolmentRecords];
let facultyRoster = [...initialFacultyRoster];
let departmentRatios = [...initialDepartmentFacultyRatios];
let cohortBreakdown = [...initialCohortBreakdown];
let industrialVisits = [...initialIndustrialVisits];
let capstoneProjects = [...initialCapstoneProjects];
let participativeActivities = [...initialParticipativeActivities];
let ictRooms = [...initialIctRoomInventory];
let lmsCourses = [...initialLmsCourseUsage];
let digitalResources = [...initialDigitalResources];

function logAudit(
  actorName: string,
  actorRole: string,
  module: string,
  action: NaacAuditLog["action"],
  entityTitle: string,
  previousValue?: string,
  newValue?: string,
  remarks?: string
) {
  const newLog: NaacAuditLog = {
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
    actorName,
    actorRole,
    module,
    action,
    entityTitle,
    previousValue,
    newValue,
    remarks,
  };
  auditLogs.unshift(newLog);
}

export interface NaacDashboardStats {
  currentCycle: AccreditationCycle;
  ssrStatus: string;
  aqarStatus: string;
  overallCompletion: number;
  criterionProgress: {
    id: NaacCriterionId;
    criterionId: NaacCriterionId;
    name: string;
    percentage: number;
    score: number;
    weightage: number;
    weightedScore: number;
  }[];
  pendingEvidenceCount: number;
  unverifiedDocsCount: number;
  pendingApprovalsCount: number;
  upcomingDeadlinesCount: number;
  evidenceCompletionRate?: number;
  pendingVerificationCount?: number;
  recentActivities: IqacActivity[];
  recentAuditLogs: NaacAuditLog[];
}

export async function getNaacDashboardStats(): Promise<NaacDashboardStats> {
  return mockRequest(() => {
    const activeCycle = accreditationCycles.find((c) => c.status === "Accredited") ?? accreditationCycles[0];
    const totalCompletion = Math.round(
      criteria.reduce((acc, c) => acc + c.completionPercentage, 0) / criteria.length
    );

    const verifiedDocs = evidenceList.filter((e) => e.status === "Verified" || e.status === "Approved").length;
    const evidenceRate = Math.round((verifiedDocs / Math.max(evidenceList.length, 1)) * 100);

    return {
      currentCycle: activeCycle,
      ssrStatus: ssrRecord.status,
      aqarStatus: aqarRecords[0]?.status ?? "In Progress",
      overallCompletion: totalCompletion,
      criterionProgress: criteria.map((c) => {
        const weightage = c.weightage ?? 100;
        const weightedScore = c.weightedScore ?? Math.round(((c.score ?? 3.5) / 4) * weightage);
        return {
          id: c.id,
          criterionId: c.id,
          name: c.name,
          percentage: c.completionPercentage,
          score: c.score ?? 3.5,
          weightage,
          weightedScore,
        };
      }),
      pendingEvidenceCount: evidenceList.filter((e) => e.status === "Under Review" || e.status === "Draft").length,
      unverifiedDocsCount: evidenceList.filter((e) => e.status === "Uploaded").length,
      pendingVerificationCount: evidenceList.filter((e) => e.status === "Uploaded" || e.status === "Under Review").length,
      evidenceCompletionRate: evidenceRate,
      pendingApprovalsCount: approvals.filter((a) => a.status === "Pending").length,
      upcomingDeadlinesCount: tasks.filter((t) => t.status !== "Completed").length,
      recentActivities: iqacActivities.slice(0, 3),
      recentAuditLogs: auditLogs.slice(0, 6),
    };
  });
}

export async function getAccreditationCycles(): Promise<AccreditationCycle[]> {
  return mockRequest(() => [...accreditationCycles]);
}

export async function addAccreditationCycle(
  newCycle: Omit<AccreditationCycle, "id">,
  actor: { name: string; role: string }
): Promise<AccreditationCycle> {
  return mockRequest(() => {
    const item: AccreditationCycle = {
      ...newCycle,
      id: `cycle-${Date.now()}`,
    };
    accreditationCycles.unshift(item);
    logAudit(actor.name, actor.role, "Accreditation", "Created", `Cycle ${item.cycleNumber}`, undefined, item.grade);
    return item;
  });
}

export async function updateAccreditationCycle(
  id: string,
  patch: Partial<AccreditationCycle>,
  actor: { name: string; role: string }
): Promise<AccreditationCycle> {
  return mockRequest(() => {
    const idx = accreditationCycles.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Cycle not found");
    const old = accreditationCycles[idx];
    const updated = { ...old, ...patch };
    accreditationCycles[idx] = updated;
    logAudit(actor.name, actor.role, "Accreditation", "Updated", `Cycle ${updated.cycleNumber}`);
    return updated;
  });
}

export async function getCriteria(): Promise<NaacCriterion[]> {
  return mockRequest(() => [...criteria]);
}

export async function getCriterionById(id: NaacCriterionId): Promise<NaacCriterion> {
  return mockRequest(() => {
    const found = criteria.find((c) => c.id === id);
    if (!found) throw new Error(`Criterion ${id} not found`);
    return found;
  });
}

export async function updateMetric(
  metricId: string,
  patch: Partial<NaacMetric>,
  actor: { name: string; role: string }
): Promise<NaacMetric> {
  return mockRequest(() => {
    for (const c of criteria) {
      for (const ki of c.keyIndicators) {
        const mIdx = ki.metrics.findIndex((m) => m.id === metricId);
        if (mIdx !== -1) {
          const oldMetric = ki.metrics[mIdx];
          const updated = {
            ...oldMetric,
            ...patch,
            lastUpdated: new Date().toISOString().slice(0, 10),
            updatedBy: actor.name,
          };
          ki.metrics[mIdx] = updated;
          logAudit(
            actor.name,
            actor.role,
            `Criterion ${c.id}`,
            "Updated",
            `Metric ${updated.code}: ${updated.name}`,
            String(oldMetric.quantitativeValue ?? oldMetric.status),
            String(updated.quantitativeValue ?? updated.status)
          );
          return updated;
        }
      }
    }
    throw new Error("Metric not found");
  });
}

export const getCriteriaList = getCriteria;
export const updateMetricValue = updateMetric;

export interface EvidenceFilters {
  criterionId?: NaacCriterionId;
  department?: string;
  status?: EvidenceStatus;
  academicYear?: string;
  search?: string;
}

export async function getEvidenceList(filters: EvidenceFilters = {}): Promise<NaacEvidenceDocument[]> {
  return mockRequest(() => {
    return evidenceList.filter((doc) => {
      if (filters.criterionId && doc.criterionId !== filters.criterionId) return false;
      if (filters.department && doc.department !== filters.department) return false;
      if (filters.status && doc.status !== filters.status) return false;
      if (filters.academicYear && doc.academicYear !== filters.academicYear) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matches =
          doc.title.toLowerCase().includes(q) ||
          doc.metricCode.toLowerCase().includes(q) ||
          doc.description.toLowerCase().includes(q) ||
          doc.fileName.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  });
}

export async function uploadEvidenceDocument(
  doc: any,
  fileOrActor?: any,
  maybeActor?: any
): Promise<NaacEvidenceDocument> {
  return mockRequest(() => {
    const actor =
      maybeActor ||
      (fileOrActor && typeof fileOrActor === "object" && "role" in fileOrActor
        ? fileOrActor
        : { name: "System Admin", role: "Administrator" });

    const fileName =
      doc.fileName ||
      (fileOrActor && typeof fileOrActor === "object" && "name" in fileOrActor && typeof fileOrActor.name === "string"
        ? fileOrActor.name
        : `${doc.metricCode || "evidence"}_document.pdf`);

    const newDoc: NaacEvidenceDocument = {
      id: `evi-${Date.now()}`,
      uploadDate: new Date().toISOString().slice(0, 10),
      status: "Uploaded",
      version: "v1.0",
      uploadedBy: actor.name || "System Admin",
      fileName,
      fileSize: doc.fileSize || "2.4 MB",
      evidenceUrl:
        doc.evidenceUrl ||
        doc.url ||
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      documentType: doc.documentType || (doc.fileType ? doc.fileType.toUpperCase() : "PDF"),
      criterionId: doc.criterionId || (doc.criterion ? Number(doc.criterion) : 1),
      indicatorCode:
        doc.indicatorCode ||
        (doc.metricCode ? doc.metricCode.split(".").slice(0, 2).join(".") : "1.1"),
      remarks: doc.remarks || `Uploaded for Metric ${doc.metricCode || ""}`,
      ...doc,
    };
    evidenceList.unshift(newDoc);
    logAudit(actor.name, actor.role || "Administrator", "Evidence Repository", "Created", newDoc.title, undefined, newDoc.status);
    return newDoc;
  });
}

export async function updateEvidenceStatus(
  id: string,
  newStatus: EvidenceStatus,
  actor: { name: string; role: string },
  remarks?: string
): Promise<NaacEvidenceDocument> {
  return mockRequest(() => {
    const idx = evidenceList.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error("Evidence document not found");
    const old = evidenceList[idx];
    const updated: NaacEvidenceDocument = {
      ...old,
      status: newStatus,
      remarks: remarks || old.remarks,
    };
    if (newStatus === "Verified") {
      updated.verifiedBy = actor.name;
      updated.verificationDate = new Date().toISOString().slice(0, 10);
    } else if (newStatus === "Approved") {
      updated.approvedBy = actor.name;
      updated.approvalDate = new Date().toISOString().slice(0, 10);
    }
    evidenceList[idx] = updated;
    logAudit(actor.name, actor.role, "Evidence Repository", newStatus === "Verified" ? "Verified" : newStatus === "Approved" ? "Approved" : "Status Change", updated.title, old.status, newStatus, remarks);
    return updated;
  });
}

export async function deleteEvidenceDocument(id: string, actor: { name: string; role: string }): Promise<boolean> {
  return mockRequest(() => {
    const target = evidenceList.find((e) => e.id === id);
    if (!target) return false;
    if (target.status === "Approved") {
      throw new Error("Approved records cannot be deleted directly due to NAAC audit governance.");
    }
    evidenceList = evidenceList.filter((e) => e.id !== id);
    logAudit(actor.name, actor.role, "Evidence Repository", "Deleted", target.title);
    return true;
  });
}

export interface IqacDataBundle {
  members: IqacCommitteeMember[];
  meetings: IqacMeeting[];
  activities: IqacActivity[];
  actionTaken: IqacActionTaken[];
}

export async function getIqacDataBundle(): Promise<IqacDataBundle> {
  return mockRequest(() => ({
    members: [...iqacMembers],
    meetings: [...iqacMeetings],
    activities: [...iqacActivities],
    actionTaken: [...iqacActionTaken],
  }));
}

export async function addIqacMeeting(
  meeting: Omit<IqacMeeting, "id">,
  actor: { name: string; role: string }
): Promise<IqacMeeting> {
  return mockRequest(() => {
    const newMeeting: IqacMeeting = {
      ...meeting,
      id: `iqac-meet-${Date.now()}`,
    };
    iqacMeetings.unshift(newMeeting);
    logAudit(actor.name, actor.role, "IQAC Management", "Created", `Meeting: ${newMeeting.meetingNumber}`);
    return newMeeting;
  });
}

export async function addIqacActivity(
  activity: Omit<IqacActivity, "id">,
  actor: { name: string; role: string }
): Promise<IqacActivity> {
  return mockRequest(() => {
    const newActivity: IqacActivity = {
      ...activity,
      id: `act-${Date.now()}`,
    };
    iqacActivities.unshift(newActivity);
    logAudit(actor.name, actor.role, "IQAC Management", "Created", `Activity: ${newActivity.title}`);
    return newActivity;
  });
}

export async function updateActionTakenStatus(
  id: string,
  patch: Partial<IqacActionTaken>,
  actor: { name: string; role: string }
): Promise<IqacActionTaken> {
  return mockRequest(() => {
    const idx = iqacActionTaken.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error("Action Taken Record not found");
    const old = iqacActionTaken[idx];
    const updated = { ...old, ...patch };
    iqacActionTaken[idx] = updated;
    logAudit(actor.name, actor.role, "IQAC Action Taken", "Updated", updated.decision, old.status, updated.status);
    return updated;
  });
}

export async function getAqarRecords(): Promise<AqarRecord[]> {
  return mockRequest(() => [...aqarRecords]);
}

export async function updateAqarStatus(
  id: string,
  status: AqarStatus,
  actor: { name: string; role: string },
  remarks?: string
): Promise<AqarRecord> {
  return mockRequest(() => {
    const idx = aqarRecords.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error("AQAR record not found");
    const old = aqarRecords[idx];
    const updated: AqarRecord = {
      ...old,
      status,
      remarks: remarks || old.remarks,
    };
    if (status === "Submitted") {
      updated.submittedDate = new Date().toISOString().slice(0, 10);
      updated.approvedBy = actor.name;
    }
    aqarRecords[idx] = updated;
    logAudit(actor.name, actor.role, "AQAR Management", "Status Change", `AQAR ${updated.academicYear}`, old.status, status, remarks);
    return updated;
  });
}

export async function getSsrData(): Promise<SsrRecord> {
  return mockRequest(() => ({ ...ssrRecord }));
}

export interface FeedbackBundle {
  summaries: StakeholderFeedbackSummary[];
  records: NaacFeedbackRecord[];
}

export async function getFeedbackBundle(): Promise<FeedbackBundle> {
  return mockRequest(() => ({
    summaries: [...feedbackSummaries],
    records: [...feedbackRecords],
  }));
}

export async function submitFeedbackRecord(
  feedback: Omit<NaacFeedbackRecord, "id" | "date">
): Promise<NaacFeedbackRecord> {
  return mockRequest(() => {
    const newRecord: NaacFeedbackRecord = {
      ...feedback,
      id: `fb-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
    };
    feedbackRecords.unshift(newRecord);
    return newRecord;
  });
}

export async function getBestPractices(): Promise<{
  practices: BestPracticeItem[];
  distinctiveness: InstitutionalDistinctivenessItem;
}> {
  return mockRequest(() => ({
    practices: [...bestPractices],
    distinctiveness: { ...institutionalDistinctiveness },
  }));
}

export async function updateBestPractice(
  id: string,
  patch: Partial<BestPracticeItem>,
  actor: { name: string; role: string }
): Promise<BestPracticeItem> {
  return mockRequest(() => {
    const idx = bestPractices.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error("Best practice not found");
    const updated = { ...bestPractices[idx], ...patch };
    bestPractices[idx] = updated;
    logAudit(actor.name, actor.role, "Criterion 7", "Updated", updated.title);
    return updated;
  });
}

export async function getTasksList(statusFilter?: TaskStatus): Promise<NaacTask[]> {
  return mockRequest(() => {
    if (!statusFilter) return [...tasks];
    return tasks.filter((t) => t.status === statusFilter);
  });
}

export async function createNaacTask(
  task: Omit<NaacTask, "id">,
  actor: { name: string; role: string }
): Promise<NaacTask> {
  return mockRequest(() => {
    const newTask: NaacTask = {
      ...task,
      id: `task-${Date.now()}`,
    };
    tasks.unshift(newTask);
    logAudit(actor.name, actor.role, "Tasks & Deadlines", "Created", newTask.title);
    return newTask;
  });
}

export async function updateNaacTask(
  id: string,
  patch: Partial<NaacTask>,
  actor: { name: string; role: string }
): Promise<NaacTask> {
  return mockRequest(() => {
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Task not found");
    const old = tasks[idx];
    const updated = { ...old, ...patch };
    tasks[idx] = updated;
    logAudit(actor.name, actor.role, "Tasks & Deadlines", "Updated", updated.title, old.status, updated.status);
    return updated;
  });
}

export async function getApprovalsList(): Promise<NaacApproval[]> {
  return mockRequest(() => [...approvals]);
}

export async function processApprovalAction(
  id: string,
  action: "Approve" | "Reject" | "Request Changes",
  comments: string,
  actor: { name: string; role: string }
): Promise<NaacApproval> {
  return mockRequest(() => {
    const idx = approvals.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error("Approval not found");
    const appr = approvals[idx];

    let nextStatus: NaacApproval["status"] = "Pending";
    let nextStage = appr.currentStage;

    if (action === "Approve") {
      if (appr.currentStage === "Dept Coordinator") nextStage = "HOD";
      else if (appr.currentStage === "HOD") nextStage = "IQAC Coordinator";
      else if (appr.currentStage === "IQAC Coordinator") nextStage = "Principal";
      else if (appr.currentStage === "Principal") nextStatus = "Approved";
    } else if (action === "Reject") {
      nextStatus = "Rejected";
    } else if (action === "Request Changes") {
      nextStatus = "Changes Requested";
    }

    appr.status = nextStatus;
    appr.currentStage = nextStage;
    appr.remarks = comments;
    appr.history.push({
      stage: appr.currentStage,
      actor: actor.name,
      action: `${action} by ${actor.role}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
      comments,
    });

    logAudit(actor.name, actor.role, "Approvals", action === "Approve" ? "Approved" : "Status Change", appr.title, undefined, nextStatus, comments);
    return appr;
  });
}

export async function getAuditLogsList(moduleFilter?: string): Promise<NaacAuditLog[]> {
  return mockRequest(() => {
    if (!moduleFilter || moduleFilter === "All") return [...auditLogs];
    return auditLogs.filter((l) => l.module.toLowerCase().includes(moduleFilter.toLowerCase()));
  });
}

// ==========================================
// METRIC 1.1.1 CURRICULUM PLANNING & IMPLEMENTATION
// ==========================================

export async function getCurriculumPlanningData(): Promise<CurriculumPlanningData> {
  return mockRequest(() => ({
    councilMeetings: [...councilMeetings],
    academicCalendars: [...semesterCalendars],
    syllabusStructures: [...syllabusStructures],
    lessonPlanAdherence: [...lessonPlanAdherence],
  }));
}

export async function addAcademicCouncilMeeting(
  data: Omit<AcademicCouncilMeeting, "id">,
  actor: { name: string; role: string }
): Promise<AcademicCouncilMeeting> {
  return mockRequest(() => {
    const newMeeting: AcademicCouncilMeeting = {
      ...data,
      id: `acm-${Date.now()}`,
    };
    councilMeetings.unshift(newMeeting);
    logAudit(actor.name, actor.role, "Curriculum (1.1.1)", "Created", `Academic Council Meeting ${newMeeting.meetingNumber}`);
    return newMeeting;
  });
}

export async function addSemesterCalendar(
  data: Omit<SemesterAcademicCalendar, "id">,
  actor: { name: string; role: string }
): Promise<SemesterAcademicCalendar> {
  return mockRequest(() => {
    const newCal: SemesterAcademicCalendar = {
      ...data,
      id: `sem-cal-${Date.now()}`,
    };
    semesterCalendars.unshift(newCal);
    logAudit(actor.name, actor.role, "Curriculum (1.1.1)", "Created", `Semester Calendar ${newCal.academicYear} ${newCal.semester}`);
    return newCal;
  });
}

export async function getEvidenceForMetric(
  metricCodeOrCriterionId: string | number,
  maybeMetricCode?: string
): Promise<NaacEvidenceDocument[]> {
  const code =
    typeof metricCodeOrCriterionId === "number" && maybeMetricCode
      ? maybeMetricCode
      : String(metricCodeOrCriterionId);
  return mockRequest(() => {
    return evidenceList.filter((e) => e.metricCode === code);
  });
}

// ==========================================
// METRIC 1.1.2 CURRICULUM REVISION OVER 5 YEARS
// ==========================================

export async function getCurriculumRevisionData(): Promise<CurriculumRevisionData> {
  return mockRequest(() => {
    const overallPct = 78.57; // 11 programmes revised out of 14 in 5-year cycle
    const benchmark = 70.0;
    return {
      fiveYearSummaries: [...fiveYearSummaries],
      overallRevisionPercentage: overallPct,
      benchmarkPercentage: benchmark,
      benchmarkStatus: overallPct >= benchmark ? "Exceeds NAAC Benchmark" : "Below Benchmark",
      bosMeetings: [...bosMeetings],
      programmeRevisions: [...programmeRevisions],
      comparativeSyllabusItems: [...comparativeSyllabusItems],
    };
  });
}

export async function addBosMeeting(
  data: Omit<BoardOfStudiesMeeting, "id">,
  actor: { name: string; role: string }
): Promise<BoardOfStudiesMeeting> {
  return mockRequest(() => {
    const newBos: BoardOfStudiesMeeting = {
      ...data,
      id: `bos-${Date.now()}`,
    };
    bosMeetings.unshift(newBos);
    logAudit(actor.name, actor.role, "Curriculum (1.1.2)", "Created", `BoS Meeting ${newBos.meetingNumber} (${newBos.departmentName})`);
    return newBos;
  });
}

export async function addComparativeSyllabusItem(
  data: Omit<ComparativeSyllabusItem, "id">,
  actor: { name: string; role: string }
): Promise<ComparativeSyllabusItem> {
  return mockRequest(() => {
    const newItem: ComparativeSyllabusItem = {
      ...data,
      id: `csi-${Date.now()}`,
    };
    comparativeSyllabusItems.unshift(newItem);
    logAudit(actor.name, actor.role, "Curriculum (1.1.2)", "Created", `Comparative Syllabus Analysis for ${newItem.courseCode}: ${newItem.courseTitle}`);
    return newItem;
  });
}

export async function addProgrammeRevision(
  data: Omit<ProgrammeRevisionRecord, "id">,
  actor: { name: string; role: string }
): Promise<ProgrammeRevisionRecord> {
  return mockRequest(() => {
    const newRev: ProgrammeRevisionRecord = {
      ...data,
      id: `rev-${Date.now()}`,
    };
    programmeRevisions.unshift(newRev);
    logAudit(actor.name, actor.role, "Curriculum (1.1.2)", "Created", `Programme Revision Record for ${newRev.programmeName}`);
    return newRev;
  });
}

// ==========================================
// METRIC 1.2.1 CHOICE BASED CREDIT SYSTEM (CBCS)
// ==========================================

export async function getCbcsData(): Promise<CbcsSummaryData> {
  return mockRequest(() => {
    const total = cbcsProgrammes.length;
    const withCbcs = cbcsProgrammes.filter(
      (p) => p.cbcsType === "Choice Based Credit System (CBCS)" || p.cbcsType === "Elective Course System"
    ).length;
    const adoptionPct = Number(((withCbcs / (total || 1)) * 100).toFixed(1));
    const totalStudents = electiveCourses.reduce((acc, c) => acc + c.enrolledStudentsCount, 0);

    return {
      totalProgrammesOffered: total,
      programmesWithCbcs: withCbcs,
      adoptionPercentage: adoptionPct,
      benchmarkPercentage: 100.0,
      totalElectiveCoursesOffered: electiveCourses.length,
      totalStudentsEnrolledInElectives: totalStudents,
      programmeRecords: [...cbcsProgrammes],
      notifications: [...universityNotifications],
      electiveCourses: [...electiveCourses],
    };
  });
}

export async function addCbcsProgrammeRecord(
  data: Omit<CbcsProgrammeRecord, "id">,
  actor: { name: string; role: string }
): Promise<CbcsProgrammeRecord> {
  return mockRequest(() => {
    const newProg: CbcsProgrammeRecord = {
      ...data,
      id: `cbcs-prog-${Date.now()}`,
    };
    cbcsProgrammes.unshift(newProg);
    logAudit(actor.name, actor.role, "Academic Flexibility (1.2.1)", "Created", `CBCS Programme Record ${newProg.programmeName}`);
    return newProg;
  });
}

export async function addUniversityNotification(
  data: Omit<UniversityNotification, "id">,
  actor: { name: string; role: string }
): Promise<UniversityNotification> {
  return mockRequest(() => {
    const newNotif: UniversityNotification = {
      ...data,
      id: `notif-${Date.now()}`,
    };
    universityNotifications.unshift(newNotif);
    logAudit(actor.name, actor.role, "Academic Flexibility (1.2.1)", "Created", `University Notification ${newNotif.notificationNumber}`);
    return newNotif;
  });
}

export async function addElectiveCourseOption(
  data: Omit<ElectiveCourseOption, "id">,
  actor: { name: string; role: string }
): Promise<ElectiveCourseOption> {
  return mockRequest(() => {
    const newCourse: ElectiveCourseOption = {
      ...data,
      id: `elec-${Date.now()}`,
    };
    electiveCourses.unshift(newCourse);
    logAudit(actor.name, actor.role, "Academic Flexibility (1.2.1)", "Created", `Elective Course ${newCourse.courseCode} (${newCourse.courseTitle})`);
    return newCourse;
  });
}

export async function getValueAddedCoursesData(): Promise<ValueAddedCoursesData> {
  return mockRequest(() => {
    const totalCourses = valueAddedCourses.length;
    const totalStudents = valueAddedCourses.reduce((acc, c) => acc + c.enrolledStudentsCount, 0);
    const totalCompleted = valueAddedCourses.reduce((acc, c) => acc + c.completedStudentsCount, 0);
    const completionRate = Number(((totalCompleted / (totalStudents || 1)) * 100).toFixed(1));

    return {
      totalCourses,
      totalStudents,
      benchmarkCourses: 35,
      benchmarkStudents: 1500,
      overallCompletionRate: completionRate,
      courses: [...valueAddedCourses],
      enrolmentSummaries: [...valueAddedEnrolmentSummaries],
      studentCertificates: [...studentCertificates],
    };
  });
}

export async function addValueAddedCourse(
  course: Omit<ValueAddedCourse, "id">,
  actor: { name: string; role: string }
): Promise<ValueAddedCourse> {
  return mockRequest(() => {
    const newCourse: ValueAddedCourse = {
      ...course,
      id: `vac-${Date.now()}`,
    };
    valueAddedCourses.unshift(newCourse);
    logAudit(actor.name, actor.role, "Value-Added Courses (1.2.2)", "Created", `Course ${newCourse.courseCode} (${newCourse.courseName})`);
    return newCourse;
  });
}

export async function addStudentCertificateRecord(
  record: Omit<StudentCertificateRecord, "id">,
  actor: { name: string; role: string }
): Promise<StudentCertificateRecord> {
  return mockRequest(() => {
    const newRecord: StudentCertificateRecord = {
      ...record,
      id: `sc-${Date.now()}`,
    };
    studentCertificates.unshift(newRecord);
    logAudit(actor.name, actor.role, "Value-Added Courses (1.2.2)", "Created", `Certificate Issued to ${newRecord.studentName} (${newRecord.rollNumber})`);
    return newRecord;
  });
}

export async function getCrosscuttingIssuesData(): Promise<CrosscuttingSummaryData> {
  return mockRequest(() => {
    const totalMappedCourses = crosscuttingMappings.length;
    const gender = crosscuttingMappings.filter((c) => c.theme === "Gender Sensitization & Equity").length;
    const environment = crosscuttingMappings.filter((c) => c.theme === "Environment & Sustainability").length;
    const humanValues = crosscuttingMappings.filter((c) => c.theme === "Human Values & Constitutional Rights").length;
    const professionalEthics = crosscuttingMappings.filter((c) => c.theme === "Professional Ethics & Integrity").length;
    const totalActivities = crosscuttingActivities.length;
    const totalParticipants = crosscuttingActivities.reduce((acc, a) => acc + a.participantsCount, 0);

    return {
      totalMappedCourses,
      programmesCoveredPercentage: 100.0,
      coursesByTheme: {
        gender,
        environment,
        humanValues,
        professionalEthics,
      },
      totalActivities,
      totalParticipants,
      courseMappings: [...crosscuttingMappings],
      activities: [...crosscuttingActivities],
    };
  });
}

export async function addCrosscuttingCourseMapping(
  mapping: Omit<CrosscuttingCourseMapping, "id">,
  actor: { name: string; role: string }
): Promise<CrosscuttingCourseMapping> {
  return mockRequest(() => {
    const newMapping: CrosscuttingCourseMapping = {
      ...mapping,
      id: `cc-${Date.now()}`,
    };
    crosscuttingMappings.unshift(newMapping);
    logAudit(actor.name, actor.role, "Curriculum Enrichment (1.3.1)", "Created", `Course Mapping ${newMapping.courseCode} (${newMapping.courseTitle})`);
    return newMapping;
  });
}

export async function addCrosscuttingActivity(
  activity: Omit<CrosscuttingCoCurricularActivity, "id">,
  actor: { name: string; role: string }
): Promise<CrosscuttingCoCurricularActivity> {
  return mockRequest(() => {
    const newAct: CrosscuttingCoCurricularActivity = {
      ...activity,
      id: `act-${Date.now()}`,
    };
    crosscuttingActivities.unshift(newAct);
    logAudit(actor.name, actor.role, "Curriculum Enrichment (1.3.1)", "Created", `Activity ${newAct.title} (${newAct.theme})`);
    return newAct;
  });
}

export async function getStudentEnrolmentData(): Promise<StudentProfileEnrolmentData> {
  return mockRequest(() => {
    const totalSanctionedFiveYears = enrolmentYearRecords.reduce(
      (acc, y) => acc + y.sanctionedSeats,
      0
    );
    const totalAdmittedFiveYears = enrolmentYearRecords.reduce(
      (acc, y) => acc + y.admittedStudents,
      0
    );
    const fiveYearEnrolmentPercentage = Number(
      ((totalAdmittedFiveYears / (totalSanctionedFiveYears || 1)) * 100).toFixed(1)
    );

    return {
      fiveYearEnrolmentPercentage,
      benchmarkPercentage: 90.0,
      totalSanctionedFiveYears,
      totalAdmittedFiveYears,
      yearlyRecords: [...enrolmentYearRecords],
      programmeRecords: [...programmeEnrolmentRecords],
      reservationPolicy: {
        scPercent: 16.25,
        stPercent: 22.50,
        obcPercent: 11.25,
        openPercent: 50.00,
        pwdPercent: 5.00,
      },
    };
  });
}

export async function addProgrammeEnrolmentRecord(
  record: Omit<ProgrammeEnrolmentRecord, "id">,
  actor: { name: string; role: string }
): Promise<ProgrammeEnrolmentRecord> {
  return mockRequest(() => {
    const newRecord: ProgrammeEnrolmentRecord = {
      ...record,
      id: `prog-enr-${Date.now()}`,
    };
    programmeEnrolmentRecords.unshift(newRecord);
    logAudit(
      actor.name,
      actor.role,
      "Student Enrolment (2.1.1)",
      "Created",
      `Intake Record for ${newRecord.programmeName} (${newRecord.programmeCode})`
    );
    return newRecord;
  });
}

export async function updateEnrolmentYearRecord(
  yearRecord: EnrolmentYearRecord,
  actor: { name: string; role: string }
): Promise<EnrolmentYearRecord> {
  return mockRequest(() => {
    const index = enrolmentYearRecords.findIndex(
      (y) => y.academicYear === yearRecord.academicYear
    );
    if (index !== -1) {
      enrolmentYearRecords[index] = { ...yearRecord };
    } else {
      enrolmentYearRecords.push({ ...yearRecord });
    }
    logAudit(
      actor.name,
      actor.role,
      "Student Enrolment (2.1.1)",
      "Updated",
      `Enrolment for AY ${yearRecord.academicYear}: ${yearRecord.admittedStudents}/${yearRecord.sanctionedSeats} (${yearRecord.enrolmentPercentage}%)`
    );
    return { ...yearRecord };
  });
}

export async function getStudentTeacherRatioData(): Promise<StudentTeacherRatioData> {
  return mockRequest(() => {
    const totalStudents = cohortBreakdown.reduce((acc, c) => acc + c.totalEnrolled, 0);
    const totalFullTimeFaculty = facultyRoster.length;
    const ratioNumeric = Number((totalStudents / (totalFullTimeFaculty || 1)).toFixed(1));
    const ratio = `${Math.round(ratioNumeric)}:1`;
    const phdFacultyCount = facultyRoster.filter((f) => f.isPhd).length;
    const phdFacultyPercentage = Number(((phdFacultyCount / totalFullTimeFaculty) * 100).toFixed(1));

    return {
      academicYear: "2025-26",
      totalStudents,
      totalFullTimeFaculty,
      ratio,
      ratioNumeric,
      ugcBenchmark: "≤ 20:1",
      benchmarkCompliant: ratioNumeric <= 20.0,
      phdFacultyCount,
      phdFacultyPercentage,
      mentorMenteeRatio: "1:16",
      departmentRatios: [...departmentRatios],
      facultyRoster: [...facultyRoster],
      cohortBreakdown: [...cohortBreakdown],
      fiveYearRatioTrend: [...initialFiveYearRatioTrend],
    };
  });
}

export async function addFacultyMember(
  member: Omit<FullTimeFacultyMember, "id">,
  actor: { name: string; role: string }
): Promise<FullTimeFacultyMember> {
  return mockRequest(() => {
    const newFaculty: FullTimeFacultyMember = {
      ...member,
      id: `fac-${Date.now()}`,
    };
    facultyRoster.unshift(newFaculty);
    logAudit(
      actor.name,
      actor.role,
      "Faculty Ratio (2.2.1)",
      "Created",
      `Faculty Member ${newFaculty.name} (${newFaculty.empId}) in ${newFaculty.department}`
    );
    return newFaculty;
  });
}

export async function updateFacultyMember(
  member: FullTimeFacultyMember,
  actor: { name: string; role: string }
): Promise<FullTimeFacultyMember> {
  return mockRequest(() => {
    const index = facultyRoster.findIndex((f) => f.id === member.id);
    if (index !== -1) {
      facultyRoster[index] = { ...member };
    }
    logAudit(
      actor.name,
      actor.role,
      "Faculty Ratio (2.2.1)",
      "Updated",
      `Faculty Member ${member.name} (${member.empId}) details updated`
    );
    return { ...member };
  });
}

export async function getStudentCentricPedagogyData(): Promise<StudentCentricPedagogyData> {
  return mockRequest(() => {
    const totalIndustrialVisits = industrialVisits.length;
    const totalParticipativeActivities = participativeActivities.length;
    const totalCapstones = capstoneProjects.length;
    const studentsBenefittedCount =
      industrialVisits.reduce((acc, v) => acc + v.studentsCount, 0) +
      participativeActivities.reduce((acc, a) => acc + a.participantsCount, 0);

    return {
      academicYear: "2025-26",
      totalIndustrialVisits,
      totalParticipativeActivities,
      totalCapstones,
      studentsBenefittedCount,
      industrialVisits: [...industrialVisits],
      capstoneProjects: [...capstoneProjects],
      participativeActivities: [...participativeActivities],
      geoTaggedCompendiumUrl: "/documents/naac/pedagogy/Experiential_Learning_Compendium_2025.pdf",
    };
  });
}

export async function addIndustrialVisitRecord(
  visit: Omit<IndustrialVisitRecord, "id">,
  actor: { name: string; role: string }
): Promise<IndustrialVisitRecord> {
  return mockRequest(() => {
    const newVisit: IndustrialVisitRecord = {
      ...visit,
      id: `iv-${Date.now()}`,
    };
    industrialVisits.unshift(newVisit);
    logAudit(
      actor.name,
      actor.role,
      "Student-Centric Pedagogy (2.3.1)",
      "Created",
      `Industrial Visit to ${newVisit.industryName} (${newVisit.department})`
    );
    return newVisit;
  });
}

export async function addCapstoneProjectRecord(
  capstone: Omit<CapstoneProjectRecord, "id">,
  actor: { name: string; role: string }
): Promise<CapstoneProjectRecord> {
  return mockRequest(() => {
    const newCap: CapstoneProjectRecord = {
      ...capstone,
      id: `cap-${Date.now()}`,
    };
    capstoneProjects.unshift(newCap);
    logAudit(
      actor.name,
      actor.role,
      "Student-Centric Pedagogy (2.3.1)",
      "Created",
      `Capstone Project: ${newCap.projectTitle} (${newCap.department})`
    );
    return newCap;
  });
}

export async function getIctClassroomLmsData(): Promise<IctClassroomLmsData> {
  return mockRequest(() => {
    const totalClassroomsAndHalls = ictRooms.length;
    const ictEnabledCount = ictRooms.filter((r) => r.hasInteractivePanel || r.hasProjector).length;
    const ictPercentage = Number(((ictEnabledCount / (totalClassroomsAndHalls || 1)) * 100).toFixed(1));

    return {
      academicYear: "2025-26",
      totalClassroomsAndHalls,
      ictEnabledCount,
      ictPercentage,
      lmsActiveCourses: lmsCourses.length > 0 ? 142 : 0,
      lmsActiveTeachers: 135,
      lmsActiveStudents: 2160,
      flippedClassroomModulesCount: 42,
      rooms: [...ictRooms],
      lmsCourses: [...lmsCourses],
      digitalResources: [...digitalResources],
    };
  });
}

export async function addIctRoomInventoryItem(
  room: Omit<IctRoomInventoryItem, "id">,
  actor: { name: string; role: string }
): Promise<IctRoomInventoryItem> {
  return mockRequest(() => {
    const newRoom: IctRoomInventoryItem = {
      ...room,
      id: `room-${Date.now()}`,
    };
    ictRooms.unshift(newRoom);
    logAudit(
      actor.name,
      actor.role,
      "ICT & LMS Teaching (2.3.2)",
      "Created",
      `Instructional Space ${newRoom.roomNumber} (${newRoom.roomType}) in ${newRoom.blockOrBuilding}`
    );
    return newRoom;
  });
}

// ==========================================
// Metric 2.5.1: CIE Transparency
// ==========================================

let cieEvaluationData = { ...MOCK_CIE_EVALUATION_DATA };
let cieGrievances = [...MOCK_CIE_EVALUATION_DATA.grievances];
let cieSchedules = [...MOCK_CIE_EVALUATION_DATA.schedules];

export async function getCieEvaluationData(): Promise<CieEvaluationData> {
  return mockRequest(() => ({
    ...cieEvaluationData,
    grievances: [...cieGrievances],
    schedules: [...cieSchedules],
    totalGrievancesReceived: cieGrievances.length,
    totalGrievancesResolved: cieGrievances.filter((g) => g.status === "Resolved").length,
    resolutionRate: Number(
      (
        (cieGrievances.filter((g) => g.status === "Resolved").length / (cieGrievances.length || 1)) *
        100
      ).toFixed(1)
    ),
  }));
}

export async function addCieGrievanceRecord(
  record: Omit<CieGrievanceRecord, "id">,
  actor: { name: string; role: string }
): Promise<CieGrievanceRecord> {
  return mockRequest(() => {
    const newRecord: CieGrievanceRecord = {
      ...record,
      id: `cie-grv-${Date.now()}`,
    };
    cieGrievances.unshift(newRecord);
    logAudit(
      actor.name,
      actor.role,
      "CIE Transparency (2.5.1)",
      "Created",
      `CIE Grievance ${newRecord.grievanceCode} for ${newRecord.studentName} (${newRecord.courseCode})`
    );
    return newRecord;
  });
}

// ==========================================
// Metric 2.6.3: Student Pass Percentage & Attainment
// ==========================================

let passPercentageData = { ...MOCK_PASS_PERCENTAGE_DATA };
let programmePassRecords = [...MOCK_PASS_PERCENTAGE_DATA.programmes];
let poCoAttainmentRecords = [...MOCK_PASS_PERCENTAGE_DATA.attainmentRecords];

export async function getPassPercentageData(): Promise<PassPercentageData> {
  return mockRequest(() => {
    const totalAppeared = programmePassRecords.reduce((sum, p) => sum + p.eligibleAppeared, 0);
    const totalPassed = programmePassRecords.reduce((sum, p) => sum + p.studentsPassed, 0);
    const overallPassPercentage = Number(((totalPassed / (totalAppeared || 1)) * 100).toFixed(1));

    return {
      ...passPercentageData,
      totalAppeared,
      totalPassed,
      overallPassPercentage,
      programmes: [...programmePassRecords],
      attainmentRecords: [...poCoAttainmentRecords],
    };
  });
}

export async function addProgrammePassRecord(
  prog: Omit<ProgrammePassRecord, "id">,
  actor: { name: string; role: string }
): Promise<ProgrammePassRecord> {
  return mockRequest(() => {
    const newProg: ProgrammePassRecord = {
      ...prog,
      id: `pass-prog-${Date.now()}`,
    };
    programmePassRecords.unshift(newProg);
    logAudit(
      actor.name,
      actor.role,
      "Pass Percentage (2.6.3)",
      "Created",
      `Programme Pass Record: ${newProg.programmeName} (${newProg.passPercentage}%)`
    );
    return newProg;
  });
}

// ==========================================
// Metric 2.7.1: Student Satisfaction Survey (SSS)
// ==========================================

let sssSurveyData = { ...MOCK_SSS_SURVEY_DATA };

export async function getSssSurveyData(): Promise<SssSurveyData> {
  return mockRequest(() => ({
    ...sssSurveyData,
    questions: [...sssSurveyData.questions],
    categoryAverages: [...sssSurveyData.categoryAverages],
    actionTakenItems: [...sssSurveyData.actionTakenItems],
  }));
}

// ==========================================
// Metric 3.1.1: Grants & Research Funding
// ==========================================

let researchFundingData = { ...MOCK_RESEARCH_FUNDING_DATA };
let researchGrants = [...MOCK_RESEARCH_FUNDING_DATA.projects];

export async function getResearchFundingData(): Promise<ResearchFundingData> {
  return mockRequest(() => {
    const totalSanctionedAmountLakhs = Number(
      researchGrants.reduce((sum, p) => sum + p.sanctionedAmountLakhs, 0).toFixed(2)
    );
    return {
      ...researchFundingData,
      totalSanctionedAmountLakhs,
      totalOngoingProjects: researchGrants.filter((p) => p.status === "Ongoing").length,
      totalCompletedProjects: researchGrants.filter((p) => p.status === "Completed").length,
      projects: [...researchGrants],
    };
  });
}

export async function addResearchGrantRecord(
  grant: Omit<ResearchGrantRecord, "id">,
  actor: { name: string; role: string }
): Promise<ResearchGrantRecord> {
  return mockRequest(() => {
    const newGrant: ResearchGrantRecord = {
      ...grant,
      id: `grant-${Date.now()}`,
    };
    researchGrants.unshift(newGrant);
    logAudit(
      actor.name,
      actor.role,
      "Research Grants (3.1.1)",
      "Created",
      `Research Grant ${newGrant.projectCode}: ₹${newGrant.sanctionedAmountLakhs}L from ${newGrant.fundingAgency}`
    );
    return newGrant;
  });
}

// ==========================================
// Metric 3.2.1: Incubation, IPR & Patents
// ==========================================

let innovationEcosystemData = { ...MOCK_INNOVATION_ECOSYSTEM_DATA };
let patentRecords = [...MOCK_INNOVATION_ECOSYSTEM_DATA.patents];
let startupRecords = [...MOCK_INNOVATION_ECOSYSTEM_DATA.startups];

export async function getInnovationEcosystemData(): Promise<InnovationEcosystemData> {
  return mockRequest(() => ({
    ...innovationEcosystemData,
    totalPatents: patentRecords.length,
    patentsGranted: patentRecords.filter((p) => p.status === "Granted").length,
    patentsPublished: patentRecords.filter((p) => p.status === "Published").length,
    patentsFiled: patentRecords.filter((p) => p.status === "Filed").length,
    totalIncubatedStartups: startupRecords.length,
    patents: [...patentRecords],
    startups: [...startupRecords],
  }));
}

export async function addPatentRecord(
  patent: Omit<PatentRecord, "id">,
  actor: { name: string; role: string }
): Promise<PatentRecord> {
  return mockRequest(() => {
    const newPatent: PatentRecord = {
      ...patent,
      id: `pat-${Date.now()}`,
    };
    patentRecords.unshift(newPatent);
    logAudit(
      actor.name,
      actor.role,
      "Innovation & Patents (3.2.1)",
      "Created",
      `Patent ${newPatent.patentApplicationNumber}: "${newPatent.patentTitle}"`
    );
    return newPatent;
  });
}

export async function addStartupIncubationRecord(
  startup: Omit<StartupIncubationRecord, "id">,
  actor: { name: string; role: string }
): Promise<StartupIncubationRecord> {
  return mockRequest(() => {
    const newStartup: StartupIncubationRecord = {
      ...startup,
      id: `stup-${Date.now()}`,
    };
    startupRecords.unshift(newStartup);
    logAudit(
      actor.name,
      actor.role,
      "Innovation & Patents (3.2.1)",
      "Created",
      `Startup ${newStartup.startupName} (${newStartup.sector})`
    );
    return newStartup;
  });
}

// ==========================================
// Metric 3.3.1: Scopus & UGC-CARE Publications
// ==========================================

let publicationsData = { ...MOCK_PUBLICATIONS_DATA };
let publicationsList = [...MOCK_PUBLICATIONS_DATA.publications];

export async function getPublicationsData(): Promise<PublicationsData> {
  return mockRequest(() => ({
    ...publicationsData,
    publications: [...publicationsList],
  }));
}

export async function addResearchPublicationRecord(
  pub: Omit<ResearchPublicationRecord, "id">,
  actor: { name: string; role: string }
): Promise<ResearchPublicationRecord> {
  return mockRequest(() => {
    const newPub: ResearchPublicationRecord = {
      ...pub,
      id: `pub-${Date.now()}`,
    };
    publicationsList.unshift(newPub);
    logAudit(
      actor.name,
      actor.role,
      "Publications (3.3.1)",
      "Created",
      `Paper "${newPub.paperTitle.slice(0, 40)}..." in ${newPub.journalName}`
    );
    return newPub;
  });
}

// ==========================================
// Metric 3.3.2: Books, Chapters & Proceedings
// ==========================================

let booksProceedingsData = { ...MOCK_BOOKS_PROCEEDINGS_DATA };
let booksList = [...MOCK_BOOKS_PROCEEDINGS_DATA.items];

export async function getBooksProceedingsData(): Promise<BooksProceedingsData> {
  return mockRequest(() => ({
    ...booksProceedingsData,
    items: [...booksList],
  }));
}

export async function addBookProceedingsRecord(
  item: Omit<BookProceedingsRecord, "id">,
  actor: { name: string; role: string }
): Promise<BookProceedingsRecord> {
  return mockRequest(() => {
    const newItem: BookProceedingsRecord = {
      ...item,
      id: `bk-${Date.now()}`,
    };
    booksList.unshift(newItem);
    logAudit(
      actor.name,
      actor.role,
      "Books & Proceedings (3.3.2)",
      "Created",
      `${newItem.workType}: "${newItem.title}" (${newItem.isbnIssn})`
    );
    return newItem;
  });
}

// ==========================================
// Metric 3.5.1: Consultancy & Corporate MoUs
// ==========================================

let consultancyData = { ...MOCK_CONSULTANCY_DATA };
let consultancyProjects = [...MOCK_CONSULTANCY_DATA.projects];

export async function getConsultancyData(): Promise<ConsultancyData> {
  return mockRequest(() => {
    const totalRevenueInLakhs = Number(
      consultancyProjects.reduce((sum, p) => sum + p.revenueInLakhs, 0).toFixed(2)
    );
    const institutionalRevenueInLakhs = Number((totalRevenueInLakhs * 0.4).toFixed(2));
    return {
      ...consultancyData,
      totalProjects: consultancyProjects.length,
      totalRevenueInLakhs,
      institutionalRevenueInLakhs,
      projects: [...consultancyProjects],
    };
  });
}

export async function addConsultancyProjectRecord(
  proj: Omit<ConsultancyProjectRecord, "id">,
  actor: { name: string; role: string }
): Promise<ConsultancyProjectRecord> {
  return mockRequest(() => {
    const newProj: ConsultancyProjectRecord = {
      ...proj,
      id: `cons-${Date.now()}`,
    };
    consultancyProjects.unshift(newProj);
    logAudit(
      actor.name,
      actor.role,
      "Consultancy (3.5.1)",
      "Created",
      `Consultancy Project: ${newProj.consultancyProjectTitle} (₹${newProj.revenueInLakhs}L for ${newProj.clientOrganization})`
    );
    return newProj;
  });
}

// ==========================================
// Metric 3.6.1: Community Outreach & Extension
// ==========================================

let extensionActivitiesData = { ...MOCK_EXTENSION_ACTIVITIES_DATA };
let extensionDrives = [...MOCK_EXTENSION_ACTIVITIES_DATA.drives];

export async function getExtensionActivitiesData(): Promise<ExtensionActivitiesData> {
  return mockRequest(() => ({
    ...extensionActivitiesData,
    totalExtensionDrives: extensionDrives.length,
    totalStudentParticipants: extensionDrives.reduce((sum, d) => sum + d.studentVolunteersCount, 0),
    totalBeneficiaries: extensionDrives.reduce((sum, d) => sum + d.beneficiariesReached, 0),
    drives: [...extensionDrives],
  }));
}

export async function addCommunityOutreachRecord(
  drive: Omit<CommunityOutreachRecord, "id">,
  actor: { name: string; role: string }
): Promise<CommunityOutreachRecord> {
  return mockRequest(() => {
    const newDrive: CommunityOutreachRecord = {
      ...drive,
      id: `ext-${Date.now()}`,
    };
    extensionDrives.unshift(newDrive);
    logAudit(
      actor.name,
      actor.role,
      "Community Outreach (3.6.1)",
      "Created",
      `Extension Drive: ${newDrive.activityName} (${newDrive.organizingUnit})`
    );
    return newDrive;
  });
}

// ==========================================
// Metric 3.7.1: Functional MoUs & Linkages
// ==========================================

let mouLinkagesData = { ...MOCK_MOU_LINKAGES_DATA };
let mousList = [...MOCK_MOU_LINKAGES_DATA.mous];

export async function getMouLinkagesData(): Promise<MouLinkagesData> {
  return mockRequest(() => ({
    ...mouLinkagesData,
    totalActiveMous: mousList.length,
    academicPartnerships: mousList.filter((m) => m.category === "Academic / University" || m.category === "Research Laboratory").length,
    industryPartnerships: mousList.filter((m) => m.category === "Corporate / Industry").length,
    mous: [...mousList],
  }));
}

export async function addFunctionalMouRecord(
  mou: Omit<FunctionalMouRecord, "id">,
  actor: { name: string; role: string }
): Promise<FunctionalMouRecord> {
  return mockRequest(() => {
    const newMou: FunctionalMouRecord = {
      ...mou,
      id: `mou-${Date.now()}`,
    };
    mousList.unshift(newMou);
    logAudit(
      actor.name,
      actor.role,
      "Functional MoUs (3.7.1)",
      "Created",
      `MoU with ${newMou.partnerInstitutionOrIndustry} (${newMou.category})`
    );
    return newMou;
  });
}

// ==========================================
// Metric 4.3.1: IT Facilities & Campus Wi-Fi Bandwidth
// ==========================================

let itFacilityData = { ...MOCK_IT_FACILITY_DATA };
let itLabsList = [...MOCK_IT_FACILITY_DATA.labs];
let itAccessPointsList = [...MOCK_IT_FACILITY_DATA.accessPoints];
let itBandwidthBillsList = [...MOCK_IT_FACILITY_DATA.bandwidthBills];

export async function getItFacilityData(): Promise<ItFacilityData> {
  return mockRequest(() => {
    const totalComputers = itLabsList.reduce((sum, lab) => sum + lab.totalWorkstations, 0);
    const ratio = `${Math.round(itFacilityData.totalEnrolledStudents / (totalComputers || 1))}:1`;
    return {
      ...itFacilityData,
      totalComputersForStudents: totalComputers,
      studentToComputerRatio: ratio,
      totalWifiAccessPoints: itAccessPointsList.length,
      labs: [...itLabsList],
      accessPoints: [...itAccessPointsList],
      bandwidthBills: [...itBandwidthBillsList],
    };
  });
}

export async function addComputerLabAsset(
  lab: Omit<ComputerLabAssetRecord, "id">,
  actor: { name: string; role: string }
): Promise<ComputerLabAssetRecord> {
  return mockRequest(() => {
    const newLab: ComputerLabAssetRecord = {
      ...lab,
      id: `lab-${Date.now()}`,
    };
    itLabsList.unshift(newLab);
    logAudit(
      actor.name,
      actor.role,
      "IT Infrastructure (4.3.1)",
      "Created",
      `Computer Lab Added: ${newLab.labName} (${newLab.totalWorkstations} Workstations)`
    );
    return newLab;
  });
}

export async function addWifiAccessPoint(
  ap: Omit<WifiAccessPointRecord, "id">,
  actor: { name: string; role: string }
): Promise<WifiAccessPointRecord> {
  return mockRequest(() => {
    const newAp: WifiAccessPointRecord = {
      ...ap,
      id: `ap-${Date.now()}`,
    };
    itAccessPointsList.unshift(newAp);
    logAudit(
      actor.name,
      actor.role,
      "IT Infrastructure (4.3.1)",
      "Created",
      `Wi-Fi Access Point Added: ${newAp.zoneOrBlock} (${newAp.apModel})`
    );
    return newAp;
  });
}

// ==========================================
// Metric 4.4.1: Infrastructure Maintenance & Expenditure
// ==========================================

let maintenanceExpenditureData = { ...MOCK_MAINTENANCE_EXPENDITURE_DATA };
let amcContractsList = [...MOCK_MAINTENANCE_EXPENDITURE_DATA.amcContracts];
let maintenanceCategoriesList = [...MOCK_MAINTENANCE_EXPENDITURE_DATA.categories];

export async function getMaintenanceExpenditureData(): Promise<MaintenanceExpenditureData> {
  return mockRequest(() => {
    const totalSpent = maintenanceCategoriesList.reduce((sum, c) => sum + c.auditedExpenditureLakhs, 0);
    const totalBudget = maintenanceCategoriesList.reduce((sum, c) => sum + c.allocatedBudgetLakhs, 0);
    const percentage = Number(((totalSpent / (maintenanceExpenditureData.totalInstitutionalBudgetExcludingSalaryLakhs || 1)) * 100).toFixed(2));
    return {
      ...maintenanceExpenditureData,
      totalMaintenanceBudgetLakhs: Number(totalBudget.toFixed(2)),
      totalAuditedExpenditureLakhs: Number(totalSpent.toFixed(2)),
      maintenancePercentage: percentage,
      categories: [...maintenanceCategoriesList],
      amcContracts: [...amcContractsList],
    };
  });
}

export async function addAmcContract(
  contract: Omit<AmcContractRecord, "id">,
  actor: { name: string; role: string }
): Promise<AmcContractRecord> {
  return mockRequest(() => {
    const newContract: AmcContractRecord = {
      ...contract,
      id: `amc-${Date.now()}`,
    };
    amcContractsList.unshift(newContract);
    logAudit(
      actor.name,
      actor.role,
      "Infrastructure Maintenance (4.4.1)",
      "Created",
      `AMC Contract Added: ${newContract.facilityType} - ${newContract.vendorName} (₹${newContract.annualContractValueLakhs}L)`
    );
    return newContract;
  });
}

// ==========================================
// Metric 5.1.1: Scholarships & Freeships Beneficiaries
// ==========================================

let scholarshipData = { ...MOCK_SCHOLARSHIP_DATA };
let scholarshipBeneficiariesList = [...MOCK_SCHOLARSHIP_DATA.beneficiaries];
let scholarshipSchemesList = [...MOCK_SCHOLARSHIP_DATA.schemes];

export async function getScholarshipData(): Promise<ScholarshipData> {
  return mockRequest(() => {
    const totalCount = scholarshipData.totalBeneficiaries;
    const coverage = Number(((totalCount / (scholarshipData.totalStudentsEnrolled || 1)) * 100).toFixed(2));
    return {
      ...scholarshipData,
      coveragePercentage: coverage,
      schemes: [...scholarshipSchemesList],
      beneficiaries: [...scholarshipBeneficiariesList],
    };
  });
}

export async function addScholarshipBeneficiary(
  beneficiary: Omit<ScholarshipBeneficiaryRecord, "id">,
  actor: { name: string; role: string }
): Promise<ScholarshipBeneficiaryRecord> {
  return mockRequest(() => {
    const newBeneficiary: ScholarshipBeneficiaryRecord = {
      ...beneficiary,
      id: `sch-${Date.now()}`,
    };
    scholarshipBeneficiariesList.unshift(newBeneficiary);
    scholarshipData.totalBeneficiaries += 1;
    logAudit(
      actor.name,
      actor.role,
      "Scholarships & Freeships (5.1.1)",
      "Created",
      `Scholarship Beneficiary: ${newBeneficiary.studentName} (${newBeneficiary.rollNo}) - ${newBeneficiary.scholarshipScheme}`
    );
    return newBeneficiary;
  });
}

// ==========================================
// Metric 5.1.2: Capacity Building & Skills Development
// ==========================================

let skillEnhancementData = { ...MOCK_SKILL_ENHANCEMENT_DATA };
let skillProgrammesList = [...MOCK_SKILL_ENHANCEMENT_DATA.programmes];

export async function getSkillEnhancementData(): Promise<SkillEnhancementData> {
  return mockRequest(() => ({
    ...skillEnhancementData,
    totalProgrammesConducted: skillProgrammesList.length,
    totalBenefitedStudents: skillProgrammesList.reduce((sum, p) => sum + p.enrolledStudentsCount, 0),
    programmes: [...skillProgrammesList],
  }));
}

export async function addSkillProgramme(
  programme: Omit<SkillProgrammeRecord, "id">,
  actor: { name: string; role: string }
): Promise<SkillProgrammeRecord> {
  return mockRequest(() => {
    const newProg: SkillProgrammeRecord = {
      ...programme,
      id: `sk-${Date.now()}`,
    };
    skillProgrammesList.unshift(newProg);
    logAudit(
      actor.name,
      actor.role,
      "Capacity Building (5.1.2)",
      "Created",
      `Skill Programme: ${newProg.programmeTitle} (${newProg.capabilityType})`
    );
    return newProg;
  });
}

// ==========================================
// Metric 5.1.3: Competitive Exams Guidance & Counseling
// ==========================================

let careerGuidanceData = { ...MOCK_CAREER_GUIDANCE_DATA };
let coachingSessionsList = [...MOCK_CAREER_GUIDANCE_DATA.sessions];
let examQualifiersList = [...MOCK_CAREER_GUIDANCE_DATA.qualifiers];

export async function getCompetitiveExamGuidanceData(): Promise<CompetitiveExamGuidanceData> {
  return mockRequest(() => ({
    ...careerGuidanceData,
    programmesConducted: coachingSessionsList.length,
    totalStudentsTrained: coachingSessionsList.reduce((sum, s) => sum + s.studentsEnrolled, 0),
    totalStudentsQualified: coachingSessionsList.reduce((sum, s) => sum + s.qualifiedStudentsCount, 0),
    sessions: [...coachingSessionsList],
    qualifiers: [...examQualifiersList],
  }));
}

export async function addCoachingSession(
  session: Omit<CoachingSessionRecord, "id">,
  actor: { name: string; role: string }
): Promise<CoachingSessionRecord> {
  return mockRequest(() => {
    const newSession: CoachingSessionRecord = {
      ...session,
      id: `cg-${Date.now()}`,
    };
    coachingSessionsList.unshift(newSession);
    logAudit(
      actor.name,
      actor.role,
      "Career Guidance (5.1.3)",
      "Created",
      `Coaching Track: ${newSession.courseTitle} (${newSession.examTrack})`
    );
    return newSession;
  });
}

export async function addExamQualifier(
  qualifier: Omit<ExamQualifierRecord, "id">,
  actor: { name: string; role: string }
): Promise<ExamQualifierRecord> {
  return mockRequest(() => {
    const newQualifier: ExamQualifierRecord = {
      ...qualifier,
      id: `qual-${Date.now()}`,
    };
    examQualifiersList.unshift(newQualifier);
    logAudit(
      actor.name,
      actor.role,
      "Career Guidance (5.1.3)",
      "Created",
      `Competitive Exam Qualifier: ${newQualifier.studentName} (${newQualifier.examName} - ${newQualifier.allIndiaRankOrScore})`
    );
    return newQualifier;
  });
}

// ==========================================
// Metric 5.2.1: Placements & Higher Education Progression
// ==========================================

let placementProgressionData = { ...MOCK_STUDENT_PROGRESSION_DATA };
let placementOffersList = [...MOCK_STUDENT_PROGRESSION_DATA.offers];
let higherStudiesList = [...MOCK_STUDENT_PROGRESSION_DATA.higherStudies];

export async function getPlacementProgressionData(): Promise<PlacementProgressionData> {
  return mockRequest(() => {
    const totalProgression = placementProgressionData.uniqueStudentsPlaced + higherStudiesList.length;
    const percentage = Number(((totalProgression / (placementProgressionData.totalGraduatingStudents || 1)) * 100).toFixed(2));
    return {
      ...placementProgressionData,
      higherEducationProgressionCount: higherStudiesList.length,
      totalPlacementProgressionPercentage: percentage,
      offers: [...placementOffersList],
      higherStudies: [...higherStudiesList],
    };
  });
}

export async function addPlacementOffer(
  offer: Omit<PlacementOfferRecord, "id">,
  actor: { name: string; role: string }
): Promise<PlacementOfferRecord> {
  return mockRequest(() => {
    const newOffer: PlacementOfferRecord = {
      ...offer,
      id: `off-${Date.now()}`,
    };
    placementOffersList.unshift(newOffer);
    placementProgressionData.totalCampusOffers += 1;
    logAudit(
      actor.name,
      actor.role,
      "Placement & Progression (5.2.1)",
      "Created",
      `Placement Offer: ${newOffer.studentName} (${newOffer.companyName} - ₹${newOffer.ctcLakhsPerAnnum} LPA)`
    );
    return newOffer;
  });
}

export async function addHigherStudiesAdmit(
  admit: Omit<HigherStudiesAdmitRecord, "id">,
  actor: { name: string; role: string }
): Promise<HigherStudiesAdmitRecord> {
  return mockRequest(() => {
    const newAdmit: HigherStudiesAdmitRecord = {
      ...admit,
      id: `hs-${Date.now()}`,
    };
    higherStudiesList.unshift(newAdmit);
    logAudit(
      actor.name,
      actor.role,
      "Placement & Progression (5.2.1)",
      "Created",
      `Higher Studies Progression: ${newAdmit.studentName} (${newAdmit.admittedInstitution} - ${newAdmit.programmeEnrolled})`
    );
    return newAdmit;
  });
}

// ==========================================
// Metric 5.4.1: Alumni Association & Chapter Activities
// ==========================================

let alumniAssociationData = { ...MOCK_ALUMNI_ASSOCIATION_DATA };
let alumniProfilesList = [...MOCK_ALUMNI_ASSOCIATION_DATA.alumniProfiles];
let alumniMeetingsList = [...MOCK_ALUMNI_ASSOCIATION_DATA.meetings];
let alumniContributionsList = [...MOCK_ALUMNI_ASSOCIATION_DATA.financialContributions];

export async function getAlumniAssociationData(): Promise<AlumniAssociationData> {
  return mockRequest(() => {
    const totalContribLakhs = alumniContributionsList.reduce((sum, c) => sum + c.totalAmountLakhs, 0);
    return {
      ...alumniAssociationData,
      totalRegisteredAlumni: alumniAssociationData.totalRegisteredAlumni,
      totalFinancialContributionLakhs: Number(totalContribLakhs.toFixed(2)),
      activeChaptersCount: new Set(alumniProfilesList.map((p) => p.chapter)).size,
      alumniProfiles: [...alumniProfilesList],
      meetings: [...alumniMeetingsList],
      financialContributions: [...alumniContributionsList],
    };
  });
}

export async function addAlumniProfile(
  profile: Omit<AlumniProfileRecord, "id">,
  actor: { name: string; role: string }
): Promise<AlumniProfileRecord> {
  return mockRequest(() => {
    const newProfile: AlumniProfileRecord = {
      ...profile,
      id: `alum-${Date.now()}`,
    };
    alumniProfilesList.unshift(newProfile);
    alumniAssociationData.totalRegisteredAlumni += 1;
    logAudit(
      actor.name,
      actor.role,
      "Alumni Association (5.4.1)",
      "Created",
      `Alumni Profile: ${newProfile.name} (Batch ${newProfile.batchYear}, ${newProfile.currentOrganization})`
    );
    return newProfile;
  });
}

export async function addAlumniChapterMeeting(
  meeting: Omit<AlumniChapterMeetingRecord, "id">,
  actor: { name: string; role: string }
): Promise<AlumniChapterMeetingRecord> {
  return mockRequest(() => {
    const newMeeting: AlumniChapterMeetingRecord = {
      ...meeting,
      id: `meet-${Date.now()}`,
    };
    alumniMeetingsList.unshift(newMeeting);
    logAudit(
      actor.name,
      actor.role,
      "Alumni Association (5.4.1)",
      "Created",
      `Alumni Meet: ${newMeeting.meetingTitle} (${newMeeting.chapter})`
    );
    return newMeeting;
  });
}

export async function addAlumniContribution(
  contribution: AlumniContributionCategory,
  actor: { name: string; role: string }
): Promise<AlumniContributionCategory> {
  return mockRequest(() => {
    alumniContributionsList.unshift(contribution);
    logAudit(
      actor.name,
      actor.role,
      "Alumni Association (5.4.1)",
      "Created",
      `Alumni Contribution: ${contribution.categoryName} (₹${contribution.totalAmountLakhs}L)`
    );
    return contribution;
  });
}

// ==========================================
// Metric 6.1.1: Strategic Planning & Deployment
// ==========================================

let strategicPlanData = { ...MOCK_STRATEGIC_PLAN_DATA };
let strategicGoalsList = [...MOCK_STRATEGIC_PLAN_DATA.goals];
let governanceCommitteesList = [...MOCK_STRATEGIC_PLAN_DATA.committees];

export async function getStrategicPlanData(): Promise<StrategicPlanData> {
  return mockRequest(() => {
    const avgProgress = Number((strategicGoalsList.reduce((sum, g) => sum + g.achievementPercentage, 0) / (strategicGoalsList.length || 1)).toFixed(1));
    return {
      ...strategicPlanData,
      overallMilestoneAchievementPercentage: avgProgress,
      goals: [...strategicGoalsList],
      committees: [...governanceCommitteesList],
    };
  });
}

export async function addStrategicGoal(
  goal: Omit<StrategicGoalRecord, "id">,
  actor: { name: string; role: string }
): Promise<StrategicGoalRecord> {
  return mockRequest(() => {
    const newGoal: StrategicGoalRecord = {
      ...goal,
      id: `goal-${Date.now()}`,
    };
    strategicGoalsList.unshift(newGoal);
    logAudit(
      actor.name,
      actor.role,
      "Strategic Planning (6.1.1)",
      "Created",
      `Strategic Goal: ${newGoal.goalNumber} (${newGoal.pillar})`
    );
    return newGoal;
  });
}

export async function addGovernanceCommittee(
  committee: Omit<GovernanceCommitteeRecord, "id">,
  actor: { name: string; role: string }
): Promise<GovernanceCommitteeRecord> {
  return mockRequest(() => {
    const newCommittee: GovernanceCommitteeRecord = {
      ...committee,
      id: `com-${Date.now()}`,
    };
    governanceCommitteesList.unshift(newCommittee);
    logAudit(
      actor.name,
      actor.role,
      "Governance & Leadership (6.1.1)",
      "Created",
      `Committee: ${newCommittee.committeeName}`
    );
    return newCommittee;
  });
}

// ==========================================
// Metric 6.2.2: E-Governance Across Operational Domains
// ==========================================

let eGovernanceData = { ...MOCK_EGOVERNANCE_DATA };
let eGovPillarsList = [...MOCK_EGOVERNANCE_DATA.pillars];
let eGovAuditLogsList = [...MOCK_EGOVERNANCE_DATA.auditLogs];

export async function getEGovernanceData(): Promise<EGovernanceData> {
  return mockRequest(() => ({
    ...eGovernanceData,
    totalDesignatedDomainsOperational: eGovPillarsList.filter((p) => p.auditStatus === "Fully Digitized & Verified").length,
    pillars: [...eGovPillarsList],
    auditLogs: [...eGovAuditLogsList],
  }));
}

export async function addErpModuleAudit(
  audit: Omit<ErpModuleAuditRecord, "id">,
  actor: { name: string; role: string }
): Promise<ErpModuleAuditRecord> {
  return mockRequest(() => {
    const newAudit: ErpModuleAuditRecord = {
      ...audit,
      id: `log-${Date.now()}`,
    };
    eGovAuditLogsList.unshift(newAudit);
    logAudit(
      actor.name,
      actor.role,
      "E-Governance (6.2.2)",
      "Created",
      `ERP Audit Log: ${newAudit.moduleCode} - ${newAudit.domain}`
    );
    return newAudit;
  });
}

// ==========================================
// Metric 6.3.1: Staff Development & Seed Grants
// ==========================================

let facultyEmpowermentData = { ...MOCK_FACULTY_EMPOWERMENT_DATA };
let seedGrantsList = [...MOCK_FACULTY_EMPOWERMENT_DATA.seedGrants];
let fdpSponsorshipsList = [...MOCK_FACULTY_EMPOWERMENT_DATA.fdpSponsorships];
let appraisalsList = [...MOCK_FACULTY_EMPOWERMENT_DATA.appraisals];

export async function getFacultyEmpowermentData(): Promise<FacultyEmpowermentData> {
  return mockRequest(() => {
    const totalSeed = seedGrantsList.reduce((sum, g) => sum + g.grantAmountInr, 0) / 100000;
    const totalTravel = fdpSponsorshipsList.reduce((sum, f) => sum + f.amountReimbursedInr, 0) / 100000;
    return {
      ...facultyEmpowermentData,
      totalSeedGrantsLakhs: Number(totalSeed.toFixed(2)),
      totalFacultyBenefitedSeedGrants: seedGrantsList.length,
      totalTravelConferenceSupportLakhs: Number(totalTravel.toFixed(2)),
      totalFacultySponsoredFdp: fdpSponsorshipsList.length,
      totalAppraisalsProcessed: appraisalsList.length,
      seedGrants: [...seedGrantsList],
      fdpSponsorships: [...fdpSponsorshipsList],
      appraisals: [...appraisalsList],
    };
  });
}

export async function addSeedGrant(
  grant: Omit<SeedGrantRecord, "id">,
  actor: { name: string; role: string }
): Promise<SeedGrantRecord> {
  return mockRequest(() => {
    const newGrant: SeedGrantRecord = {
      ...grant,
      id: `seed-${Date.now()}`,
    };
    seedGrantsList.unshift(newGrant);
    logAudit(
      actor.name,
      actor.role,
      "Faculty Empowerment (6.3.1)",
      "Created",
      `Seed Grant Sanction: ${newGrant.facultyName} (₹${(newGrant.grantAmountInr / 100000).toFixed(2)}L)`
    );
    return newGrant;
  });
}

export async function addFdpSponsorship(
  fdp: Omit<FdpSponsorshipRecord, "id">,
  actor: { name: string; role: string }
): Promise<FdpSponsorshipRecord> {
  return mockRequest(() => {
    const newFdp: FdpSponsorshipRecord = {
      ...fdp,
      id: `fdp-${Date.now()}`,
    };
    fdpSponsorshipsList.unshift(newFdp);
    logAudit(
      actor.name,
      actor.role,
      "Faculty Empowerment (6.3.1)",
      "Created",
      `FDP/Conference Sponsorship: ${newFdp.facultyName} (${newFdp.eventTitle})`
    );
    return newFdp;
  });
}

// ==========================================
// Metric 6.4.1: Budget Allocation, Utilization & Audits
// ==========================================

let financialAuditsData = { ...MOCK_FINANCIAL_AUDITS_DATA };
let financialAuditsList = [...MOCK_FINANCIAL_AUDITS_DATA.audits];
let budgetBreakdownList = [...MOCK_FINANCIAL_AUDITS_DATA.budgetBreakdown];

export async function getAuditedBalanceSheetData(): Promise<AuditedBalanceSheetData> {
  return mockRequest(() => {
    const totalAllocated = budgetBreakdownList.reduce((sum, b) => sum + b.allocatedBudgetLakhs, 0);
    const totalSpent = budgetBreakdownList.reduce((sum, b) => sum + b.utilizedExpenditureLakhs, 0);
    const utilPct = Number(((totalSpent / (totalAllocated || 1)) * 100).toFixed(2));
    return {
      ...financialAuditsData,
      totalInstitutionalBudgetLakhs: Number(totalAllocated.toFixed(2)),
      totalAuditedExpenditureLakhs: Number(totalSpent.toFixed(2)),
      overallUtilizationPercentage: utilPct,
      audits: [...financialAuditsList],
      budgetBreakdown: [...budgetBreakdownList],
    };
  });
}

export async function addFinancialAuditRecord(
  audit: Omit<FinancialAuditRecord, "id">,
  actor: { name: string; role: string }
): Promise<FinancialAuditRecord> {
  return mockRequest(() => {
    const newAudit: FinancialAuditRecord = {
      ...audit,
      id: `fa-${Date.now()}`,
    };
    financialAuditsList.unshift(newAudit);
    logAudit(
      actor.name,
      actor.role,
      "Financial Audits (6.4.1)",
      "Created",
      `Financial Audit: ${newAudit.financialYear} (${newAudit.auditType})`
    );
    return newAudit;
  });
}

export async function addBudgetAllocationRecord(
  budget: BudgetAllocationRecord,
  actor: { name: string; role: string }
): Promise<BudgetAllocationRecord> {
  return mockRequest(() => {
    budgetBreakdownList.unshift(budget);
    logAudit(
      actor.name,
      actor.role,
      "Budget Allocation (6.4.1)",
      "Created",
      `Budget Head: ${budget.headCategory} (₹${budget.allocatedBudgetLakhs}L)`
    );
    return budget;
  });
}

// ==========================================
// Metric 7.1.1: Gender Equity Promotion & Safety Facilities
// ==========================================

let genderEquityData = { ...MOCK_GENDER_EQUITY_DATA };
let genderFacilitiesList = [...MOCK_GENDER_EQUITY_DATA.facilities];
let genderEventsList = [...MOCK_GENDER_EQUITY_DATA.sensitizationEvents];

export async function getGenderEquityData(): Promise<GenderEquityData> {
  return mockRequest(() => ({
    ...genderEquityData,
    facilities: [...genderFacilitiesList],
    sensitizationEvents: [...genderEventsList],
  }));
}

export async function addGenderSafetyFacility(
  facility: Omit<GenderSafetyFacilityRecord, "id">,
  actor: { name: string; role: string }
): Promise<GenderSafetyFacilityRecord> {
  return mockRequest(() => {
    const newFacility: GenderSafetyFacilityRecord = {
      ...facility,
      id: `gen-${Date.now()}`,
    };
    genderFacilitiesList.unshift(newFacility);
    logAudit(
      actor.name,
      actor.role,
      "Gender Equity (7.1.1)",
      "Created",
      `Gender Safety Facility: ${newFacility.facilityName}`
    );
    return newFacility;
  });
}

export async function addGenderSensitizationEvent(
  event: Omit<GenderSensitizationEventRecord, "id">,
  actor: { name: string; role: string }
): Promise<GenderSensitizationEventRecord> {
  return mockRequest(() => {
    const newEvent: GenderSensitizationEventRecord = {
      ...event,
      id: `gev-${Date.now()}`,
    };
    genderEventsList.unshift(newEvent);
    logAudit(
      actor.name,
      actor.role,
      "Gender Equity (7.1.1)",
      "Created",
      `Gender Event: ${newEvent.eventTitle}`
    );
    return newEvent;
  });
}

// ==========================================
// Metric 7.1.2: Renewable Energy & Conservation
// ==========================================

let renewableEnergyData = { ...MOCK_RENEWABLE_ENERGY_DATA };
let energyInitiativesList = [...MOCK_RENEWABLE_ENERGY_DATA.initiatives];
let solarGenerationLogsList = [...MOCK_RENEWABLE_ENERGY_DATA.generationMonthlyLogs];

export async function getRenewableEnergyData(): Promise<RenewableEnergyData> {
  return mockRequest(() => {
    const totalGen = solarGenerationLogsList.reduce((sum, l) => sum + l.solarGenerationUnitsKwh, 0);
    return {
      ...renewableEnergyData,
      annualSolarGenerationUnits: totalGen > 0 ? totalGen : renewableEnergyData.annualSolarGenerationUnits,
      initiatives: [...energyInitiativesList],
      generationMonthlyLogs: [...solarGenerationLogsList],
    };
  });
}

export async function addSolarGenerationRecord(
  log: Omit<SolarEnergyGenerationRecord, "id">,
  actor: { name: string; role: string }
): Promise<SolarEnergyGenerationRecord> {
  return mockRequest(() => {
    const newLog: SolarEnergyGenerationRecord = {
      ...log,
      id: `sol-${Date.now()}`,
    };
    solarGenerationLogsList.unshift(newLog);
    logAudit(
      actor.name,
      actor.role,
      "Renewable Energy (7.1.2)",
      "Created",
      `Solar Generation Log: ${newLog.billingMonth} (${newLog.solarGenerationUnitsKwh} kWh)`
    );
    return newLog;
  });
}

// ==========================================
// Metric 7.1.3: Waste Management & Water Conservation
// ==========================================

let environmentalAuditData = { ...MOCK_ENVIRONMENT_MANAGEMENT_DATA };
let wasteFacilitiesList = [...MOCK_ENVIRONMENT_MANAGEMENT_DATA.wasteFacilities];
let rainwaterUnitsList = [...MOCK_ENVIRONMENT_MANAGEMENT_DATA.rainwaterUnits];

export async function getEnvironmentalAuditData(): Promise<EnvironmentalAuditData> {
  return mockRequest(() => {
    const totalRwh = rainwaterUnitsList.reduce((sum, u) => sum + u.storageCapacityLitres, 0);
    return {
      ...environmentalAuditData,
      totalRainwaterCapacityLitres: totalRwh > 0 ? totalRwh : environmentalAuditData.totalRainwaterCapacityLitres,
      wasteFacilities: [...wasteFacilitiesList],
      rainwaterUnits: [...rainwaterUnitsList],
    };
  });
}

export async function addWasteFacility(
  facility: Omit<WasteManagementFacilityRecord, "id">,
  actor: { name: string; role: string }
): Promise<WasteManagementFacilityRecord> {
  return mockRequest(() => {
    const newFacility: WasteManagementFacilityRecord = {
      ...facility,
      id: `w-${Date.now()}`,
    };
    wasteFacilitiesList.unshift(newFacility);
    logAudit(
      actor.name,
      actor.role,
      "Environmental Management (7.1.3)",
      "Created",
      `Waste Facility: ${newFacility.facilityName} (${newFacility.wasteType})`
    );
    return newFacility;
  });
}

export async function addRainwaterUnit(
  unit: Omit<RainwaterHarvestingRecord, "id">,
  actor: { name: string; role: string }
): Promise<RainwaterHarvestingRecord> {
  return mockRequest(() => {
    const newUnit: RainwaterHarvestingRecord = {
      ...unit,
      id: `rwh-${Date.now()}`,
    };
    rainwaterUnitsList.unshift(newUnit);
    logAudit(
      actor.name,
      actor.role,
      "Water Conservation (7.1.3)",
      "Created",
      `Rainwater Unit: ${newUnit.unitLocation} (${newUnit.storageCapacityLitres}L)`
    );
    return newUnit;
  });
}

// ==========================================
// Metric 7.1.7: Divyangjan Barrier-Free Facilities
// ==========================================

let divyangjanInclusionData = { ...MOCK_DIVYANGJAN_FACILITIES_DATA };
let divyangjanFacilitiesList = [...MOCK_DIVYANGJAN_FACILITIES_DATA.facilities];
let assistiveToolsList = [...MOCK_DIVYANGJAN_FACILITIES_DATA.assistiveTools];

export async function getDivyangjanInclusionData(): Promise<DivyangjanInclusionData> {
  return mockRequest(() => ({
    ...divyangjanInclusionData,
    facilities: [...divyangjanFacilitiesList],
    assistiveTools: [...assistiveToolsList],
  }));
}

export async function addDivyangjanFacility(
  facility: Omit<DivyangjanFacilityRecord, "id">,
  actor: { name: string; role: string }
): Promise<DivyangjanFacilityRecord> {
  return mockRequest(() => {
    const newFacility: DivyangjanFacilityRecord = {
      ...facility,
      id: `div-${Date.now()}`,
    };
    divyangjanFacilitiesList.unshift(newFacility);
    logAudit(
      actor.name,
      actor.role,
      "Divyangjan Inclusion (7.1.7)",
      "Created",
      `Barrier-Free Facility: ${newFacility.facilityName}`
    );
    return newFacility;
  });
}

export async function addAssistiveTool(
  tool: Omit<AssistiveTechnologyRecord, "id">,
  actor: { name: string; role: string }
): Promise<AssistiveTechnologyRecord> {
  return mockRequest(() => {
    const newTool: AssistiveTechnologyRecord = {
      ...tool,
      id: `tool-${Date.now()}`,
    };
    assistiveToolsList.unshift(newTool);
    logAudit(
      actor.name,
      actor.role,
      "Divyangjan Inclusion (7.1.7)",
      "Created",
      `Assistive Tool: ${newTool.softwareOrToolName}`
    );
    return newTool;
  });
}




