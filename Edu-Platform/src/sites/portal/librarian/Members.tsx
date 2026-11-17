import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AvatarInitials } from "@/components/common/AvatarInitials";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { libraryService } from "@/features/library/libraryService";
import { queryKeys } from "@/lib/queryKeys";
import type { MembershipStatus } from "@/types";

const STATUS_TONE: Record<MembershipStatus, string> = {
  Active: "border-success/30 bg-success/10 text-success",
  Lapsed: "bg-muted text-muted-foreground",
  Suspended: "border-destructive/30 bg-destructive/10 text-destructive",
  Closed: "bg-muted text-muted-foreground",
};

export default function Members() {
  const { institutionId } = useInstitutionData();
  const [search, setSearch] = useState("");
  const { data: members, isLoading } = useQuery({ queryKey: queryKeys.libraryMembers(institutionId), queryFn: () => libraryService.listMembers(institutionId) });

  const filtered = useMemo(
    () => (members ?? []).filter((m) => m.memberName.toLowerCase().includes(search.toLowerCase()) || m.membershipNo.toLowerCase().includes(search.toLowerCase())),
    [members, search],
  );

  if (isLoading) return <PageLoadingSkeleton />;

  return (
    <div>
      <AdminPageHeader title="Library Members" description="Students and faculty registered with the library." />
      <div className="relative mb-4 max-w-xs">
        <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
        <Input placeholder="Search members…" className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      {filtered.length === 0 ? (
        <EmptyState title="No members found" />
      ) : (
        <div className="border-border rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Membership No.</TableHead>
                <TableHead>Limits</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="flex items-center gap-2 font-medium">
                    <AvatarInitials name={m.memberName} size="sm" />
                    {m.memberName}
                  </TableCell>
                  <TableCell className="text-muted-foreground capitalize">{m.memberType}</TableCell>
                  <TableCell className="font-mono text-xs">{m.membershipNo}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {m.maxLoans} loans · {m.loanPeriodDays} days
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={STATUS_TONE[m.status]}>
                      {m.status}
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
