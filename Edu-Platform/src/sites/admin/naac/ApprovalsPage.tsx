import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ResponsiveTableContainer } from "@/components/admin/ResponsiveTableContainer";
import { getApprovalsList, processApprovalAction } from "@/features/naac/naacService";
import type { NaacApproval } from "@/types";

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<NaacApproval[]>([]);
  const [, setLoading] = useState(true);

  const [activeAppr, setActiveAppr] = useState<NaacApproval | null>(null);
  const [actionType, setActionType] = useState<"Approve" | "Reject" | "Request Changes">("Approve");
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [comments, setComments] = useState("");

  const loadData = () => {
    setLoading(true);
    getApprovalsList()
      .then((data) => setApprovals(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openActionModal = (appr: NaacApproval, type: "Approve" | "Reject" | "Request Changes") => {
    setActiveAppr(appr);
    setActionType(type);
    setComments(type === "Approve" ? "Approved and verified." : "");
    setActionModalOpen(true);
  };

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAppr) return;
    await processApprovalAction(
      activeAppr.id,
      actionType,
      comments,
      { name: "Dr. Himansu Sekhar Das", role: "Principal" }
    );
    setActionModalOpen(false);
    loadData();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full min-w-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              NAAC Approval Workflows
            </h1>
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
              4-Tier Approval Ladder
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Hierarchical verification: Department Coordinator → HOD → IQAC Coordinator → Principal.
          </p>
        </div>
      </div>

      {/* Mobile Approvals Card List (< md) */}
      <div className="md:hidden space-y-3">
        {approvals.map((appr) => (
          <Card key={appr.id} className="border-border/70 p-3.5 shadow-xs">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h4 className="font-semibold text-xs sm:text-sm text-foreground">{appr.title}</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">{appr.remarks}</p>
              </div>
              <Badge
                className={
                  appr.status === "Approved"
                    ? "bg-emerald-600 text-white shrink-0 text-[10px]"
                    : appr.status === "Pending"
                    ? "bg-blue-600 text-white shrink-0 text-[10px]"
                    : appr.status === "Changes Requested"
                    ? "bg-amber-600 text-white shrink-0 text-[10px]"
                    : "bg-rose-600 text-white shrink-0 text-[10px]"
                }
              >
                {appr.status}
              </Badge>
            </div>

            <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs border-t border-border/50 pt-2">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-medium block">Type & Stage</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Badge variant="outline" className="text-[10px] px-1 py-0">{appr.entityType}</Badge>
                  <span className="text-[11px] font-semibold text-foreground">{appr.currentStage}</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-medium block">Department</span>
                <span className="text-[11px] text-foreground font-medium truncate block">{appr.department}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] text-muted-foreground uppercase font-medium block">Submitted By</span>
                <span className="text-[11px] text-foreground">{appr.submittedBy} · {appr.submittedDate}</span>
              </div>
            </div>

            {appr.status === "Pending" && (
              <div className="mt-3 flex items-center justify-end gap-2 border-t border-border/50 pt-2">
                <Button size="xs" variant="outline" onClick={() => openActionModal(appr, "Approve")}>
                  Approve
                </Button>
                <Button size="xs" variant="ghost" onClick={() => openActionModal(appr, "Request Changes")} className="text-amber-600">
                  Request Changes
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Desktop Approvals Table (md+) */}
      <div className="hidden md:block">
        <ResponsiveTableContainer>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="font-semibold min-w-[220px]">Submission Item</TableHead>
                <TableHead className="font-semibold min-w-[100px]">Type</TableHead>
                <TableHead className="font-semibold min-w-[120px]">Department</TableHead>
                <TableHead className="font-semibold min-w-[140px]">Submitted By</TableHead>
                <TableHead className="font-semibold min-w-[120px]">Current Stage</TableHead>
                <TableHead className="font-semibold min-w-[110px]">Status</TableHead>
                <TableHead className="font-semibold text-right min-w-[140px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvals.map((appr) => (
                <TableRow key={appr.id} className="hover:bg-muted/20">
                  <TableCell className="align-top">
                    <p className="font-bold text-xs sm:text-sm text-foreground">{appr.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{appr.remarks}</p>
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge variant="outline" className="text-xs">
                      {appr.entityType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground align-top">
                    {appr.department}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground align-top">
                    <p className="font-medium text-foreground">{appr.submittedBy}</p>
                    <p className="text-[10px]">{appr.submittedDate}</p>
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge variant="secondary" className="text-xs font-semibold">
                      {appr.currentStage}
                    </Badge>
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge
                      className={
                        appr.status === "Approved"
                          ? "bg-emerald-600 text-white"
                          : appr.status === "Pending"
                          ? "bg-blue-600 text-white"
                          : appr.status === "Changes Requested"
                          ? "bg-amber-600 text-white"
                          : "bg-rose-600 text-white"
                      }
                    >
                      {appr.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right align-top">
                    {appr.status === "Pending" && (
                      <div className="flex items-center justify-end gap-1">
                        <Button size="xs" variant="outline" onClick={() => openActionModal(appr, "Approve")}>
                          Approve
                        </Button>
                        <Button size="xs" variant="ghost" onClick={() => openActionModal(appr, "Request Changes")} className="text-amber-600">
                          Changes
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ResponsiveTableContainer>
      </div>

      <Dialog open={actionModalOpen} onOpenChange={setActionModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {actionType} Submission: {activeAppr?.title}
            </DialogTitle>
            <DialogDescription>
              Stage: {activeAppr?.currentStage}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleProcess} className="space-y-4 pt-2">
            <div>
              <Label htmlFor="apprComments">Official Remarks / Comments</Label>
              <Textarea
                id="apprComments"
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Enter audit remarks or feedback..."
                required
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setActionModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Confirm {actionType}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
