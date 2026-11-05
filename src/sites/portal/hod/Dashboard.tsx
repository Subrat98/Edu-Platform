import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Building2, GraduationCap, Megaphone, Users } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AvatarInitials } from "@/components/common/AvatarInitials";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useAuthStore } from "@/features/auth/authStore";
import { staffService } from "@/features/staff/staffService";
import { studentService } from "@/features/students/studentService";
import { departments } from "@/mocks/data/departments";
import { programmes } from "@/mocks/data/programmes";

export default function HodDashboard() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const staffId = currentUser?.staffId;

  const { data: staffMember, isLoading: loadingStaff } = useQuery({
    queryKey: ["hodStaffMember", staffId ?? ""],
    queryFn: () => staffService.get(staffId!),
    enabled: !!staffId,
  });

  const departmentId = staffMember?.departmentId;
  const department = departments.find((d) => d.id === departmentId);
  const deptProgrammes = departmentId ? programmes.filter((p) => p.departmentId === departmentId) : [];

  const { data: students } = useQuery({
    queryKey: ["studentsForDepartment", departmentId ?? ""],
    queryFn: () => studentService.list("college"),
    enabled: !!departmentId,
  });

  const { data: faculty, isLoading: loadingFaculty } = useQuery({
    queryKey: ["hodFacultyWorkload", departmentId ?? ""],
    queryFn: async () => {
      const staff = await staffService.listByDepartment(departmentId!);
      return Promise.all(
        staff.map(async (s) => {
          const assignments = await staffService.getAssignments(s.id);
          return { ...s, weeklyPeriods: assignments.reduce((sum, a) => sum + a.periodCount, 0) };
        }),
      );
    },
    enabled: !!departmentId,
  });

  if (!staffId) return <EmptyState title="No staff record linked" />;
  if (loadingStaff) return <PageLoadingSkeleton />;
  if (!department) return <EmptyState title="Department not found" description="This persona isn't linked to a department." />;

  const activeStudentCount = (students ?? []).filter((s) => s.status === "Active" && deptProgrammes.some((p) => p.id === s.classOrProgrammeId)).length;

  return (
    <div>
      <AdminPageHeader title={`${department.name} Department`} description={`Department dashboard for ${currentUser?.name}`} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Programmes" value={deptProgrammes.length} icon={GraduationCap} />
        <StatCard label="Active Students" value={activeStudentCount} icon={Users} />
        <StatCard label="Faculty" value={department.facultyCount} icon={Building2} />
        <StatCard label="Labs" value={department.labCount} icon={Building2} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Programmes</CardTitle>
          </CardHeader>
          <CardContent>
            {deptProgrammes.length === 0 ? (
              <EmptyState title="No programmes configured" />
            ) : (
              <ul className="divide-border divide-y">
                {deptProgrammes.map((p) => {
                  const count = (students ?? []).filter((s) => s.status === "Active" && s.classOrProgrammeId === p.id).length;
                  return (
                    <li key={p.id} className="flex items-center justify-between py-2 text-sm">
                      <span>{p.name}</span>
                      <span className="text-muted-foreground">{count} students</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Megaphone className="size-4" /> Quick links
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Link to={`/college/departments/${department.slug}`} className="text-accent text-sm hover:underline">
              View public department page →
            </Link>
            <Link to="/college/notices" className="text-accent text-sm hover:underline">
              College notices →
            </Link>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Faculty workload</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingFaculty ? (
              <PageLoadingSkeleton />
            ) : !faculty || faculty.length === 0 ? (
              <EmptyState title="No faculty on record" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Faculty</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead className="text-right">Periods / week</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faculty.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AvatarInitials name={f.name} size="sm" />
                          {f.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{f.designation}</TableCell>
                      <TableCell className="text-right">{f.weeklyPeriods}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
