import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, XCircle, FileCheck, FileX, UserPlus, Phone, Mail } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useAuthStore } from "@/features/auth/authStore";
import { admissionService } from "@/features/admissions/admissionService";
import { queryKeys } from "@/lib/queryKeys";
import type { ApplicationStatus } from "@/types";

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.currentUser);
  const queryClient = useQueryClient();
  const [decisionDialog, setDecisionDialog] = useState<{ status: ApplicationStatus; needsNote: boolean } | null>(null);
  const [note, setNote] = useState("");

  const { data: app, isLoading } = useQuery({ queryKey: queryKeys.admission(id ?? ""), queryFn: () => admissionService.get(id!), enabled: !!id });

  const statusMutation = useMutation({
    mutationFn: ({ status, note: n }: { status: ApplicationStatus; note?: string }) => admissionService.setStatus(id!, status, currentUser?.name ?? "Admin", n),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admission(id ?? "") });
      queryClient.invalidateQueries({ queryKey: ["admissions"] });
      toast.success("Application updated");
      setDecisionDialog(null);
      setNote("");
    },
  });

  const convertMutation = useMutation({
    mutationFn: () => admissionService.convertToStudent(id!, currentUser?.name ?? "Admin"),
    onSuccess: (res) => {
      if (res.ok) {
        toast.success("Student record created", { description: `Admission No. ${res.student.admissionNo}` });
        queryClient.invalidateQueries({ queryKey: queryKeys.admission(id ?? "") });
        navigate(`/admin/students/${res.student.id}`);
      } else {
        toast.error("Couldn't convert", { description: res.error });
      }
    },
  });

  if (isLoading) return <PageLoadingSkeleton />;
  if (!app) return <EmptyState title="Application not found" />;

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 gap-1.5">
        <Link to="/admin/admissions">
          <ArrowLeft className="size-4" /> Back to applications
        </Link>
      </Button>

      <AdminPageHeader
        title={app.applicantName}
        description={`${app.applicationNo} · Applying for ${app.appliedFor}`}
        actions={
          <>
            {app.status === "Submitted" && (
              <Button variant="outline" onClick={() => statusMutation.mutate({ status: "Under Review" })}>
                Mark Under Review
              </Button>
            )}
            {(app.status === "Under Review" || app.status === "Submitted") && (
              <>
                <Button variant="outline" className="text-destructive gap-1.5" onClick={() => setDecisionDialog({ status: "Rejected", needsNote: true })}>
                  <XCircle className="size-4" /> Reject
                </Button>
                <Button variant="outline" className="gap-1.5" onClick={() => setDecisionDialog({ status: "Waitlisted", needsNote: true })}>
                  Waitlist
                </Button>
                <Button className="gap-1.5" onClick={() => statusMutation.mutate({ status: "Accepted" })}>
                  <CheckCircle2 className="size-4" /> Accept
                </Button>
              </>
            )}
            {app.status === "Accepted" && !app.convertedStudentId && (
              <Button className="gap-1.5" onClick={() => convertMutation.mutate()} disabled={convertMutation.isPending}>
                <UserPlus className="size-4" /> {convertMutation.isPending ? "Creating…" : "Convert to Student"}
              </Button>
            )}
            {app.convertedStudentId && (
              <Button asChild variant="outline" className="gap-1.5">
                <Link to={`/admin/students/${app.convertedStudentId}`}>
                  <UserPlus className="size-4" /> View Student Record
                </Link>
              </Button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Applicant details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant="outline">{app.status}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Guardian</span>
              <span>{app.guardianName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <Phone className="size-3.5" /> Phone
              </span>
              <span>{app.phone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <Mail className="size-3.5" /> Email
              </span>
              <span>{app.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Previous institution</span>
              <span className="text-right">{app.previousSchoolOrCollege}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Submitted</span>
              <span>{app.submittedDate}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-border divide-y">
              {app.documents.map((d) => (
                <li key={d.name} className="flex items-center justify-between py-2 text-sm">
                  <span className="flex items-center gap-2">
                    {d.uploaded ? <FileCheck className="text-success size-4" /> : <FileX className="text-destructive size-4" />}
                    {d.name}
                  </span>
                  <Badge variant="outline" className={d.uploaded ? "border-success/30 text-success" : "border-destructive/30 text-destructive"}>
                    {d.uploaded ? "Uploaded" : "Missing"}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Decision timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {app.reviews.length === 0 ? (
              <p className="text-muted-foreground text-sm">No reviews yet — this application is awaiting first review.</p>
            ) : (
              <ol className="space-y-3">
                {app.reviews.map((r) => (
                  <li key={r.id} className="border-border border-l-2 pl-3 text-sm">
                    <p>
                      <span className="font-medium">{r.actor}</span>
                      <span className="text-muted-foreground"> changed status from </span>
                      <Badge variant="outline" className="mx-1">
                        {r.fromStatus}
                      </Badge>
                      <span className="text-muted-foreground">to</span>
                      <Badge variant="outline" className="mx-1">
                        {r.toStatus}
                      </Badge>
                    </p>
                    {r.note ? <p className="text-muted-foreground mt-1 text-xs">{r.note}</p> : null}
                    <p className="text-muted-foreground mt-0.5 text-[11px]">{r.timestamp.replace("T", " ")}</p>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!decisionDialog} onOpenChange={(open) => !open && setDecisionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{decisionDialog?.status} this application?</DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label>Reason</Label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a reason for the record…" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDecisionDialog(null)}>
              Cancel
            </Button>
            <Button
              variant={decisionDialog?.status === "Rejected" ? "destructive" : "default"}
              onClick={() => decisionDialog && statusMutation.mutate({ status: decisionDialog.status, note })}
            >
              Confirm {decisionDialog?.status}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
