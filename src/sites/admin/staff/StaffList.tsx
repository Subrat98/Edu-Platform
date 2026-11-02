import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AvatarInitials } from "@/components/common/AvatarInitials";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { staffService } from "@/features/staff/staffService";
import { queryKeys } from "@/lib/queryKeys";

export default function StaffList() {
  const { institutionId } = useInstitutionData();
  const [search, setSearch] = useState("");

  const { data: staff, isLoading } = useQuery({ queryKey: queryKeys.staffList(institutionId), queryFn: () => staffService.list(institutionId) });

  const filtered = useMemo(() => {
    const list = staff ?? [];
    if (!search) return list;
    const q = search.toLowerCase();
    return list.filter((s) => s.name.toLowerCase().includes(q) || s.designation.toLowerCase().includes(q) || (s.department ?? "").toLowerCase().includes(q));
  }, [staff, search]);

  if (isLoading) return <PageLoadingSkeleton />;

  return (
    <div>
      <AdminPageHeader title="Staff & Faculty Directory" description="All teaching and non-teaching staff for this institution." />

      <div className="relative my-4 max-w-xs">
        <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
        <Input placeholder="Search by name, designation, department…" className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No staff found" />
      ) : (
        <div className="border-border rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Qualification</TableHead>
                <TableHead>Leadership</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id} className="hover:bg-muted/50">
                  <TableCell>
                    <Link to={`/admin/staff/${s.id}`} className="flex items-center gap-2 font-medium">
                      <AvatarInitials name={s.name} size="sm" />
                      {s.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{s.designation}</TableCell>
                  <TableCell className="text-muted-foreground">{s.department ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{s.qualification}</TableCell>
                  <TableCell>{s.isLeadership ? <Badge variant="outline" className="border-accent/30 bg-accent/10 text-accent">Leadership</Badge> : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
