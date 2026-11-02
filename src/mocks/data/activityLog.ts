import type { ActivityCategory, ActivityEvent, InstitutionType } from "@/types";

const events: ActivityEvent[] = [
  {
    id: "act-seed-1",
    institutionId: "school",
    category: "CMS",
    action: "Published Home page",
    actor: "Sujata Rout",
    timestamp: "2026-10-24T09:15:00",
    detail: "Published via Page Builder",
  },
  {
    id: "act-seed-2",
    institutionId: "school",
    category: "Admissions",
    action: "Reviewed application",
    actor: "Priyanka Senapati",
    timestamp: "2026-10-26T11:40:00",
  },
  {
    id: "act-seed-3",
    institutionId: "college",
    category: "Finance",
    action: "Recorded fee payment",
    actor: "Accounts Office",
    timestamp: "2026-10-27T14:05:00",
  },
];
let seq = events.length;

export function logActivity(entry: Omit<ActivityEvent, "id" | "timestamp">): void {
  seq += 1;
  events.unshift({ ...entry, id: `act-live-${seq}`, timestamp: "2026-10-30T00:00:00" });
}

export function getActivityByInstitution(institutionId: InstitutionType, category?: ActivityCategory): ActivityEvent[] {
  return events
    .filter((e) => e.institutionId === institutionId && (!category || e.category === category))
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}
