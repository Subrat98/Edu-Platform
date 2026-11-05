import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  FileText,
  Menu as MenuIcon,
  Palette,
  Megaphone,
  Image as ImageIcon,
  BookOpen,
  ScanLine,
  Repeat,
  Bookmark,
  Receipt,
  Users,
  BarChart3,
  History,
  Search,
  IndianRupee,
  ClipboardList,
  GraduationCap,
  CalendarCheck,
  CalendarDays,
  PenSquare,
  Wallet,
  Contact,
  Table2,
  ShieldCheck,
  Building2,
  ScrollText,
  LineChart,
  Baby,
  Wand2,
  FileQuestion,
  Network,
  BookMarked,
  FileBadge,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  end?: boolean;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

export const adminNavGroups: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true }],
  },
  {
    label: "Website CMS",
    items: [
      { label: "Pages", path: "/admin/cms/pages", icon: FileText },
      { label: "Menu Builder", path: "/admin/cms/menus", icon: MenuIcon },
      { label: "Theme Designer", path: "/admin/cms/theme", icon: Palette },
      { label: "Notices", path: "/admin/cms/notices", icon: Megaphone },
      { label: "Media Library", path: "/admin/cms/media", icon: ImageIcon },
    ],
  },
  {
    label: "Admissions",
    items: [
      { label: "Applications", path: "/admin/admissions", icon: ClipboardList, end: true },
    ],
  },
  {
    label: "Students",
    items: [
      { label: "Student Directory", path: "/admin/students", icon: GraduationCap, end: true },
      { label: "Guardians", path: "/admin/students/guardians", icon: Users },
      { label: "Leave Requests", path: "/admin/students/leave-requests", icon: CalendarDays },
      { label: "Certificate Requests", path: "/admin/students/certificates", icon: FileBadge },
    ],
  },
  {
    label: "Staff & Faculty",
    items: [{ label: "Directory", path: "/admin/staff", icon: Contact, end: true }],
  },
  {
    label: "Academics",
    items: [
      { label: "Timetable", path: "/admin/academics/timetable", icon: Table2 },
      { label: "Attendance — Mark", path: "/admin/attendance/mark", icon: CalendarCheck },
      { label: "Attendance — Reports", path: "/admin/attendance/reports", icon: CalendarDays },
      { label: "Examinations", path: "/admin/examinations", icon: PenSquare, end: true },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Invoices", path: "/admin/finance/invoices", icon: Receipt, end: true },
      { label: "Fee Structures", path: "/admin/finance/structures", icon: Wallet },
    ],
  },
  {
    label: "Reports",
    items: [{ label: "Analytics", path: "/admin/reports", icon: LineChart, end: true }],
  },
  {
    label: "Settings",
    items: [
      { label: "Users & Roles", path: "/admin/settings/users", icon: ShieldCheck, end: true },
      { label: "Institution Profile", path: "/admin/settings/institution", icon: Building2 },
      { label: "Activity Log", path: "/admin/settings/activity-log", icon: ScrollText },
    ],
  },
];

// Admission Officer and Accountant get a narrower nav than the full
// institution_admin/principal view, matching the spec's "Admission
// workflows only" / "Financial functions only" access boundaries —
// reuses the same group objects, so the pages themselves need no change.
export const admissionOfficerNavGroups: AdminNavGroup[] = [
  adminNavGroups[0]!,
  adminNavGroups.find((g) => g.label === "Admissions")!,
  adminNavGroups.find((g) => g.label === "Students")!,
  adminNavGroups.find((g) => g.label === "Reports")!,
];

export const accountantNavGroups: AdminNavGroup[] = [
  adminNavGroups[0]!,
  adminNavGroups.find((g) => g.label === "Finance")!,
  adminNavGroups.find((g) => g.label === "Students")!,
  adminNavGroups.find((g) => g.label === "Reports")!,
];

// Only ever shown to platform_admin — see AdminLayout.tsx. Creating a new
// institution is a platform-level action, not something any individual
// institution's own admin should be able to do.
export const platformNavGroups: AdminNavGroup[] = [
  {
    label: "Platform",
    items: [{ label: "Setup Wizard", path: "/admin/platform/setup-wizard", icon: Wand2, end: true }],
  },
];

export const studentNavGroups: AdminNavGroup[] = [
  {
    label: "My Portal",
    items: [
      { label: "Dashboard", path: "/portal/student", icon: LayoutDashboard, end: true },
      { label: "My Courses", path: "/portal/student/courses", icon: BookMarked },
    ],
  },
  {
    label: "Library",
    items: [
      { label: "Catalogue", path: "/portal/student/library", icon: Search, end: true },
      { label: "My Bookings", path: "/portal/student/library/bookings", icon: Bookmark },
      { label: "My Loans", path: "/portal/student/library/loans", icon: BookOpen },
      { label: "My Fines", path: "/portal/student/library/fines", icon: IndianRupee },
    ],
  },
];

export const teacherNavGroups: AdminNavGroup[] = [
  {
    label: "My Portal",
    items: [{ label: "Dashboard", path: "/portal/teacher", icon: LayoutDashboard, end: true }],
  },
  {
    label: "Teaching",
    items: [
      { label: "My Classes", path: "/portal/teacher/classes", icon: GraduationCap, end: true },
      { label: "My Timetable", path: "/portal/teacher/timetable", icon: Table2 },
      { label: "Mark Attendance", path: "/portal/teacher/attendance", icon: CalendarCheck },
      { label: "Examinations", path: "/portal/teacher/examinations", icon: PenSquare, end: true },
      { label: "Leave Requests", path: "/portal/teacher/leave-requests", icon: CalendarDays },
    ],
  },
];

export const parentNavGroups: AdminNavGroup[] = [
  {
    label: "My Portal",
    items: [{ label: "Dashboard", path: "/portal/parent", icon: Baby, end: true }],
  },
];

export const examCellNavGroups: AdminNavGroup[] = [
  {
    label: "My Portal",
    items: [{ label: "Dashboard", path: "/portal/examcell", icon: LayoutDashboard, end: true }],
  },
  {
    label: "Examinations",
    items: [
      { label: "All Examinations", path: "/portal/examcell/examinations", icon: PenSquare, end: true },
      { label: "Revaluation Requests", path: "/portal/examcell/revaluation", icon: FileQuestion },
    ],
  },
];

export const hodNavGroups: AdminNavGroup[] = [
  {
    label: "My Portal",
    items: [{ label: "Department Dashboard", path: "/portal/hod", icon: Network, end: true }],
  },
];

export const librarianNavGroups: AdminNavGroup[] = [
  {
    label: "Library Desk",
    items: [
      { label: "Dashboard", path: "/portal/librarian", icon: LayoutDashboard, end: true },
      { label: "Verify Booking", path: "/portal/librarian/verify", icon: ScanLine },
      { label: "Catalogue", path: "/portal/librarian/catalogue", icon: BookOpen },
      { label: "Circulation", path: "/portal/librarian/circulation", icon: Repeat },
      { label: "Reservations", path: "/portal/librarian/reservations", icon: Bookmark },
      { label: "Fines", path: "/portal/librarian/fines", icon: Receipt },
      { label: "Members", path: "/portal/librarian/members", icon: Users },
      { label: "Reports", path: "/portal/librarian/reports", icon: BarChart3 },
      { label: "Audit Log", path: "/portal/librarian/audit", icon: History },
    ],
  },
];
