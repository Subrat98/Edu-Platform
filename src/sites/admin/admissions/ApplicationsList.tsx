import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { ClipboardList, Clock, CheckCircle2, XCircle, ListOrdered } from "lucide-react";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { admissionService } from "@/features/admissions/admissionService";
import { queryKeys } from "@/lib/queryKeys";
import type { ApplicationStatus } from "@/types";

const STATUS_TONE: Record<ApplicationStatus, string> = {
  Draft: "bg-muted text-muted-foreground",
  Submitted: "border-info/30 bg-info/10 text-info",
  "Under Review": "border-warning/30 bg-warning/10 text-warning",
  "Action Required": "border-destructive/30 bg-destructive/10 text-destructive",
  Accepted: "border-success/30 bg-success/10 text-success",
  Rejected: "bg-muted text-muted-foreground",
  Waitlisted: "border-accent/30 bg-accent/10 text-accent",
  Withdrawn: "bg-muted text-muted-foreground",
};

export default function ApplicationsList() {
  const { institutionId } = useInstitutionData();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ApplicationStatus | "All">("All");

  const { data: applications, isLoading } = useQuery({ queryKey: queryKeys.admissions(institutionId), queryFn: () => admissionService.list(institutionId) });
  const { data: stats } = useQuery({ queryKey: queryKeys.admissionStats(institutionId), queryFn: () => admissionService.getDashboardStats(institutionId) });

  const filtered = useMemo(() => {
    let list = applications ?? [];
    if (status !== "All") list = list.filter((a) => a.status === status);
    if (search) list = list.filter((a) => a.applicantName.toLowerCase().includes(search.toLowerCase()) || a.applicationNo.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [applications, status, search]);

  if (isLoading) return <PageLoadingSkeleton />;

  return (
    <div>
      <AdminPageHeader title="Admission Applications" description="Review, decide and convert applications into student records." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Total" value={stats?.total ?? "—"} icon={ClipboardList} />
        <StatCard label="Under Review" value={stats?.underReview ?? "—"} icon={Clock} tone="warning" />
        <StatCard label="Action Required" value={stats?.actionRequired ?? "—"} icon={XCircle} tone="error" />
        <StatCard label="Accepted" value={stats?.accepted ?? "—"} icon={CheckCircle2} tone="success" />
        <StatCard label="Waitlisted" value={stats?.waitlisted ?? "—"} icon={ListOrdered} />
      </div>

      <div className="my-4 flex flex-wrap gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input placeholder="Search by name or application no…" className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as ApplicationStatus | "All")}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All statuses</SelectItem>
            {(["Submitted", "Under Review", "Action Required", "Accepted", "Rejected", "Waitlisted"] as ApplicationStatus[]).map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No applications found" />
      ) : (
        <div className="border-border rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application No.</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Applied For</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => (
                <TableRow key={a.id} className="hover:bg-muted/50">
                  <TableCell>
                    <Link to={`/admin/admissions/${a.id}`} className="text-accent font-mono text-xs hover:underline">
                      {a.applicationNo}
                    </Link>
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link to={`/admin/admissions/${a.id}`}>{a.applicantName}</Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{a.appliedFor}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{a.submittedDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={STATUS_TONE[a.status]}>
                      {a.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
