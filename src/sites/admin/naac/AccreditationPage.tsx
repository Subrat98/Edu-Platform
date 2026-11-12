import { useState, useEffect } from "react";
import {
  ShieldCheck,
  History,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveTableContainer } from "@/components/admin/ResponsiveTableContainer";
import {
  getAccreditationCycles,
  addAccreditationCycle,
  updateAccreditationCycle,
} from "@/features/naac/naacService";
import type { AccreditationCycle, AccreditationStatus } from "@/types";

export default function AccreditationPage() {
  const [cycles, setCycles] = useState<AccreditationCycle[]>([]);
  const [, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCycle, setEditingCycle] = useState<AccreditationCycle | null>(null);

  // Form State
  const [formCycleNo, setFormCycleNo] = useState("4");
  const [formInstName, setFormInstName] = useState("Modern Autonomous College");
  const [formBody, setFormBody] = useState("NAAC");
  const [formStatus, setFormStatus] = useState<AccreditationStatus>("In Progress");
  const [formGrade, setFormGrade] = useState("A++");
  const [formCgpa, setFormCgpa] = useState("3.65");
  const [formAccredDate, setFormAccredDate] = useState("");
  const [formValidUntil, setFormValidUntil] = useState("");
  const [formSsrDate, setFormSsrDate] = useState("2026-11-20");
  const [formPeerDate, setFormPeerDate] = useState("2027-01-15");
  const [formRemarks, setFormRemarks] = useState("");

  const loadData = () => {
    setLoading(true);
    getAccreditationCycles()
      .then((data) => setCycles(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingCycle(null);
    setFormCycleNo(String((cycles[0]?.cycleNumber ?? 3) + 1));
    setFormInstName("Modern Autonomous College");
    setFormBody("NAAC");
    setFormStatus("In Progress");
    setFormGrade("A++");
    setFormCgpa("3.65");
    setFormAccredDate("");
    setFormValidUntil("");
    setFormSsrDate("2026-11-20");
    setFormPeerDate("2027-01-15");
    setFormRemarks("Targeting NAAC A++ in upcoming accreditation cycle.");
    setModalOpen(true);
  };

  const openEditModal = (cycle: AccreditationCycle) => {
    setEditingCycle(cycle);
    setFormCycleNo(String(cycle.cycleNumber));
    setFormInstName(cycle.institutionName);
    setFormBody(cycle.accreditationBody);
    setFormStatus(cycle.status);
    setFormGrade(cycle.grade || "");
    setFormCgpa(String(cycle.cgpa || ""));
    setFormAccredDate(cycle.accreditationDate || "");
    setFormValidUntil(cycle.validUntil || "");
    setFormSsrDate(cycle.ssrSubmissionDate || "");
    setFormPeerDate(cycle.peerTeamVisitDate || "");
    setFormRemarks(cycle.remarks || "");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const actor = { name: "Dr. Himansu Sekhar Das", role: "Principal" };

    if (editingCycle) {
      await updateAccreditationCycle(
        editingCycle.id,
        {
          cycleNumber: Number(formCycleNo),
          institutionName: formInstName,
          accreditationBody: formBody as AccreditationCycle["accreditationBody"],
          status: formStatus,
          grade: formGrade,
          cgpa: parseFloat(formCgpa) || 3.0,
          accreditationDate: formAccredDate,
          validUntil: formValidUntil,
          ssrSubmissionDate: formSsrDate,
          peerTeamVisitDate: formPeerDate,
          remarks: formRemarks,
        },
        actor
      );
    } else {
      await addAccreditationCycle(
        {
          cycleNumber: Number(formCycleNo),
          institutionName: formInstName,
          accreditationBody: formBody as AccreditationCycle["accreditationBody"],
          status: formStatus,
          grade: formGrade,
          cgpa: parseFloat(formCgpa) || 3.0,
          accreditationDate: formAccredDate,
          validUntil: formValidUntil,
          ssrSubmissionDate: formSsrDate,
          aqarStatus: "In Progress",
          peerTeamVisitDate: formPeerDate,
          remarks: formRemarks,
          certificateUrl: "/documents/naac/certificate-sample.pdf",
        },
        actor
      );
    }
    setModalOpen(false);
    loadData();
  };

  const activeCycle = cycles.find((c) => c.status === "Accredited") ?? cycles[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full min-w-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Accreditation Management
            </h1>
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
              Institutional Quality
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Track statutory NAAC cycles, Peer Team Visit schedules, validity status, and formal accreditation dossiers.
          </p>
        </div>

        <Button onClick={openAddModal} className="gap-1.5 self-start sm:self-auto shrink-0">
          <Plus className="size-4" />
          <span>Add Accreditation Cycle</span>
        </Button>
      </div>

      {activeCycle && (
        <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5 shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardDescription className="text-xs uppercase tracking-wider font-semibold text-primary">
                  Current Active Accreditation
                </CardDescription>
                <CardTitle className="text-xl font-bold sm:text-2xl text-foreground mt-0.5">
                  NAAC Cycle {activeCycle.cycleNumber} · Grade {activeCycle.grade} (CGPA {activeCycle.cgpa})
                </CardTitle>
              </div>
              <Badge className="bg-emerald-600 text-white font-medium px-3 py-1 self-start sm:self-auto shrink-0">
                <ShieldCheck className="size-3.5 mr-1" />
                Active & Accredited
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-2">
            <div className="rounded-lg border border-border/60 bg-card p-3">
              <span className="text-xs text-muted-foreground">Accreditation Body</span>
              <p className="font-semibold text-sm text-foreground mt-0.5">{activeCycle.accreditationBody} (Autonomous)</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-card p-3">
              <span className="text-xs text-muted-foreground">Validity Period</span>
              <p className="font-semibold text-sm text-foreground mt-0.5">{activeCycle.accreditationDate} to {activeCycle.validUntil}</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-card p-3">
              <span className="text-xs text-muted-foreground">Latest AQAR Status</span>
              <p className="font-semibold text-sm text-foreground mt-0.5">{activeCycle.aqarStatus}</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-card p-3">
              <span className="text-xs text-muted-foreground">SSR Submission</span>
              <p className="font-semibold text-sm text-foreground mt-0.5">{activeCycle.ssrSubmissionDate || "Completed"}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* History Card with Mobile Responsive Card List & Desktop Table */}
      <Card className="border-border/60 shadow-xs">
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="size-5 text-primary" />
            <div>
              <CardTitle className="text-lg font-bold text-foreground">
                Accreditation History & Lifecycle Records
              </CardTitle>
              <CardDescription>
                Chronological audit of institutional cycles, CGPA trajectories, and peer committee findings
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          {/* Mobile Card List for < md */}
          <div className="md:hidden space-y-3">
            {cycles.map((c) => (
              <Card key={c.id} className="border-border/70 p-3.5 shadow-xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-foreground">Cycle {c.cycleNumber}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-semibold text-xs text-foreground">Grade {c.grade}</span>
                      <span className="text-xs text-muted-foreground">({c.cgpa} CGPA)</span>
                    </div>
                  </div>
                  <Badge
                    variant={c.status === "Accredited" ? "default" : "secondary"}
                    className={
                      c.status === "Accredited"
                        ? "bg-emerald-600 text-white text-[10px]"
                        : c.status === "In Progress"
                        ? "bg-blue-600 text-white text-[10px]"
                        : "text-[10px]"
                    }
                  >
                    {c.status}
                  </Badge>
                </div>

                <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs border-t border-border/50 pt-2">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-medium block">Body</span>
                    <Badge variant="outline" className="text-[11px] px-1 py-0 mt-0.5">{c.accreditationBody}</Badge>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-medium block">SSR Date</span>
                    <span className="text-[11px] text-foreground font-medium">{c.ssrSubmissionDate || "—"}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-muted-foreground uppercase font-medium block">Validity</span>
                    <span className="text-[11px] text-foreground">
                      {c.accreditationDate || "TBD"} – {c.validUntil || "TBD"}
                    </span>
                  </div>
                  {c.remarks && (
                    <div className="col-span-2">
                      <span className="text-[10px] text-muted-foreground uppercase font-medium block">Remarks</span>
                      <p className="text-[11px] text-muted-foreground line-clamp-2">{c.remarks}</p>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-end border-t border-border/50 pt-2">
                  <Button size="xs" variant="outline" onClick={() => openEditModal(c)}>
                    Edit Record
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Desktop Table for md+ */}
          <div className="hidden md:block">
            <ResponsiveTableContainer>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="font-semibold min-w-[90px]">Cycle</TableHead>
                    <TableHead className="font-semibold min-w-[100px]">Body</TableHead>
                    <TableHead className="font-semibold min-w-[120px]">Grade & CGPA</TableHead>
                    <TableHead className="font-semibold min-w-[170px]">Validity Period</TableHead>
                    <TableHead className="font-semibold min-w-[110px]">SSR Date</TableHead>
                    <TableHead className="font-semibold min-w-[110px]">Status</TableHead>
                    <TableHead className="font-semibold min-w-[200px]">Remarks</TableHead>
                    <TableHead className="font-semibold text-right min-w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cycles.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-bold text-foreground">
                        Cycle {c.cycleNumber}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{c.accreditationBody}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-foreground">Grade {c.grade}</span>
                          <span className="text-xs text-muted-foreground">({c.cgpa})</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {c.accreditationDate || "TBD"} – {c.validUntil || "TBD"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {c.ssrSubmissionDate || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={c.status === "Accredited" ? "default" : "secondary"}
                          className={
                            c.status === "Accredited"
                              ? "bg-emerald-600 text-white"
                              : c.status === "In Progress"
                              ? "bg-blue-600 text-white"
                              : ""
                          }
                        >
                          {c.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs text-xs text-muted-foreground truncate" title={c.remarks}>
                        {c.remarks}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="xs" variant="ghost" onClick={() => openEditModal(c)}>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ResponsiveTableContainer>
          </div>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCycle ? `Edit Accreditation Cycle ${editingCycle.cycleNumber}` : "Add New Accreditation Cycle"}
            </DialogTitle>
            <DialogDescription>
              Record accreditation details as approved by NAAC or institutional regulatory councils.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="cycleNo">Cycle Number</Label>
                <Input
                  id="cycleNo"
                  type="number"
                  value={formCycleNo}
                  onChange={(e) => setFormCycleNo(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="body">Accreditation Body</Label>
                <Input
                  id="body"
                  value={formBody}
                  onChange={(e) => setFormBody(e.target.value)}
                  placeholder="e.g. NAAC / NBA"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="instName">Institution Legal Name</Label>
              <Input
                id="instName"
                value={formInstName}
                onChange={(e) => setFormInstName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formStatus} onValueChange={(v) => setFormStatus(v as AccreditationStatus)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="SSR Submitted">SSR Submitted</SelectItem>
                    <SelectItem value="Peer Team Scheduled">Peer Team Scheduled</SelectItem>
                    <SelectItem value="Accredited">Accredited</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="grade">Grade</Label>
                <Input
                  id="grade"
                  value={formGrade}
                  onChange={(e) => setFormGrade(e.target.value)}
                  placeholder="A++ / A+"
                />
              </div>
              <div>
                <Label htmlFor="cgpa">CGPA (0 - 4.00)</Label>
                <Input
                  id="cgpa"
                  type="number"
                  step="0.01"
                  value={formCgpa}
                  onChange={(e) => setFormCgpa(e.target.value)}
                  placeholder="3.65"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="accredDate">Accreditation Date</Label>
                <Input
                  id="accredDate"
                  type="date"
                  value={formAccredDate}
                  onChange={(e) => setFormAccredDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="validUntil">Valid Until</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={formValidUntil}
                  onChange={(e) => setFormValidUntil(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="ssrDate">SSR Submission Date</Label>
                <Input
                  id="ssrDate"
                  type="date"
                  value={formSsrDate}
                  onChange={(e) => setFormSsrDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="peerDate">Peer Team Visit Date</Label>
                <Input
                  id="peerDate"
                  type="date"
                  value={formPeerDate}
                  onChange={(e) => setFormPeerDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="remarks">Remarks & Recommendations</Label>
              <Textarea
                id="remarks"
                rows={2}
                value={formRemarks}
                onChange={(e) => setFormRemarks(e.target.value)}
                placeholder="Key remarks from NAAC Executive Committee or SSR targets..."
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Cycle Record</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
