import { useState, useEffect } from "react";
import {
  Plus,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveTableContainer } from "@/components/admin/ResponsiveTableContainer";
import { getTasksList, createNaacTask, updateNaacTask } from "@/features/naac/naacService";
import type { NaacTask, TaskStatus, NaacCriterionId } from "@/types";

export default function TasksPage() {
  const [tasks, setTasks] = useState<NaacTask[]>([]);
  const [, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [tTitle, setTTitle] = useState("");
  const [tCrit, setTCrit] = useState<NaacCriterionId>(1);
  const [tMetric, setTMetric] = useState("1.1.1");
  const [tDept, setTDept] = useState("IQAC");
  const [tPerson, setTPerson] = useState("");
  const [tPriority, setTPriority] = useState<NaacTask["priority"]>("High");
  const [tDue, setTDue] = useState("");

  const loadData = () => {
    setLoading(true);
    getTasksList()
      .then((data) => setTasks(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createNaacTask(
      {
        title: tTitle,
        criterionId: tCrit,
        metricCode: tMetric,
        assignedDepartment: tDept,
        responsiblePerson: tPerson,
        priority: tPriority,
        startDate: new Date().toISOString().slice(0, 10),
        dueDate: tDue,
        status: "In Progress",
        progress: 10,
        remarks: "New assignment",
      },
      { name: "Dr. Snigdha Mohanty", role: "IQAC Coordinator" }
    );
    setModalOpen(false);
    loadData();
  };

  const handleStatusChange = async (id: string, newStatus: TaskStatus) => {
    await updateNaacTask(
      id,
      {
        status: newStatus,
        progress: newStatus === "Completed" ? 100 : 50,
      },
      { name: "Dr. Snigdha Mohanty", role: "IQAC Coordinator" }
    );
    loadData();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full min-w-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              NAAC Task & Deadline Management
            </h1>
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
              Action Items
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Assign criteria tasks, monitor department progress, and track accreditation timelines.
          </p>
        </div>

        <Button onClick={() => setModalOpen(true)} className="gap-1.5 self-start sm:self-auto shrink-0">
          <Plus className="size-4" />
          <span>Assign New Task</span>
        </Button>
      </div>

      {/* Mobile Tasks Card List (< md) */}
      <div className="md:hidden space-y-3">
        {tasks.map((task) => (
          <Card key={task.id} className="border-border/70 p-3.5 shadow-xs">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h4 className="font-semibold text-xs sm:text-sm text-foreground">{task.title}</h4>
                {task.remarks && <p className="text-[11px] text-muted-foreground mt-0.5">{task.remarks}</p>}
              </div>
              <Badge
                className={
                  task.status === "Completed"
                    ? "bg-emerald-600 text-white shrink-0 text-[10px]"
                    : task.status === "In Progress"
                    ? "bg-blue-600 text-white shrink-0 text-[10px]"
                    : task.status === "Under Review"
                    ? "bg-amber-600 text-white shrink-0 text-[10px]"
                    : "bg-slate-600 text-white shrink-0 text-[10px]"
                }
              >
                {task.status}
              </Badge>
            </div>

            <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs border-t border-border/50 pt-2">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-medium block">Metric</span>
                <Badge variant="outline" className="text-[10px] px-1 py-0 mt-0.5">
                  C{task.criterionId} · {task.metricCode}
                </Badge>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-medium block">Priority</span>
                <Badge
                  variant="secondary"
                  className={`text-[10px] px-1 py-0 mt-0.5 ${
                    task.priority === "High"
                      ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      : task.priority === "Medium"
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "bg-slate-500/10 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {task.priority}
                </Badge>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-medium block">Assigned To</span>
                <p className="text-[11px] text-foreground font-medium truncate">{task.responsiblePerson}</p>
                <p className="text-[10px] text-muted-foreground truncate">{task.assignedDepartment}</p>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-medium block">Due Date</span>
                <span className="text-[11px] text-foreground font-medium">{task.dueDate}</span>
              </div>
            </div>

            {task.status !== "Completed" && (
              <div className="mt-3 flex items-center justify-end border-t border-border/50 pt-2">
                <Button size="xs" variant="outline" onClick={() => handleStatusChange(task.id, "Completed")} className="gap-1">
                  <CheckCircle2 className="size-3 text-emerald-500" />
                  <span>Mark Done</span>
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Desktop Tasks Data Table (md+) */}
      <div className="hidden md:block">
        <ResponsiveTableContainer>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="font-semibold min-w-[240px]">Task Description</TableHead>
                <TableHead className="font-semibold min-w-[120px]">Criterion / Metric</TableHead>
                <TableHead className="font-semibold min-w-[160px]">Assigned Dept & Person</TableHead>
                <TableHead className="font-semibold min-w-[100px]">Priority</TableHead>
                <TableHead className="font-semibold min-w-[110px]">Due Date</TableHead>
                <TableHead className="font-semibold min-w-[110px]">Status</TableHead>
                <TableHead className="font-semibold text-right min-w-[110px]">Quick Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id} className="hover:bg-muted/20">
                  <TableCell className="align-top font-semibold text-xs sm:text-sm text-foreground">
                    {task.title}
                    {task.remarks && <p className="text-[11px] text-muted-foreground mt-0.5">{task.remarks}</p>}
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge variant="outline" className="text-xs">
                      C{task.criterionId} · {task.metricCode}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground align-top">
                    <p className="font-medium text-foreground">{task.responsiblePerson}</p>
                    <p className="text-[11px]">{task.assignedDepartment}</p>
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge
                      variant="secondary"
                      className={
                        task.priority === "High"
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          : task.priority === "Medium"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "bg-slate-500/10 text-slate-600 dark:text-slate-400"
                      }
                    >
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground align-top">
                    {task.dueDate}
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge
                      className={
                        task.status === "Completed"
                          ? "bg-emerald-600 text-white"
                          : task.status === "In Progress"
                          ? "bg-blue-600 text-white"
                          : task.status === "Under Review"
                          ? "bg-amber-600 text-white"
                          : "bg-slate-600 text-white"
                      }
                    >
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right align-top">
                    {task.status !== "Completed" && (
                      <Button size="xs" variant="outline" onClick={() => handleStatusChange(task.id, "Completed")}>
                        Mark Done
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ResponsiveTableContainer>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign NAAC Preparation Task</DialogTitle>
            <DialogDescription>
              Assign metric verification, data collection, or evidence collation tasks with target deadlines.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div>
              <Label htmlFor="tskTitle">Task Title</Label>
              <Input
                id="tskTitle"
                value={tTitle}
                onChange={(e) => setTTitle(e.target.value)}
                placeholder="e.g. Collate faculty publications Scopus proofs"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="tskCrit">Criterion</Label>
                <Select value={String(tCrit)} onValueChange={(v) => setTCrit(Number(v) as NaacCriterionId)}>
                  <SelectTrigger id="tskCrit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Criterion 1</SelectItem>
                    <SelectItem value="2">Criterion 2</SelectItem>
                    <SelectItem value="3">Criterion 3</SelectItem>
                    <SelectItem value="4">Criterion 4</SelectItem>
                    <SelectItem value="5">Criterion 5</SelectItem>
                    <SelectItem value="6">Criterion 6</SelectItem>
                    <SelectItem value="7">Criterion 7</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tskMet">Metric Code</Label>
                <Input
                  id="tskMet"
                  value={tMetric}
                  onChange={(e) => setTMetric(e.target.value)}
                  placeholder="3.3.1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="tskDept">Department</Label>
                <Input
                  id="tskDept"
                  value={tDept}
                  onChange={(e) => setTDept(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="tskPerson">Responsible Officer</Label>
                <Input
                  id="tskPerson"
                  value={tPerson}
                  onChange={(e) => setTPerson(e.target.value)}
                  placeholder="Faculty Name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="tskPri">Priority</Label>
                <Select value={tPriority} onValueChange={(v) => setTPriority(v as any)}>
                  <SelectTrigger id="tskPri">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tskDue">Due Date</Label>
                <Input
                  id="tskDue"
                  type="date"
                  value={tDue}
                  onChange={(e) => setTDue(e.target.value)}
                  required
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Assign Task</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
