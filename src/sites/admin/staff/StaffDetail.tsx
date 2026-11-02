import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Mail, BookOpen } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AvatarInitials } from "@/components/common/AvatarInitials";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { staffService } from "@/features/staff/staffService";
import { queryKeys } from "@/lib/queryKeys";

export default function StaffDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: staff, isLoading } = useQuery({ queryKey: queryKeys.staffMember(id ?? ""), queryFn: () => staffService.get(id!), enabled: !!id });
  const { data: assignments, isLoading: loadingAssignments } = useQuery({
    queryKey: queryKeys.staffAssignments(id ?? ""),
    queryFn: () => staffService.getAssignments(id!),
    enabled: !!id,
  });

  if (isLoading) return <PageLoadingSkeleton />;
  if (!staff) return <EmptyState title="Staff member not found" />;

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 gap-1.5">
        <Link to="/admin/staff">
          <ArrowLeft className="size-4" /> Back to directory
        </Link>
      </Button>

      <AdminPageHeader title={staff.name} description={staff.designation} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Card>
          <CardContent className="flex flex-col items-center gap-3 pt-6 text-center">
            <AvatarInitials name={staff.name} size="2xl" />
            <div>
              <p className="font-heading text-lg font-semibold">{staff.name}</p>
              <p className="text-muted-foreground text-sm">{staff.designation}</p>
              {staff.department ? <Badge variant="outline" className="mt-2">{staff.department}</Badge> : null}
            </div>
            <p className="flex items-center gap-1.5 text-sm">
              <Mail className="text-muted-foreground size-3.5" /> {staff.email}
            </p>
            <p className="text-muted-foreground text-sm">{staff.qualification}</p>
            {staff.publications ? <p className="text-muted-foreground text-xs">{staff.publications} publications</p> : null}
            <p className="text-muted-foreground mt-2 text-sm">{staff.bio}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="size-4" /> Teaching assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingAssignments ? (
              <PageLoadingSkeleton />
            ) : !assignments || assignments.length === 0 ? (
              <EmptyState title="No timetabled classes" description="This staff member has no classes assigned in the timetable." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class / Programme</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Periods / week</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((a) => (
                    <TableRow key={`${a.classOrProgrammeId}::${a.section}::${a.subject}`}>
                      <TableCell className="font-medium">{a.className}</TableCell>
                      <TableCell className="text-muted-foreground">{a.section}</TableCell>
                      <TableCell className="text-muted-foreground">{a.subject}</TableCell>
                      <TableCell className="text-muted-foreground">{a.periodCount}</TableCell>
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
