import { NavLink } from "react-router-dom";
import {
  Home,
  Megaphone,
  Users,
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  CalendarCheck,
  Trophy,
  Search,
  PenSquare,
  Baby,
  Network,
  ScanLine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface Tab {
  label: string;
  path: string;
  icon: LucideIcon;
  end?: boolean;
}

interface BottomTabBarProps {
  tabs: Tab[];
}

export function BottomTabBar({ tabs }: BottomTabBarProps) {
  return (
    <nav
      className="bg-surface border-border fixed right-0 bottom-0 left-0 z-50 flex border-t xl:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          end={tab.end}
          className={({ isActive }) =>
            cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
              isActive
                ? "text-accent"
                : "text-muted-foreground hover:text-foreground",
            )
          }
        >
          {({ isActive }) => (
            <>
              <tab.icon className={cn("size-5", isActive && "text-accent")} />
              <span>{tab.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

// ── Public site tabs ──────────────────────────────────────────────────────────

/** School public site: Home / Notices / Parents / Admissions */
export const schoolPublicTabs: Tab[] = [
  { label: "Home", path: "/school", icon: Home, end: true },
  { label: "Notices", path: "/school/notices", icon: Megaphone },
  { label: "Parents", path: "/school/parent-corner", icon: Users },
  { label: "Admissions", path: "/school/admissions", icon: GraduationCap },
];

/** College public site: Home / Programmes / Notices / Admissions */
export const collegePublicTabs: Tab[] = [
  { label: "Home", path: "/college", icon: Home, end: true },
  { label: "Programmes", path: "/college/programmes", icon: BookOpen },
  { label: "Notices", path: "/college/news-events", icon: Megaphone },
  { label: "Admissions", path: "/college/admissions", icon: GraduationCap },
];

// ── Portal tabs (one entry per role) ─────────────────────────────────────────

/** Student portal: Dashboard / Courses / Library / (no room for more — 4 items) */
export const studentPortalTabs: Tab[] = [
  {
    label: "Home",
    path: "/portal/student",
    icon: LayoutDashboard,
    end: true,
  },
  { label: "Courses", path: "/portal/student/courses", icon: BookOpen },
  {
    label: "Attendance",
    path: "/portal/student/attendance",
    icon: CalendarCheck,
  },
  { label: "Library", path: "/portal/student/library", icon: Search, end: true },
];

/** Teacher portal: Dashboard / Classes / Attendance / Exams */
export const teacherPortalTabs: Tab[] = [
  {
    label: "Home",
    path: "/portal/teacher",
    icon: LayoutDashboard,
    end: true,
  },
  { label: "Classes", path: "/portal/teacher/classes", icon: GraduationCap },
  {
    label: "Attendance",
    path: "/portal/teacher/attendance",
    icon: CalendarCheck,
  },
  { label: "Exams", path: "/portal/teacher/examinations", icon: PenSquare },
];

/** Parent portal: single Dashboard tab */
export const parentPortalTabs: Tab[] = [
  { label: "Dashboard", path: "/portal/parent", icon: Baby, end: true },
];

/** Exam-cell portal: Dashboard / Examinations / Revaluation */
export const examCellPortalTabs: Tab[] = [
  {
    label: "Home",
    path: "/portal/examcell",
    icon: LayoutDashboard,
    end: true,
  },
  { label: "Exams", path: "/portal/examcell/examinations", icon: PenSquare },
];

/** HoD portal: single Department Dashboard tab */
export const hodPortalTabs: Tab[] = [
  { label: "Department", path: "/portal/hod", icon: Network, end: true },
];

/** Librarian portal: Dashboard / Verify / Catalogue / Circulation */
export const librarianPortalTabs: Tab[] = [
  {
    label: "Home",
    path: "/portal/librarian",
    icon: LayoutDashboard,
    end: true,
  },
  { label: "Verify", path: "/portal/librarian/verify", icon: ScanLine },
  { label: "Catalogue", path: "/portal/librarian/catalogue", icon: BookOpen },
  { label: "Members", path: "/portal/librarian/members", icon: Users },
];

/** Trophy icon re-exported for convenience (used in parent messages) */
export { Trophy };
