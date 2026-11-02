import { useQuery } from "@tanstack/react-query";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { financeService } from "@/features/finance/financeService";
import { queryKeys } from "@/lib/queryKeys";

export default function FeeStructures() {
  const { institutionId } = useInstitutionData();
  const { data: structures, isLoading } = useQuery({ queryKey: queryKeys.feeStructures(institutionId), queryFn: () => financeService.listFeeStructures(institutionId) });

  if (isLoading) return <PageLoadingSkeleton />;

  return (
    <div>
      <AdminPageHeader title="Fee Structures" description="Fee heads and amounts configured for the current academic year." />
      {!structures || structures.length === 0 ? (
        <EmptyState title="No fee structures configured" />
      ) : (
        <div className="border-border rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class / Programme</TableHead>
                <TableHead>Fee Head</TableHead>
                <TableHead>Academic Year</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {structures.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">{f.className}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{f.feeHeadName}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{f.academicYear}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{f.dueDate}</TableCell>
                  <TableCell className="text-right font-medium">₹{f.amount.toLocaleString("en-IN")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
