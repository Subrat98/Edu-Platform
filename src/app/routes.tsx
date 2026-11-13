import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { PortalLayout } from "@/layouts/PortalLayout";
import { InstitutionRouteGuard } from "@/features/institutions/InstitutionRouteGuard";
import { InstitutionRootRedirect } from "@/features/institutions/InstitutionRootRedirect";
import { LoginPage } from "@/features/auth/LoginPage";
import { RequireAuth, RequireRole } from "@/features/auth/guards";
import { PortalIndexRedirect } from "@/features/auth/PortalIndexRedirect";
import { NotFoundPage } from "@/app/NotFoundPage";

// --- School pages (lazy) ---
const SchoolHome = lazy(() => import("@/sites/school/pages/Home"));
const SchoolAbout = lazy(() => import("@/sites/school/pages/About"));
const SchoolAcademics = lazy(() => import("@/sites/school/pages/Academics"));
const SchoolAdmissions = lazy(() => import("@/sites/school/pages/Admissions"));
const SchoolFacultyStaff = lazy(() => import("@/sites/school/pages/FacultyStaff"));
const SchoolStudentLife = lazy(() => import("@/sites/school/pages/StudentLife"));
const SchoolFacilities = lazy(() => import("@/sites/school/pages/Facilities"));
const SchoolNotices = lazy(() => import("@/sites/school/pages/Notices"));
const SchoolEvents = lazy(() => import("@/sites/school/pages/Events"));
const SchoolGallery = lazy(() => import("@/sites/school/pages/GalleryPage"));
const SchoolParentCorner = lazy(() => import("@/sites/school/pages/ParentCorner"));
const SchoolLibraryPublic = lazy(() => import("@/sites/school/pages/LibraryPublic"));
const SchoolResults = lazy(() => import("@/sites/school/pages/Results"));
const SchoolDownloads = lazy(() => import("@/sites/school/pages/DownloadsPage"));
const SchoolContact = lazy(() => import("@/sites/school/pages/Contact"));
const SchoolPolicyPage = lazy(() => import("@/sites/school/pages/PolicyPage"));
const SchoolMandatoryDisclosure = lazy(() => import("@/sites/school/pages/MandatoryDisclosure"));
const SchoolAdministration = lazy(() => import("@/sites/school/pages/Administration"));
const SchoolRti = lazy(() => import("@/sites/school/pages/Rti"));
const SchoolGrievance = lazy(() => import("@/sites/school/pages/Grievance"));
const SchoolAlumni = lazy(() => import("@/sites/school/pages/Alumni"));

// --- College pages (lazy) ---
const CollegeHome = lazy(() => import("@/sites/college/pages/Home"));
const CollegeAbout = lazy(() => import("@/sites/college/pages/About"));
const CollegeDepartments = lazy(() => import("@/sites/college/pages/Departments"));
const CollegeDepartmentDetail = lazy(() => import("@/sites/college/pages/DepartmentDetail"));
const CollegeProgrammes = lazy(() => import("@/sites/college/pages/Programmes"));
const CollegeProgrammeDetail = lazy(() => import("@/sites/college/pages/ProgrammeDetail"));
const CollegeAdmissions = lazy(() => import("@/sites/college/pages/Admissions"));
const CollegeFacultyStaff = lazy(() => import("@/sites/college/pages/FacultyStaff"));
const CollegeIQAC = lazy(() => import("@/sites/college/pages/IQAC"));
const CollegeResearch = lazy(() => import("@/sites/college/pages/Research"));
const CollegePlacements = lazy(() => import("@/sites/college/pages/Placements"));
const CollegeExamCell = lazy(() => import("@/sites/college/pages/ExaminationCell"));
const CollegeScholarships = lazy(() => import("@/sites/college/pages/Scholarships"));
const CollegeStudentCorner = lazy(() => import("@/sites/college/pages/StudentCorner"));
const CollegeLibraryPublic = lazy(() => import("@/sites/college/pages/LibraryPublic"));
const CollegeNewsEvents = lazy(() => import("@/sites/college/pages/NewsEvents"));
const CollegeNotices = lazy(() => import("@/sites/college/pages/Notices"));
const CollegeGallery = lazy(() => import("@/sites/college/pages/GalleryPage"));
const CollegeDisclosure = lazy(() => import("@/sites/college/pages/Disclosure"));
const CollegeContact = lazy(() => import("@/sites/college/pages/Contact"));
const CollegePolicyPage = lazy(() => import("@/sites/college/pages/PolicyPage"));
const CollegeAdministration = lazy(() => import("@/sites/college/pages/Administration"));
const CollegeGrievance = lazy(() => import("@/sites/college/pages/Grievance"));
const CollegeTenders = lazy(() => import("@/sites/college/pages/Tenders"));
const CollegeRecruitment = lazy(() => import("@/sites/college/pages/Recruitment"));
const CollegeAlumni = lazy(() => import("@/sites/college/pages/Alumni"));
const CollegeVirtualTour = lazy(() => import("@/sites/college/pages/VirtualTour"));

// --- Admin (CMS) pages (lazy) ---
const AdminDashboard = lazy(() => import("@/sites/admin/Dashboard"));
const CmsPagesList = lazy(() => import("@/sites/admin/cms/PagesList"));
const CmsPageBuilder = lazy(() => import("@/sites/admin/cms/PageBuilder"));
const CmsMenuBuilder = lazy(() => import("@/sites/admin/cms/MenuBuilder"));
const CmsThemeDesigner = lazy(() => import("@/sites/admin/cms/ThemeDesigner"));
const CmsNoticesAdmin = lazy(() => import("@/sites/admin/cms/NoticesAdmin"));
const CmsMediaLibrary = lazy(() => import("@/sites/admin/cms/MediaLibrary"));

// --- Admin ERP pages (lazy) ---
const AdmissionsList = lazy(() => import("@/sites/admin/admissions/ApplicationsList"));
const AdmissionDetail = lazy(() => import("@/sites/admin/admissions/ApplicationDetail"));
const StudentsList = lazy(() => import("@/sites/admin/students/StudentsList"));
const StudentProfile = lazy(() => import("@/sites/admin/students/StudentProfile"));
const GuardiansList = lazy(() => import("@/sites/admin/students/GuardiansList"));
const MarkAttendance = lazy(() => import("@/sites/admin/attendance/MarkAttendance"));
const AttendanceReports = lazy(() => import("@/sites/admin/attendance/AttendanceReports"));
const ExaminationsList = lazy(() => import("@/sites/admin/examinations/ExaminationsList"));
const ExaminationDetail = lazy(() => import("@/sites/admin/examinations/ExaminationDetail"));
const InvoicesList = lazy(() => import("@/sites/admin/finance/InvoicesList"));
const FeeStructures = lazy(() => import("@/sites/admin/finance/FeeStructures"));
const StaffList = lazy(() => import("@/sites/admin/staff/StaffList"));
const StaffDetail = lazy(() => import("@/sites/admin/staff/StaffDetail"));
const AdminTimetable = lazy(() => import("@/sites/admin/academics/Timetable"));
const AdminReports = lazy(() => import("@/sites/admin/reports/Reports"));
const UsersRoles = lazy(() => import("@/sites/admin/settings/UsersRoles"));
const InstitutionSettings = lazy(() => import("@/sites/admin/settings/InstitutionSettings"));
const AdminActivityLog = lazy(() => import("@/sites/admin/settings/ActivityLog"));
const AdminLeaveRequests = lazy(() => import("@/sites/admin/students/LeaveRequests"));
const AdminCertificateRequests = lazy(() => import("@/sites/admin/students/CertificateRequests"));
const SetupWizard = lazy(() => import("@/sites/admin/platform/SetupWizard"));

// --- NAAC & IQAC pages (lazy) ---
const NaacDashboard = lazy(() => import("@/sites/admin/naac/NaacDashboard"));
const NaacAccreditation = lazy(() => import("@/sites/admin/naac/AccreditationPage"));
const NaacCriteriaHub = lazy(() => import("@/sites/admin/naac/CriteriaHub"));
const NaacIqac = lazy(() => import("@/sites/admin/naac/IqacPage"));
const NaacAqar = lazy(() => import("@/sites/admin/naac/AqarPage"));
const NaacSsr = lazy(() => import("@/sites/admin/naac/SsrPage"));
const NaacEvidence = lazy(() => import("@/sites/admin/naac/EvidenceRepositoryPage"));
const NaacFeedback = lazy(() => import("@/sites/admin/naac/FeedbackPage"));
const NaacBestPractices = lazy(() => import("@/sites/admin/naac/BestPracticesPage"));
const NaacTasks = lazy(() => import("@/sites/admin/naac/TasksPage"));
const NaacApprovals = lazy(() => import("@/sites/admin/naac/ApprovalsPage"));
const NaacReports = lazy(() => import("@/sites/admin/naac/ReportsPage"));
const NaacAudit = lazy(() => import("@/sites/admin/naac/AuditTrailPage"));
const NaacPermissions = lazy(() => import("@/sites/admin/naac/NaacPermissionMatrixConsole"));

// --- Unified (Both-mode) public landing (lazy) ---
const UnifiedLanding = lazy(() => import("@/sites/unified/UnifiedLanding"));

// --- Teacher/Faculty portal pages (lazy) ---
const TeacherDashboard = lazy(() => import("@/sites/portal/teacher/Dashboard"));
const TeacherMyClasses = lazy(() => import("@/sites/portal/teacher/MyClasses"));
const TeacherMyTimetable = lazy(() => import("@/sites/portal/teacher/MyTimetable"));
const TeacherMarkAttendance = lazy(() => import("@/sites/portal/teacher/MarkAttendance"));
const TeacherExaminations = lazy(() => import("@/sites/portal/teacher/Examinations"));
const TeacherExaminationDetail = lazy(() => import("@/sites/portal/teacher/ExaminationDetail"));
const TeacherLeaveRequests = lazy(() => import("@/sites/portal/teacher/LeaveRequests"));

// --- Parent/Guardian portal pages (lazy) ---
const ParentDashboard = lazy(() => import("@/sites/portal/parent/Dashboard"));

// --- Notification preferences (any authenticated role, lazy) ---
const NotificationPreferences = lazy(() => import("@/sites/portal/notifications/Preferences"));

// --- Student portal pages (lazy) ---
const StudentDashboard = lazy(() => import("@/sites/portal/student/Dashboard"));
const StudentMyCourses = lazy(() => import("@/sites/portal/student/MyCourses"));
const StudentLibraryCatalogue = lazy(() => import("@/sites/portal/student/LibraryCatalogue"));
const StudentBookDetail = lazy(() => import("@/sites/portal/student/BookDetail"));
const StudentMyBookings = lazy(() => import("@/sites/portal/student/MyBookings"));
const StudentMyLoans = lazy(() => import("@/sites/portal/student/MyLoans"));
const StudentMyFines = lazy(() => import("@/sites/portal/student/MyFines"));

// --- Examination Cell portal pages (lazy) ---
const ExamCellDashboard = lazy(() => import("@/sites/portal/examcell/Dashboard"));
const ExamCellExaminations = lazy(() => import("@/sites/portal/examcell/Examinations"));
const ExamCellExaminationDetail = lazy(() => import("@/sites/portal/examcell/ExaminationDetail"));
const ExamCellRevaluation = lazy(() => import("@/sites/portal/examcell/Revaluation"));
const HallTicket = lazy(() => import("@/sites/portal/examcell/HallTicket"));

// --- HOD / Department Coordinator portal pages (lazy) ---
const HodDashboard = lazy(() => import("@/sites/portal/hod/Dashboard"));

// --- Librarian portal pages (lazy) ---
const LibrarianDashboard = lazy(() => import("@/sites/portal/librarian/Dashboard"));
const LibrarianVerifyBooking = lazy(() => import("@/sites/portal/librarian/VerifyBooking"));
const LibrarianCatalogue = lazy(() => import("@/sites/portal/librarian/Catalogue"));
const LibrarianCirculation = lazy(() => import("@/sites/portal/librarian/Circulation"));
const LibrarianReservations = lazy(() => import("@/sites/portal/librarian/Reservations"));
const LibrarianFines = lazy(() => import("@/sites/portal/librarian/Fines"));
const LibrarianMembers = lazy(() => import("@/sites/portal/librarian/Members"));
const LibrarianReports = lazy(() => import("@/sites/portal/librarian/Reports"));
const LibrarianAuditLog = lazy(() => import("@/sites/portal/librarian/AuditLog"));

export const router = createBrowserRouter([
  { path: "/", element: <InstitutionRootRedirect /> },
  {
    path: "/school",
    element: (
      <InstitutionRouteGuard type="school">
        <PublicLayout />
      </InstitutionRouteGuard>
    ),
    children: [
      { index: true, element: <SchoolHome /> },
      { path: "about", element: <SchoolAbout /> },
      { path: "academics", element: <SchoolAcademics /> },
      { path: "admissions", element: <SchoolAdmissions /> },
      { path: "faculty-staff", element: <SchoolFacultyStaff /> },
      { path: "student-life", element: <SchoolStudentLife /> },
      { path: "facilities", element: <SchoolFacilities /> },
      { path: "notices", element: <SchoolNotices /> },
      { path: "events", element: <SchoolEvents /> },
      { path: "gallery", element: <SchoolGallery /> },
      { path: "parent-corner", element: <SchoolParentCorner /> },
      { path: "library", element: <SchoolLibraryPublic /> },
      { path: "results", element: <SchoolResults /> },
      { path: "downloads", element: <SchoolDownloads /> },
      { path: "contact", element: <SchoolContact /> },
      { path: "policies/:slug", element: <SchoolPolicyPage /> },
      { path: "mandatory-disclosure", element: <SchoolMandatoryDisclosure /> },
      { path: "administration", element: <SchoolAdministration /> },
      { path: "rti", element: <SchoolRti /> },
      { path: "grievance", element: <SchoolGrievance /> },
      { path: "alumni", element: <SchoolAlumni /> },
    ],
  },
  {
    path: "/college",
    element: (
      <InstitutionRouteGuard type="college">
        <PublicLayout />
      </InstitutionRouteGuard>
    ),
    children: [
      { index: true, element: <CollegeHome /> },
      { path: "about", element: <CollegeAbout /> },
      { path: "departments", element: <CollegeDepartments /> },
      { path: "departments/:slug", element: <CollegeDepartmentDetail /> },
      { path: "programmes", element: <CollegeProgrammes /> },
      { path: "programmes/:slug", element: <CollegeProgrammeDetail /> },
      { path: "admissions", element: <CollegeAdmissions /> },
      { path: "faculty-staff", element: <CollegeFacultyStaff /> },
      { path: "iqac", element: <CollegeIQAC /> },
      { path: "research", element: <CollegeResearch /> },
      { path: "placements", element: <CollegePlacements /> },
      { path: "examination-cell", element: <CollegeExamCell /> },
      { path: "scholarships", element: <CollegeScholarships /> },
      { path: "student-corner", element: <CollegeStudentCorner /> },
      { path: "library", element: <CollegeLibraryPublic /> },
      { path: "news-events", element: <CollegeNewsEvents /> },
      { path: "notices", element: <CollegeNotices /> },
      { path: "gallery", element: <CollegeGallery /> },
      { path: "disclosure", element: <CollegeDisclosure /> },
      { path: "contact", element: <CollegeContact /> },
      { path: "policies/:slug", element: <CollegePolicyPage /> },
      { path: "administration", element: <CollegeAdministration /> },
      { path: "grievance", element: <CollegeGrievance /> },
      { path: "tenders", element: <CollegeTenders /> },
      { path: "recruitment", element: <CollegeRecruitment /> },
      { path: "alumni", element: <CollegeAlumni /> },
      { path: "virtual-tour", element: <CollegeVirtualTour /> },
    ],
  },
  { path: "/unified", element: <UnifiedLanding /> },
  { path: "/unified/:id", element: <UnifiedLanding /> },
  {
    path: "/hall-ticket/:examId/:studentId",
    element: (
      <RequireAuth fallback={<AdminLoginRedirect />}>
        <HallTicket />
      </RequireAuth>
    ),
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [{ path: "login", element: <LoginPage /> }],
  },
  {
    path: "/admin",
    element: (
      <RequireRole
        roles={["platform_admin", "institution_admin", "principal", "admission_officer", "accountant", "iqac_coordinator", "hod", "faculty"]}
        fallback={<AdminLoginRedirect />}
      >
        <AdminLayout />
      </RequireRole>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "cms/pages", element: <CmsPagesList /> },
      { path: "cms/pages/:id", element: <CmsPageBuilder /> },
      { path: "cms/menus", element: <CmsMenuBuilder /> },
      { path: "cms/theme", element: <CmsThemeDesigner /> },
      { path: "cms/notices", element: <CmsNoticesAdmin /> },
      { path: "cms/media", element: <CmsMediaLibrary /> },
      { path: "admissions", element: <AdmissionsList /> },
      { path: "admissions/:id", element: <AdmissionDetail /> },
      { path: "students", element: <StudentsList /> },
      { path: "students/guardians", element: <GuardiansList /> },
      { path: "students/:id", element: <StudentProfile /> },
      { path: "attendance/mark", element: <MarkAttendance /> },
      { path: "attendance/reports", element: <AttendanceReports /> },
      { path: "examinations", element: <ExaminationsList /> },
      { path: "examinations/:id", element: <ExaminationDetail /> },
      { path: "finance/invoices", element: <InvoicesList /> },
      { path: "finance/structures", element: <FeeStructures /> },
      { path: "staff", element: <StaffList /> },
      { path: "staff/:id", element: <StaffDetail /> },
      { path: "academics/timetable", element: <AdminTimetable /> },
      { path: "reports", element: <AdminReports /> },
      { path: "settings/users", element: <UsersRoles /> },
      { path: "settings/institution", element: <InstitutionSettings /> },
      { path: "settings/activity-log", element: <AdminActivityLog /> },
      { path: "students/leave-requests", element: <AdminLeaveRequests /> },
      { path: "students/certificates", element: <AdminCertificateRequests /> },
      { path: "naac", element: <NaacDashboard /> },
      { path: "naac/accreditation", element: <NaacAccreditation /> },
      { path: "naac/criteria", element: <NaacCriteriaHub /> },
      { path: "naac/iqac", element: <NaacIqac /> },
      { path: "naac/aqar", element: <NaacAqar /> },
      { path: "naac/ssr", element: <NaacSsr /> },
      { path: "naac/evidence", element: <NaacEvidence /> },
      { path: "naac/feedback", element: <NaacFeedback /> },
      { path: "naac/best-practices", element: <NaacBestPractices /> },
      { path: "naac/tasks", element: <NaacTasks /> },
      { path: "naac/approvals", element: <NaacApprovals /> },
      { path: "naac/reports", element: <NaacReports /> },
      { path: "naac/audit", element: <NaacAudit /> },
      { path: "naac/permissions", element: <NaacPermissions /> },
      {
        path: "platform/setup-wizard",
        element: (
          <RequireRole roles={["platform_admin"]} fallback={<Navigate to="/admin" replace />}>
            <SetupWizard />
          </RequireRole>
        ),
      },
    ],
  },
  {
    path: "/portal",
    element: (
      <RequireAuth fallback={<AdminLoginRedirect />}>
        <PortalLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <PortalIndexRedirect /> },
      { path: "student", element: <StudentDashboard /> },
      { path: "student/courses", element: <StudentMyCourses /> },
      { path: "student/library", element: <StudentLibraryCatalogue /> },
      { path: "student/library/book/:id", element: <StudentBookDetail /> },
      { path: "student/library/bookings", element: <StudentMyBookings /> },
      { path: "student/library/loans", element: <StudentMyLoans /> },
      { path: "student/library/fines", element: <StudentMyFines /> },
      { path: "librarian", element: <LibrarianDashboard /> },
      { path: "librarian/verify", element: <LibrarianVerifyBooking /> },
      { path: "librarian/catalogue", element: <LibrarianCatalogue /> },
      { path: "librarian/circulation", element: <LibrarianCirculation /> },
      { path: "librarian/reservations", element: <LibrarianReservations /> },
      { path: "librarian/fines", element: <LibrarianFines /> },
      { path: "librarian/members", element: <LibrarianMembers /> },
      { path: "librarian/reports", element: <LibrarianReports /> },
      { path: "librarian/audit", element: <LibrarianAuditLog /> },
      { path: "teacher", element: <TeacherDashboard /> },
      { path: "teacher/classes", element: <TeacherMyClasses /> },
      { path: "teacher/timetable", element: <TeacherMyTimetable /> },
      { path: "teacher/attendance", element: <TeacherMarkAttendance /> },
      { path: "teacher/examinations", element: <TeacherExaminations /> },
      { path: "teacher/examinations/:id", element: <TeacherExaminationDetail /> },
      { path: "teacher/leave-requests", element: <TeacherLeaveRequests /> },
      { path: "parent", element: <ParentDashboard /> },
      { path: "notifications", element: <NotificationPreferences /> },
      { path: "examcell", element: <ExamCellDashboard /> },
      { path: "examcell/examinations", element: <ExamCellExaminations /> },
      { path: "examcell/examinations/:id", element: <ExamCellExaminationDetail /> },
      { path: "examcell/revaluation", element: <ExamCellRevaluation /> },
      { path: "hod", element: <HodDashboard /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);

function AdminLoginRedirect() {
  return <Navigate to="/auth/login" replace />;
}
