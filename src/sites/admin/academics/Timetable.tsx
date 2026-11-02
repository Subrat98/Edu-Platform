import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { timetableService } from "@/features/academics/timetableService";
import { staffService } from "@/features/staff/staffService";
import { queryKeys } from "@/lib/queryKeys";
import type { TimetableEntry } from "@/types";

const DAYS: TimetableEntry["day"][] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function Timetable() {
  const { institutionId } = useInstitutionData();
  const queryClient = useQueryClient();
  const [groupKey, setGroupKey] = useState("");
  const [editing, setEditing] = useState<TimetableEntry | null>(null);
  const [form, setForm] = useState({ subject: "", staffId: "", room: "" });

  const { data: groups, isLoading: loadingGroups } = useQuery({ queryKey: queryKeys.timetableGroups(institutionId), queryFn: () => timetableService.listGroups(institutionId) });
  const selectedGroup = groups?.find((g) => `${g.classOrProgrammeId}::${g.section}` === groupKey);

  const { data: entries, isLoading: loadingEntries } = useQuery({
    queryKey: queryKeys.timetableGroup(institutionId, selectedGroup?.classOrProgrammeId ?? "", selectedGroup?.section ?? ""),
    queryFn: () => timetableService.getForGroup(institutionId, selectedGroup!.classOrProgrammeId, selectedGroup!.section),
    enabled: !!selectedGroup,
  });

  const { data: staff } = useQuery({ queryKey: queryKeys.staffList(institutionId), queryFn: () => staffService.list(institutionId) });

  const updateMutation = useMutation({
    mutationFn: () => timetableService.updateEntry(editing!.id, form.subject, form.staffId, form.room),
    onSuccess: (res) => {
      if (res.ok) {
        toast.success("Timetable updated");
        queryClient.invalidateQueries({ queryKey: queryKeys.timetableGroup(institutionId, selectedGroup?.classOrProgrammeId ?? "", selectedGroup?.section ?? "") });
        setEditing(null);
      } else {
        toast.error(res.error);
      }
    },
  });

  const periods = entries ? Array.from(new Set(entries.map((e) => e.periodIndex))).sort((a, b) => a - b) : [];

  if (loadingGroups) return <PageLoadingSkeleton />;

  return (
    <div>
      <AdminPageHeader title="Timetable" description="Weekly period schedule by class/section or programme/semester." />

      <div className="mb-6 max-w-sm">
        <Label>Class / Section</Label>
        <Select value={groupKey} onValueChange={setGroupKey}>
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder="Choose a class or section" />
          </SelectTrigger>
          <SelectContent>
            {(groups ?? []).map((g) => (
              <SelectItem key={`${g.classOrProgrammeId}::${g.section}`} value={`${g.classOrProgrammeId}::${g.section}`}>
                {g.className} — {g.section}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!selectedGroup ? (
        <EmptyState title="Choose a class and section" description="The weekly timetable grid will appear once you select a group above." />
      ) : loadingEntries ? (
        <PageLoadingSkeleton />
      ) : !entries || entries.length === 0 ? (
        <EmptyState title="No timetable configured for this group" />
      ) : (
        <div className="overflow-x-auto">
          <table className="border-border w-full min-w-[800px] border-collapse rounded-lg border text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="border-border w-24 border p-2 text-left font-medium">Period</th>
                {DAYS.map((d) => (
                  <th key={d} className="border-border border p-2 text-left font-medium">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((periodIndex) => {
                const first = entries.find((e) => e.periodIndex === periodIndex);
                return (
                  <tr key={periodIndex}>
                    <td className="border-border text-muted-foreground border p-2 text-xs">
                      {first ? `${first.startTime}–${first.endTime}` : periodIndex + 1}
                    </td>
                    {DAYS.map((day) => {
                      const entry = entries.find((e) => e.day === day && e.periodIndex === periodIndex);
                      if (!entry) return <td key={day} className="border-border border p-2" />;
                      const staffName = staff?.find((s) => s.id === entry.staffId)?.name ?? entry.staffId;
                      return (
                        <td
                          key={day}
                          className="border-border hover:bg-accent/5 group cursor-pointer border p-2 align-top"
                          onClick={() => {
                            setEditing(entry);
                            setForm({ subject: entry.subject, staffId: entry.staffId, room: entry.room });
                          }}
                        >
                          <p className="font-medium">{entry.subject}</p>
                          <p className="text-muted-foreground text-xs">{staffName}</p>
                          <p className="text-muted-foreground text-xs">{entry.room}</p>
                          <Pencil className="text-muted-foreground mt-1 size-3 opacity-0 group-hover:opacity-100" />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Edit period — {editing?.day}, {editing?.startTime}–{editing?.endTime}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Subject</Label>
              <Input className="mt-1.5" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} />
            </div>
            <div>
              <Label>Staff</Label>
              <Select value={form.staffId} onValueChange={(v) => setForm((f) => ({ ...f, staffId: v }))}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Choose staff" />
                </SelectTrigger>
                <SelectContent>
                  {(staff ?? []).map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Room</Label>
              <Input className="mt-1.5" value={form.room} onChange={(e) => setForm((f) => ({ ...f, room: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
