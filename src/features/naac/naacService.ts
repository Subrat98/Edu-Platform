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
