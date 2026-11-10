import { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  CheckCircle2,
  Plus,
  FileText,
  Activity,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveTableContainer } from "@/components/admin/ResponsiveTableContainer";
import {
  getIqacDataBundle,
  addIqacMeeting,
  addIqacActivity,
  updateActionTakenStatus,
  type IqacDataBundle,
} from "@/features/naac/naacService";
import type { IqacActionTaken, IqacActivity } from "@/types";

export default function IqacPage() {
  const [data, setData] = useState<IqacDataBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("committee");

  const [meetingModalOpen, setMeetingModalOpen] = useState(false);
  const [meetNo, setMeetNo] = useState("IQAC/2026-27/M03");
  const [meetDate, setMeetDate] = useState(new Date().toISOString().slice(0, 10));
  const [meetAgenda, setMeetAgenda] = useState("");
  const [meetMinutes, setMeetMinutes] = useState("");
  const [meetDecisions, setMeetDecisions] = useState("");

  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [actTitle, setActTitle] = useState("");
  const [actDate, setActDate] = useState(new Date().toISOString().slice(0, 10));
  const [actCategory, setActCategory] = useState<IqacActivity["category"]>("Workshop");
  const [actObjective, setActObjective] = useState("");
  const [actDesc, setActDesc] = useState("");
  const [actParticipants, setActParticipants] = useState(60);
  const [actOutcome, setActOutcome] = useState("");

  const [atrModalOpen, setAtrModalOpen] = useState(false);
  const [selectedAtr, setSelectedAtr] = useState<IqacActionTaken | null>(null);
  const [atrStatus, setAtrStatus] = useState<IqacActionTaken["status"]>("In Progress");
  const [atrActionTaken, setAtrActionTaken] = useState("");
  const [atrRemarks, setAtrRemarks] = useState("");

  const loadData = () => {
    setLoading(true);
    getIqacDataBundle()
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    await addIqacMeeting(
      {
        meetingNumber: meetNo,
        meetingDate: meetDate,
        agenda: meetAgenda.split("\n").filter(Boolean),
        membersPresent: ["Dr. Himansu Sekhar Das", "Dr. Snigdha Mohanty", "Prof. Animesh Senapati"],
        minutes: meetMinutes,
        decisions: meetDecisions.split("\n").filter(Boolean),
        documents: [{ name: `${meetNo.replace(/\//g, "_")}_Minutes.pdf`, url: "/documents/sample.pdf" }],
      },
      { name: "Dr. Snigdha Mohanty", role: "IQAC Coordinator" }
    );
    setMeetingModalOpen(false);
    loadData();
  };

  const handleSaveActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    await addIqacActivity(
      {
        title: actTitle,
        date: actDate,
        category: actCategory,
        objective: actObjective,
        description: actDesc || actObjective,
        participants: actParticipants,
        outcome: actOutcome,
        evidenceUrl: "/documents/sample_activity.pdf",
      },
      { name: "Dr. Snigdha Mohanty", role: "IQAC Coordinator" }
    );
    setActivityModalOpen(false);
    loadData();
  };

  const openAtrEditor = (atr: IqacActionTaken) => {
    setSelectedAtr(atr);
    setAtrStatus(atr.status);
    setAtrActionTaken(atr.actionTaken || "");
    setAtrRemarks(atr.remarks || "");
    setAtrModalOpen(true);
  };

  const handleSaveAtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAtr) return;

    await updateActionTakenStatus(
      selectedAtr.id,
      {
        status: atrStatus,
        actionTaken: atrActionTaken,
        remarks: atrRemarks,
      },
      { name: "Dr. Himansu Sekhar Das", role: "Principal" }
    );
    setAtrModalOpen(false);
    loadData();
  };

  if (loading || !data) {
    return <div className="p-6">Loading IQAC management...</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full min-w-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Internal Quality Assurance Cell (IQAC)
            </h1>
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
              Autonomous College
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Governing quality benchmarks, statutory periodic meetings, Academic & Green Audits, and Action Taken Reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => setMeetingModalOpen(true)} variant="outline" size="sm" className="gap-1.5">
            <Calendar className="size-4" />
            <span>Record Meeting</span>
          </Button>
          <Button onClick={() => setActivityModalOpen(true)} size="sm" className="gap-1.5">
            <Plus className="size-4" />
            <span>Add IQAC Activity</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="overflow-x-auto pb-1 scrollbar-none">
          <TabsList className="bg-muted/60 p-1 flex-nowrap sm:flex-wrap justify-start min-w-max">
            <TabsTrigger value="committee" className="gap-1.5 text-xs sm:text-sm whitespace-nowrap">
              <Users className="size-4" />
              <span>Committee ({data.members.length})</span>
            </TabsTrigger>
            <TabsTrigger value="meetings" className="gap-1.5 text-xs sm:text-sm whitespace-nowrap">
              <Calendar className="size-4" />
              <span>Meetings & Minutes ({data.meetings.length})</span>
            </TabsTrigger>
            <TabsTrigger value="activities" className="gap-1.5 text-xs sm:text-sm whitespace-nowrap">
              <Activity className="size-4" />
              <span>Activities & Audits ({data.activities.length})</span>
            </TabsTrigger>
            <TabsTrigger value="atr" className="gap-1.5 text-xs sm:text-sm whitespace-nowrap">
              <CheckCircle2 className="size-4" />
              <span>Action Taken Reports ({data.actionTaken.length})</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Committee Tab */}
        <TabsContent value="committee" className="space-y-4">
          <Card className="border-border/60 shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground">
                Statutory IQAC Committee Composition
              </CardTitle>
              <CardDescription>
                Formally constituted in accordance with NAAC guidelines comprising administration, faculty, alumni, students, and employers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {data.members.map((m) => (
                  <div
                    key={m.id}
                    className="flex flex-col justify-between rounded-xl border border-border/70 bg-card p-4 transition hover:border-primary/40 hover:shadow-xs"
                  >
                    <div>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] font-semibold mb-2 ${
                          m.role === "Chairperson"
                            ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                            : m.role === "Coordinator"
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {m.role}
                      </Badge>
                      <h4 className="font-bold text-sm text-foreground">{m.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{m.designation}</p>
                      <p className="text-xs font-medium text-foreground/80 mt-1">{m.department}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/40 space-y-1 text-[11px] text-muted-foreground">
                      <p className="flex items-center gap-1.5 truncate">
                        <Mail className="size-3 shrink-0" />
                        <span className="truncate">{m.email}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Phone className="size-3 shrink-0" />
                        <span>{m.contactNumber}</span>
                      </p>
                      <div className="flex justify-between pt-1 text-[10px]">
                        <span>Tenure: {m.tenure}</span>
                        <span>Appointed: {m.appointmentDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Meetings Tab */}
        <TabsContent value="meetings" className="space-y-4">
          {data.meetings.map((meet) => (
            <Card key={meet.id} className="border-border/60 shadow-xs">
              <CardHeader className="bg-muted/10 border-b border-border/40 py-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-primary" />
                    <CardTitle className="text-base font-bold text-foreground">
                      {meet.meetingNumber}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {meet.meetingDate}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {meet.membersPresent.length} Members in Attendance
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Meeting Agenda
                  </h4>
                  <ul className="mt-1 list-disc pl-5 text-xs text-foreground space-y-0.5">
                    {meet.agenda.map((ag, i) => (
                      <li key={i}>{ag}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Minutes & Deliberations
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed bg-muted/20 p-2.5 rounded-lg border border-border/40">
                    {meet.minutes}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Key Decisions & Resolutions
                  </h4>
                  <ul className="mt-1 space-y-1">
                    {meet.decisions.map((dec, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                        <CheckCircle2 className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                        <span>{dec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {meet.documents.length > 0 && (
                  <div className="pt-2 border-t border-border/40 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Minutes Document:</span>
                    {meet.documents.map((doc, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs cursor-pointer gap-1">
                        <FileText className="size-3" /> {doc.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Activities Tab with Mobile Cards & Desktop Table */}
        <TabsContent value="activities" className="space-y-4">
          <Card className="border-border/60 shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground">
                IQAC Quality Initiatives & Training Sessions
              </CardTitle>
              <CardDescription>
                Faculty Development Programmes, Green/Energy Audits, and Academic Quality Circles
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {data.activities.map((act) => (
                  <Card key={act.id} className="border-border/70 p-3.5 shadow-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-xs sm:text-sm text-foreground">{act.title}</h4>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{act.objective}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] shrink-0">
                        {act.category}
                      </Badge>
                    </div>

                    <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs border-t border-border/50 pt-2">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-medium block">Date</span>
                        <span className="text-[11px] text-foreground font-medium">{act.date}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-medium block">Participants</span>
                        <span className="text-[11px] text-foreground font-medium">{act.participants} Faculty/Staff</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] text-muted-foreground uppercase font-medium block">Outcome</span>
                        <p className="text-[11px] text-muted-foreground line-clamp-2">{act.outcome}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-end border-t border-border/50 pt-2">
                      <Button size="xs" variant="ghost" className="gap-1 text-primary">
                        <ExternalLink className="size-3" /> Report
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block">
                <ResponsiveTableContainer>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40">
                        <TableHead className="font-semibold min-w-[220px]">Activity Title</TableHead>
                        <TableHead className="font-semibold min-w-[110px]">Category</TableHead>
                        <TableHead className="font-semibold min-w-[100px]">Date</TableHead>
                        <TableHead className="font-semibold min-w-[110px]">Participants</TableHead>
                        <TableHead className="font-semibold min-w-[220px]">Outcome & Impact</TableHead>
                        <TableHead className="font-semibold text-right min-w-[80px]">Proof</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.activities.map((act) => (
                        <TableRow key={act.id}>
                          <TableCell className="align-top">
                            <p className="font-semibold text-xs sm:text-sm text-foreground">{act.title}</p>
                            <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{act.objective}</p>
                          </TableCell>
                          <TableCell className="align-top">
                            <Badge variant="outline" className="text-xs">
                              {act.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground align-top">
                            {act.date}
                          </TableCell>
                          <TableCell className="text-xs font-semibold text-foreground align-top">
                            {act.participants} Faculty/Staff
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-xs align-top">
                            {act.outcome}
                          </TableCell>
                          <TableCell className="text-right align-top">
                            <Button size="xs" variant="ghost" className="gap-1 text-primary">
                              <ExternalLink className="size-3" /> Report
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
        </TabsContent>

        {/* Action Taken Reports Tab with Mobile Cards & Desktop Table */}
        <TabsContent value="atr" className="space-y-4">
          <Card className="border-border/60 shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground">
                Action Taken Reports (ATR)
              </CardTitle>
              <CardDescription>
                Statutory tracking of resolutions made in IQAC meetings and subsequent implementations
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              {/* Mobile ATR Cards */}
              <div className="md:hidden space-y-3">
                {data.actionTaken.map((atr) => (
                  <Card key={atr.id} className="border-border/70 p-3.5 shadow-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold text-xs text-primary">{atr.meetingNumber}</span>
                        <p className="font-medium text-xs text-foreground mt-0.5">{atr.decision}</p>
                      </div>
                      <Badge
                        className={
                          atr.status === "Completed"
                            ? "bg-emerald-600 text-white shrink-0 text-[10px]"
                            : atr.status === "In Progress"
                            ? "bg-amber-600 text-white shrink-0 text-[10px]"
                            : "bg-slate-600 text-white shrink-0 text-[10px]"
                        }
                      >
                        {atr.status}
                      </Badge>
                    </div>

                    <div className="mt-2.5 space-y-1.5 text-xs border-t border-border/50 pt-2">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-medium block">Action Taken & Progress</span>
                        <p className="text-[11px] text-foreground mt-0.5">{atr.actionTaken}</p>
                      </div>
                      <div className="flex justify-between items-center pt-1 text-[11px] text-muted-foreground">
                        <span>Responsible: <strong className="text-foreground">{atr.responsiblePerson}</strong></span>
                        <span>Deadline: {atr.deadline}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-end border-t border-border/50 pt-2">
                      <Button size="xs" variant="outline" onClick={() => openAtrEditor(atr)}>
                        Update Status
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Desktop ATR Table */}
              <div className="hidden md:block">
                <ResponsiveTableContainer>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40">
                        <TableHead className="font-semibold min-w-[130px]">Meeting Ref</TableHead>
                        <TableHead className="font-semibold min-w-[200px]">Resolution / Decision</TableHead>
                        <TableHead className="font-semibold min-w-[240px]">Action Taken & Progress</TableHead>
                        <TableHead className="font-semibold min-w-[140px]">Responsible</TableHead>
                        <TableHead className="font-semibold min-w-[110px]">Status</TableHead>
                        <TableHead className="font-semibold text-right min-w-[80px]">Update</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.actionTaken.map((atr) => (
                        <TableRow key={atr.id}>
                          <TableCell className="font-bold text-xs text-foreground align-top">
                            {atr.meetingNumber}
                          </TableCell>
                          <TableCell className="text-xs font-medium text-foreground align-top max-w-xs">
                            {atr.decision}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground align-top max-w-sm">
                            {atr.actionTaken}
                            {atr.remarks && (
                              <p className="mt-1 text-[11px] text-primary/80 font-medium">
                                Note: {atr.remarks}
                              </p>
                            )}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground align-top">
                            {atr.responsiblePerson}
                          </TableCell>
                          <TableCell className="align-top">
                            <Badge
                              className={
                                atr.status === "Completed"
                                  ? "bg-emerald-600 text-white"
                                  : atr.status === "In Progress"
                                  ? "bg-amber-600 text-white"
                                  : "bg-slate-600 text-white"
                              }
                            >
                              {atr.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right align-top">
                            <Button size="xs" variant="outline" onClick={() => openAtrEditor(atr)}>
                              Update
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
        </TabsContent>
      </Tabs>

      {/* Meeting Dialog */}
      <Dialog open={meetingModalOpen} onOpenChange={setMeetingModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Record Formal IQAC Meeting</DialogTitle>
            <DialogDescription>
              Log meeting number, minutes, decisions and action items for statutory documentation.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveMeeting} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="mNumber">Meeting Number</Label>
                <Input
                  id="mNumber"
                  value={meetNo}
                  onChange={(e) => setMeetNo(e.target.value)}
                  placeholder="IQAC/2026-27/M03"
                  required
                />
              </div>
              <div>
                <Label htmlFor="mDate">Meeting Date</Label>
                <Input
                  id="mDate"
                  type="date"
                  value={meetDate}
                  onChange={(e) => setMeetDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="mAgenda">Agenda Items (One per line)</Label>
              <Textarea
                id="mAgenda"
                rows={3}
                value={meetAgenda}
                onChange={(e) => setMeetAgenda(e.target.value)}
                placeholder="1. Review of research funding&#10;2. Student Satisfaction Survey analysis"
                required
              />
            </div>

            <div>
              <Label htmlFor="mMinutes">Minutes & Deliberations</Label>
              <Textarea
                id="mMinutes"
                rows={3}
                value={meetMinutes}
                onChange={(e) => setMeetMinutes(e.target.value)}
                placeholder="Detailed summary of proceedings and discussions..."
                required
              />
            </div>

            <div>
              <Label htmlFor="mDecisions">Decisions & Resolutions (One per line)</Label>
              <Textarea
                id="mDecisions"
                rows={2}
                value={meetDecisions}
                onChange={(e) => setMeetDecisions(e.target.value)}
                placeholder="1. Resolved to approve revised curriculum structure"
                required
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setMeetingModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Meeting Record</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Activity Dialog */}
      <Dialog open={activityModalOpen} onOpenChange={setActivityModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add IQAC Initiative / Activity</DialogTitle>
            <DialogDescription>
              Record quality development initiatives, audits, or workshops for Criterion 6 and AQAR.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveActivity} className="space-y-4 pt-2">
            <div>
              <Label htmlFor="actTitle">Activity Title</Label>
              <Input
                id="actTitle"
                value={actTitle}
                onChange={(e) => setActTitle(e.target.value)}
                placeholder="e.g. National Workshop on Digital Pedagogy"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="actCategory">Category</Label>
                <Select value={actCategory} onValueChange={(v) => setActCategory(v as any)}>
                  <SelectTrigger id="actCategory">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FDP">FDP</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Seminar">Seminar</SelectItem>
                    <SelectItem value="Academic Audit">Academic Audit</SelectItem>
                    <SelectItem value="Green Audit">Green Audit</SelectItem>
                    <SelectItem value="Curriculum Review">Curriculum Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="actDate">Date</Label>
                <Input
                  id="actDate"
                  type="date"
                  value={actDate}
                  onChange={(e) => setActDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="actParticipants">Participants</Label>
                <Input
                  id="actParticipants"
                  type="number"
                  value={actParticipants}
                  onChange={(e) => setActParticipants(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="actObjective">Objective</Label>
              <Input
                id="actObjective"
                value={actObjective}
                onChange={(e) => setActObjective(e.target.value)}
                placeholder="Purpose of the initiative..."
                required
              />
            </div>

            <div>
              <Label htmlFor="actOutcome">Outcome & Impact</Label>
              <Textarea
                id="actOutcome"
                rows={2}
                value={actOutcome}
                onChange={(e) => setActOutcome(e.target.value)}
                placeholder="Tangible outcome achieved..."
                required
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setActivityModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Record Activity</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ATR Dialog */}
      <Dialog open={atrModalOpen} onOpenChange={setAtrModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Action Taken Status</DialogTitle>
            <DialogDescription className="line-clamp-2">
              {selectedAtr?.decision}
            </DialogDescription>
          </DialogHeader>

          {selectedAtr && (
            <form onSubmit={handleSaveAtr} className="space-y-4 pt-2">
              <div>
                <Label htmlFor="atrStat">Status</Label>
                <Select value={atrStatus} onValueChange={(v) => setAtrStatus(v as any)}>
                  <SelectTrigger id="atrStat">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="atrAction">Action Taken Details</Label>
                <Textarea
                  id="atrAction"
                  rows={3}
                  value={atrActionTaken}
                  onChange={(e) => setAtrActionTaken(e.target.value)}
                  placeholder="Concrete steps undertaken..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="atrRem">Remarks</Label>
                <Input
                  id="atrRem"
                  value={atrRemarks}
                  onChange={(e) => setAtrRemarks(e.target.value)}
                  placeholder="Additional notes or references..."
                />
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={() => setAtrModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update ATR</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
