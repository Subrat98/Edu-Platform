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
import { studentService } from "@/features/students/studentService";
import { queryKeys } from "@/lib/queryKeys";

export default function GuardiansList() {
  const { institutionId } = useInstitutionData();
  const [search, setSearch] = useState("");
  const { data: guardians, isLoading } = useQuery({ queryKey: queryKeys.guardians(institutionId), queryFn: () => studentService.listGuardians(institutionId) });

  const filtered = useMemo(() => (guardians ?? []).filter((g) => g.name.toLowerCase().includes(search.toLowerCase())), [guardians, search]);

  if (isLoading) return <PageLoadingSkeleton />;

  return (
    <div>
      <AdminPageHeader title="Guardians" description="Parents and guardians linked to enrolled students." />
      <div className="relative mb-4 max-w-xs">
        <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
        <Input placeholder="Search guardians…" className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      {filtered.length === 0 ? (
        <EmptyState title="No guardians found" />
      ) : (
        <div className="border-border rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guardian</TableHead>
                <TableHead>Relationship</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Occupation</TableHead>
                <TableHead>Linked Students</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.slice(0, 100).map((g) => (
                <TableRow key={g.id}>
                  <TableCell className="flex items-center gap-2 font-medium">
                    <AvatarInitials name={g.name} size="sm" /> {g.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{g.relationship}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{g.phone}</TableCell>
                  <TableCell className="text-muted-foreground">{g.occupation}</TableCell>
                  <TableCell className="text-muted-foreground">{g.studentIds.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
