import type { AppNotification, InstitutionType, RoleKey } from "@/types";

const notifications: AppNotification[] = [
  {
    id: "notif-seed-1",
    institutionId: "school",
    category: "General",
    title: "Half-Yearly Examination schedule released",
    body: "The Half-Yearly Examination 2026 timetable has been published on the Notices page.",
    timestamp: "2026-10-20T09:00:00",
  },
  {
    id: "notif-seed-2",
    institutionId: "school",
    category: "Finance",
    title: "Term 1 fee due date approaching",
    body: "Term 1 fees for 2026-27 are due by 15 Nov 2026. Pay early to avoid a late fee.",
    timestamp: "2026-10-22T09:00:00",
    roles: ["parent", "accountant", "institution_admin"],
  },
  {
    id: "notif-seed-3",
    institutionId: "school",
    category: "Academics",
    title: "Staff meeting on Friday",
    body: "All teaching staff are requested to attend the academic review meeting at 3:30 PM in the staff room.",
    timestamp: "2026-10-23T09:00:00",
    roles: ["teacher", "principal"],
  },
  {
    id: "notif-seed-4",
    institutionId: "college",
    category: "Library",
    title: "Library closed for stock verification",
    body: "The central library will remain closed on 2 Nov 2026 for annual stock verification.",
    timestamp: "2026-10-21T09:00:00",
  },
  {
    id: "notif-seed-5",
    institutionId: "college",
    category: "Academics",
    title: "Odd Semester practical exams begin 18 Nov",
    body: "Practical examination schedules for all departments have been shared with HODs.",
    timestamp: "2026-10-25T09:00:00",
    roles: ["faculty", "principal", "student"],
  },
];
let seq = notifications.length;

export function pushNotification(entry: Omit<AppNotification, "id" | "timestamp">): void {
  seq += 1;
  notifications.unshift({ ...entry, id: `notif-live-${seq}`, timestamp: "2026-10-30T00:00:00" });
}

export function getNotificationsFor(institutionId: InstitutionType, role: RoleKey, studentIds: string[] = []): AppNotification[] {
  return notifications
    .filter((n) => n.institutionId === institutionId)
    .filter((n) => !n.roles || n.roles.includes(role))
    .filter((n) => !n.studentId || studentIds.includes(n.studentId))
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}
