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
  doc: Omit<NaacEvidenceDocument, "id" | "uploadDate" | "status" | "version">,
  actor: { name: string; role: string }
): Promise<NaacEvidenceDocument> {
  return mockRequest(() => {
    const newDoc: NaacEvidenceDocument = {
      ...doc,
      id: `evi-${Date.now()}`,
      uploadDate: new Date().toISOString().slice(0, 10),
      status: "Uploaded",
      version: "v1.0",
      uploadedBy: actor.name,
    };
    evidenceList.unshift(newDoc);
    logAudit(actor.name, actor.role, "Evidence Repository", "Created", newDoc.title, undefined, newDoc.status);
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

export async function getEvidenceForMetric(metricCode: string): Promise<NaacEvidenceDocument[]> {
  return mockRequest(() => {
    return evidenceList.filter((e) => e.metricCode === metricCode);
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
