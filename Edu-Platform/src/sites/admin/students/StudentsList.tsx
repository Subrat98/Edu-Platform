import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AvatarInitials } from "@/components/common/AvatarInitials";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { GraduationCap, UserCheck, UserX, Award } from "lucide-react";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { studentService } from "@/features/students/studentService";
import { queryKeys } from "@/lib/queryKeys";
import type { StudentStatus } from "@/types";

const STATUS_TONE: Record<StudentStatus, string> = {
  Active: "border-success/30 bg-success/10 text-success",
  Transferred: "bg-muted text-muted-foreground",
  Withdrawn: "bg-muted text-muted-foreground",
  Graduated: "border-info/30 bg-info/10 text-info",
};

export default function StudentsList() {
  const { institutionId } = useInstitutionData();
  const [search, setSearch] = useState("");

  const { data: students, isLoading } = useQuery({ queryKey: queryKeys.students(institutionId), queryFn: () => studentService.list(institutionId) });
  const { data: stats } = useQuery({ queryKey: queryKeys.studentStats(institutionId), queryFn: () => studentService.getDashboardStats(institutionId) });

  const filtered = useMemo(() => {
    const list = students ?? [];
    if (!search) return list;
    return list.filter(
      (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.admissionNo.toLowerCase().includes(search.toLowerCase()) || s.classOrProgrammeName.toLowerCase().includes(search.toLowerCase()),
    );
  }, [students, search]);

  if (isLoading) return <PageLoadingSkeleton />;

  return (
    <div>
      <AdminPageHeader title="Student Directory" description="All enrolled students for this institution." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Students" value={stats?.total ?? "—"} icon={GraduationCap} />
        <StatCard label="Active" value={stats?.active ?? "—"} icon={UserCheck} tone="success" />
        <StatCard label="Transferred / Withdrawn" value={stats?.transferred ?? "—"} icon={UserX} />
        <StatCard label="Graduated" value={stats?.graduated ?? "—"} icon={Award} />
      </div>

      <div className="relative my-4 max-w-xs">
        <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
        <Input placeholder="Search by name, admission no, class…" className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No students found" />
      ) : (
        <div className="border-border rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Admission No.</TableHead>
                <TableHead>Class / Programme</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.slice(0, 100).map((s) => (
                <TableRow key={s.id} className="hover:bg-muted/50">
                  <TableCell>
                    <Link to={`/admin/students/${s.id}`} className="flex items-center gap-2 font-medium">
                      <AvatarInitials name={s.name} size="sm" />
                      {s.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">{s.admissionNo}</TableCell>
                  <TableCell className="text-muted-foreground">{s.classOrProgrammeName}</TableCell>
                  <TableCell className="text-muted-foreground">{s.section}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={STATUS_TONE[s.status]}>
                      {s.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length > 100 ? (
            <p className="text-muted-foreground border-border border-t p-3 text-center text-xs">
              Showing first 100 of {filtered.length} results — refine your search to narrow down.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
